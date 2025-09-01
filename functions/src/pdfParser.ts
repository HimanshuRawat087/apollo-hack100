import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import cors from 'cors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

if (!admin.apps.length) {
  admin.initializeApp();
}

const corsHandler = cors({ origin: true });

interface PdfParseRequest {
  pdfUrl: string;
  uid: string;
}

/**
 * PDF Parser function that extracts candidate email from uploaded PDF
 */
export const parsePdfForEmail = onRequest({ region: 'us-central1' }, (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const { pdfUrl, uid }: PdfParseRequest = req.body;

      if (!pdfUrl) {
        res.status(400).json({ 
          success: false, 
          error: 'PDF URL is required' 
        });
        return;
      }

      if (!uid) {
        res.status(400).json({ 
          success: false, 
          error: 'User ID is required' 
        });
        return;
      }

      console.log('Parsing PDF from URL:', pdfUrl);

      // Download the PDF from Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = pdfUrl.split('/o/')[1]?.split('?')[0];
      
      if (!fileName) {
        res.status(400).json({ 
          success: false, 
          error: 'Invalid PDF URL format' 
        });
        return;
      }

      const decodedFileName = decodeURIComponent(fileName);
      const file = bucket.file(decodedFileName);
      
      // Download the file
      const [fileBuffer] = await file.download();
      
      // Parse the PDF
      const pdfData = await pdfParse(fileBuffer);
      const text = pdfData.text;

      console.log('PDF text extracted, length:', text.length);

      // Extract email using regex patterns
      const emailPatterns = [
        // Standard email pattern
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        // Email with common prefixes
        /(?:email|e-mail|mail|contact)[\s:]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi,
        // Email in parentheses or brackets
        /[\(\[\{]([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})[\)\]\}]/g
      ];

      let candidateEmail: string | null = null;
      const foundEmails: string[] = [];

      // Try each pattern
      for (const pattern of emailPatterns) {
        const matches = text.match(pattern);
        if (matches) {
          foundEmails.push(...matches);
        }
      }

      // Remove duplicates and filter out common non-candidate emails
      const uniqueEmails = [...new Set(foundEmails)];
      const filteredEmails = uniqueEmails.filter(email => {
        const lowerEmail = email.toLowerCase();
        // Filter out common system/company emails
        return !lowerEmail.includes('noreply') && 
               !lowerEmail.includes('no-reply') &&
               !lowerEmail.includes('donotreply') &&
               !lowerEmail.includes('support') &&
               !lowerEmail.includes('info@') &&
               !lowerEmail.includes('admin@') &&
               !lowerEmail.includes('hr@') &&
               !lowerEmail.includes('recruitment@') &&
               !lowerEmail.includes('careers@');
      });

      console.log('Found emails:', filteredEmails);

      // Select the first valid email as candidate email
      if (filteredEmails.length > 0) {
        candidateEmail = filteredEmails[0];
      }

      // Log the parsing attempt
      await admin.firestore().collection('pdfParsingLogs').add({
        uid,
        pdfUrl,
        textLength: text.length,
        foundEmails: uniqueEmails,
        filteredEmails,
        selectedEmail: candidateEmail,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        success: !!candidateEmail
      });

      if (candidateEmail) {
        res.status(200).json({
          success: true,
          candidateEmail
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'No candidate email found in PDF'
        });
      }

    } catch (error: any) {
      console.error('PDF parsing error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to parse PDF'
      });
    }
  });
}); 