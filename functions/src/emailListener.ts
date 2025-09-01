import { onSchedule } from 'firebase-functions/v2/scheduler';
import { google } from 'googleapis';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v2';

if (!admin.apps.length) {
  admin.initializeApp();
}

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://oauth2callback-fvtj5v3sya-uc.a.run.app';

interface EmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ body: { data?: string } }>;
  };
}

/**
 * Scheduled function that runs every 5 minutes to check for new email responses
 */
export const checkIncomingEmails = onSchedule({
  schedule: 'every 5 minutes',
  region: 'us-central1',
  retryCount: 3,
}, async (event) => {
  try {
    logger.info('Starting email check at:', new Date().toISOString());
    
    // Get all active interviews (not completed)
    const interviewsSnapshot = await admin.firestore()
      .collection('interviews')
      .where('status', '!=', 'completed')
      .get();

    if (interviewsSnapshot.empty) {
      logger.info('No active interviews found');
      return;
    }

    logger.info(`Found ${interviewsSnapshot.size} active interviews`);

    // Process each active interview
    for (const interviewDoc of interviewsSnapshot.docs) {
      const interviewData = interviewDoc.data();
      const interviewId = interviewDoc.id;
      
      try {
        await processInterviewEmails(interviewId, interviewData);
      } catch (error) {
        logger.error(`Error processing interview ${interviewId}:`, error);
        // Continue with other interviews even if one fails
      }
    }

    logger.info('Email check completed successfully');
  } catch (error) {
    logger.error('Error in email check:', error);
    throw error;
  }
});

/**
 * Process emails for a specific interview
 */
async function processInterviewEmails(interviewId: string, interviewData: any) {
  // Get the recruiter's Gmail tokens
  const recruiterUid = interviewData.created_by;
  if (!recruiterUid) {
    logger.warn(`No recruiter UID found for interview ${interviewId}`);
    return;
  }

  const tokenDoc = await admin.firestore()
    .collection('gmailTokens')
    .doc(recruiterUid)
    .get();

  if (!tokenDoc.exists) {
    logger.warn(`No Gmail tokens found for recruiter ${recruiterUid}`);
    return;
  }

  const tokenData = tokenDoc.data()!;
  
  // Set up OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: tokenData.refresh_token });
  
  // Get fresh access token
  await oAuth2Client.getAccessToken();
  
  // Initialize Gmail API
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  // Build Gmail query to find relevant emails
  const candidateEmail = interviewData.candidateEmail;
  const interviewerEmail = interviewData.interviewerEmail;
  
  // Add a 10-minute time filter to the Gmail query
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  const tenMinutesAgo = now - 10 * 60; // 10 minutes ago in seconds
  // Query for emails from candidate or interviewer in the last 10 minutes
  const query = `(from:${candidateEmail} OR from:${interviewerEmail}) after:${tenMinutesAgo}`;
  
  logger.info(`Searching for emails with query: ${query}`);

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 50, // Limit to prevent overwhelming
    });

    const messages = response.data.messages || [];
    logger.info(`Found ${messages.length} new messages for interview ${interviewId}`);

    // Process each message
    for (const message of messages) {
      try {
        await processEmailMessage(interviewId, message.id!, gmail);
      } catch (error) {
        logger.error(`Error processing message ${message.id}:`, error);
      }
    }

  } catch (error) {
    logger.error(`Error fetching emails for interview ${interviewId}:`, error);
    throw error;
  }
}

/**
 * Process a single email message
 */
async function processEmailMessage(interviewId: string, messageId: string, gmail: any) {
  try {
    // Get full message details
    const messageResponse = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const message = messageResponse.data as EmailMessage;
    
    // Extract email headers
    const headers = message.payload.headers;
    const from = headers.find(h => h.name === 'From')?.value || '';
    const to = headers.find(h => h.name === 'To')?.value || '';
    let subject = headers.find(h => h.name === 'Subject')?.value || '';
    
    // Try to extract interviewId from subject
    const extractedInterviewId = extractInterviewIdFromSubject(subject);
    if (extractedInterviewId && extractedInterviewId !== interviewId) {
      // If the extracted interviewId does not match the current one, skip processing
      logger.info(`Message ${messageId} subject interviewId (${extractedInterviewId}) does not match expected interviewId (${interviewId}), skipping.`);
      return;
    }
    // If not present, append interviewId to subject for new outgoing emails
    if (!extractInterviewIdFromSubject(subject)) {
      subject = `${subject} [InterviewID: ${interviewId}]`;
    }

    // Extract email content
    let content = '';
    if (message.payload.body?.data) {
      content = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    } else if (message.payload.parts) {
      // Handle multipart messages
      for (const part of message.payload.parts) {
        if (part.body?.data) {
          content += Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
      }
    }

    // Check if this message is already processed or needs processing
    const existingConversationSnapshot = await admin.firestore()
      .collection('conversations')
      .where('message_id', '==', messageId)
      .where('interview_id', '==', interviewId)
      .limit(1)
      .get();

    if (!existingConversationSnapshot.empty) {
      const conversationDoc = existingConversationSnapshot.docs[0];
      const conversationData = conversationDoc.data();
      if (conversationData.processState === true) {
        logger.info(`Message ${messageId} already processed for interview ${interviewId}, skipping`);
        return;
      } else {
        // Process with AI and update processState after
        await triggerAIProcessing(conversationDoc.id, interviewId, messageId);
        await admin.firestore()
          .collection('conversations')
          .doc(conversationDoc.id)
          .update({ processState: true });
        return;
      }
    }

    // Create conversation document (not processed yet)
    const cleanedContent = extractNewMessageContent(content);
    const conversationRef = await admin.firestore()
      .collection('conversations')
      .add({
        interview_id: interviewId,
        message_id: messageId,
        to: to, // leave as is
        from: extractEmail(from), // normalize only 'from'
        content: cleanedContent,
        subject: subject,
        processState: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    logger.info(`Created conversation document: ${conversationRef.id} for interview ${interviewId}`);

    // Process with AI and update processState after
    await triggerAIProcessing(conversationRef.id, interviewId, messageId);
    await admin.firestore()
      .collection('conversations')
      .doc(conversationRef.id)
      .update({ processState: true });

  } catch (error) {
    logger.error(`Error processing message ${messageId}:`, error);
    throw error;
  }
}

/**
 * Trigger AI processing for the conversation
 */
async function triggerAIProcessing(conversationId: string, interviewId: string, messageId: string) {
  try {
    // Check if an aiRequests document already exists for this interview
    const aiRequestSnapshot = await admin.firestore()
      .collection('aiRequests')
      .where('interview_id', '==', interviewId)
      .limit(1)
      .get();

    if (aiRequestSnapshot.empty) {
      // Create AI request document if it doesn't exist for this interview
      await admin.firestore()
        .collection('aiRequests')
        .add({
          conversation_id: conversationId, // Store the latest conversation/message
          interview_id: interviewId,
          message_id: messageId,
          nextStep: 'pending',
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      logger.info(`Created AI request for interview ${interviewId}`);
    } else {
      logger.info(`AI request already exists for interview ${interviewId}`);
      // Optionally, update the existing doc with the latest conversation/message info
      const aiRequestDoc = aiRequestSnapshot.docs[0];
      await aiRequestDoc.ref.update({
        conversation_id: conversationId,
        message_id: messageId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    // Call the AI processing function
    const response = await fetch('https://us-central1-role-auth-7bc43.cloudfunctions.net/processEmailWithAI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
        interviewId,
        messageId,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI processing failed: ${response.statusText}`);
    }

    const result = await response.json();
    logger.info(`AI processing completed for message ${messageId}:`, result);
    
  } catch (error) {
    logger.error(`Error triggering AI processing:`, error);
    throw error;
  }
} 

// Helper to clean email content: remove quoted text and HTML tags
function extractNewMessageContent(rawContent: string): string {
  // Remove quoted replies (common patterns: "On ... wrote:", "From:", etc.)
  const splitPatterns = [
    /On\s.+wrote:/i,
    /From:.+\n/i,
    /<div class=\"gmail_quote\">/i
  ];
  let cleaned = rawContent;
  for (const pattern of splitPatterns) {
    const match = cleaned.match(pattern);
    if (match) {
      cleaned = cleaned.substring(0, match.index).trim();
      break;
    }
  }
  // Strip HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '').trim();
  return cleaned;
} 

// Helper to extract email address from a string like "Name <email@domain.com>"
function extractEmail(str: string) {
  const match = str.match(/<([^>]+)>/);
  return match ? match[1] : str.trim();
} 

// Helper to extract interviewId from subject line
function extractInterviewIdFromSubject(subject: string): string | null {
  const match = subject.match(/\[InterviewID: ([^\]]+)\]/);
  return match ? match[1] : null;
} 