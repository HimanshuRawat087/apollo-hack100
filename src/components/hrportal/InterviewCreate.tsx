'use client';

import React, { useState, useEffect } from 'react';
import PdfUpload from './PdfUpload';
import PdfViewer from './PdfViewer';
import EmailInput from './EmailInput';
import { useAuth } from '@/context/auth-context';
import { uploadResumeToStorage, createInterviewDocument, createConversationDocument, updateInterviewStatusToEmailSent } from '@/services/firestoreService';
import { parsePdfForEmail } from '@/services/pdfParserService';
import { sendGmailEmail } from '@/services/gmailService';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const InterviewCreate = () => {
  const { user, loading } = useAuth();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [interviewerEmail, setInterviewerEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidateEmailError, setCandidateEmailError] = useState<string | null>(null);
  const [pdfParsingLoading, setPdfParsingLoading] = useState(false);
  const [pdfParsingError, setPdfParsingError] = useState<string | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [interviewDocId, setInterviewDocId] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<{ docId: string; candidateEmail: string } | null>(null);
  const [emailSendLoading, setEmailSendLoading] = useState(false);
  const [emailSendError, setEmailSendError] = useState<string | null>(null);
  const [emailSendSuccess, setEmailSendSuccess] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [conversationSuccess, setConversationSuccess] = useState(false);
  const [interviewStatusError, setInterviewStatusError] = useState<string | null>(null);
  const [interviewStatusSuccess, setInterviewStatusSuccess] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const db = getFirestore();
  
      const checkGmailConnection = async () => {
        const tokenDoc = await getDoc(doc(db, 'gmailTokens', user.uid));
        setGmailConnected(!!(tokenDoc.exists() && tokenDoc.data().refresh_token));
      };
  
      checkGmailConnection();
  
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'GMAIL_AUTH_SUCCESS') {
          console.log('✅ Received Gmail auth success');
          checkGmailConnection(); // refresh UI state
        }
      };
  
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [user, loading]); 

  if (loading || !user) {
    return null;
  }

  const canUpload = pdfFile !== null && interviewerEmail.length > 0 && !emailError && !pdfError && gmailConnected;

  const handleUploadClick = async () => {
    if (!pdfFile) {
      setPdfError('Please select a PDF file before uploading.');
      setGeneralError(null);
      return;
    }
    setPdfError(null);
    setGeneralError(null);
    setEmailSendError(null);
    setEmailSendSuccess(false);
    setConversationError(null);
    setConversationSuccess(false);
    setInterviewStatusError(null);
    setInterviewStatusSuccess(false);
    setPdfParsingError(null);
    setPdfParsingLoading(false);
    try {
      const url = await uploadResumeToStorage(pdfFile);
      setResumeUrl(url);
      setPdfParsingLoading(true);
      const parseResult = await parsePdfForEmail(url, user.uid);
      setPdfParsingLoading(false);
      if (!parseResult.success) {
        setPdfParsingError(parseResult.error || 'Failed to extract email from PDF');
        return;
      }
      const extractedCandidateEmail = parseResult.candidateEmail!;
      setCandidateEmail(extractedCandidateEmail);
      const status = 'pending';
      const docId = await createInterviewDocument({
        candidateEmail: extractedCandidateEmail,
        interviewerEmail,
        recruiterEmail: user.email || 'noreply@company.com',
        resumeUrl: url,
        status,
        createdBy: user.uid,
      });
      setInterviewDocId(docId);
      setLastSuccess({ docId, candidateEmail: extractedCandidateEmail });
      setGeneralError(null);
      setEmailSendLoading(true);
      if (!gmailConnected) {
        setEmailSendError('Please connect your Gmail account first.');
        setEmailSendLoading(false);
        return;
      }
      const senderEmail = user.email || 'noreply@company.com';
      const emailResult = await sendGmailEmail({
        to: extractedCandidateEmail,
        from: senderEmail,
        subject: `Interview Invitation [InterviewID: ${docId}]`,
        html: `<p>Dear ${extractedCandidateEmail.split('@')[0]},<br/>You are invited to an interview. Please reply with your available time slots.<br/>Best regards,<br/>${user.displayName || senderEmail}</p>`,
        uid: user.uid,
      });
      setEmailSendLoading(false);
      if (!emailResult.success) {
        setEmailSendError(emailResult.error?.message || 'Failed to send email.');
      } else {
        setEmailSendSuccess(true);
        try {
          await createConversationDocument({
            interview_id: docId,
            message_id: emailResult.messageId || '',
            to: extractedCandidateEmail,
            from: senderEmail,
            subject: `Interview Invitation [InterviewID: ${docId}]`,
            content: `<p>Dear Candidate,<br/>You are invited to an interview. Please reply with your available time slots.<br/>Best regards,<br/>Recruiter</p>`,
            processState: true,
          });
          setConversationSuccess(true);
          try {
            await updateInterviewStatusToEmailSent(docId);
            setInterviewStatusSuccess(true);
          } catch (err: any) {
            setInterviewStatusError(err.message || 'Failed to update Interview status.');
          }
        } catch (err: any) {
          setConversationError(err.message || 'Failed to log conversation in Firestore.');
        }
      }
      setPdfFile(null);
      setCandidateEmail('');
      setCandidateEmailError(null);
      setInterviewerEmail('');
      setEmailError(null);
      setResumeUrl(null);
      setTimeout(() => setInterviewDocId(null), 100);
    } catch (err: any) {
      if (err.message && err.message.includes('Firebase Storage')) {
        setGeneralError('Failed to upload PDF to storage. Please try again.');
      } else if (err.message && err.message.includes('interview')) {
        setGeneralError('Failed to create interview record. Please try again.');
      } else {
        setPdfError(err.message || 'Failed to process or upload PDF.');
      }
      setInterviewDocId(null);
      setEmailSendLoading(false);
      setPdfParsingLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 480, width: '100%', padding: '2rem', border: '1px solid #eee', borderRadius: 8, background: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Interview Initiation</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: '1.5rem' }}>
        Upload a candidate's resume PDF and enter the interviewer's email. The system will automatically extract the candidate's email from the PDF and send an interview invitation.
      </p>
      {!gmailConnected ? (
        <button
          style={{ marginBottom: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}
          onClick={() => {
            const popup = window.open(
              `https://startgmailauth-fvtj5v3sya-uc.a.run.app?uid=${user.uid}`,
              'gmail-oauth',
              'width=500,height=600'
            );
          }}
        >
          Connect Gmail
        </button>
      ) : (
        <div style={{ marginBottom: 16, color: '#388e3c', fontWeight: 500 }}>✅ Mail access granted</div>
      )}
      {lastSuccess && !pdfError && !generalError && (
        <div style={{ background: '#e6f4ea', color: '#256029', border: '1px solid #b7ebc6', borderRadius: 4, padding: '1rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          Interview created successfully! (ID: {lastSuccess.docId})<br />
          Candidate: {lastSuccess.candidateEmail}
          {pdfParsingLoading && <div style={{ color: '#1976d2', marginTop: 8 }}>Extracting email from PDF...</div>}
          {pdfParsingError && <div style={{ color: '#d32f2f', marginTop: 8 }}>PDF parsing error: {pdfParsingError}</div>}
          {emailSendLoading && <div style={{ color: '#1976d2', marginTop: 8 }}>Sending interview email...</div>}
          {emailSendSuccess && <div style={{ color: '#388e3c', marginTop: 8 }}>Interview email sent to candidate!</div>}
          {emailSendError && <div style={{ color: '#d32f2f', marginTop: 8 }}>Email error: {emailSendError}</div>}
          {conversationSuccess && <div style={{ color: '#388e3c', marginTop: 8 }}>Conversation logged in Firestore!</div>}
          {conversationError && <div style={{ color: '#d32f2f', marginTop: 8 }}>Conversation error: {conversationError}</div>}
          {interviewStatusSuccess && <div style={{ color: '#388e3c', marginTop: 8 }}>Interview status updated to "email_to_candidate"!</div>}
          {interviewStatusError && <div style={{ color: '#d32f2f', marginTop: 8 }}>Interview status error: {interviewStatusError}</div>}
        </div>
      )}
      {generalError && (
        <div style={{ background: '#fdecea', color: '#b71c1c', border: '1px solid #f5c6cb', borderRadius: 4, padding: '1rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          {generalError}
        </div>
      )}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Upload Resume (PDF)</h2>
        <div style={{ border: '1px dashed #bbb', padding: '1rem', borderRadius: 4, background: '#fafafa' }}>
          <PdfUpload onFileSelect={file => { setPdfFile(file); setPdfError(null); }} />
          {pdfFile === null ? (
            <p style={{ color: '#888', marginTop: 8 }}>No PDF selected</p>
          ) : (
            <p style={{ color: '#4caf50', marginTop: 8 }}>{pdfFile.name} selected</p>
          )}
          <PdfViewer file={pdfFile} />
          {pdfError && (
            <p style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>{pdfError}</p>
          )}
        </div>
      </section>
      {candidateEmail && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Extracted Candidate Email</h2>
          <div style={{ border: '1px solid #4caf50', padding: '1rem', borderRadius: 4, background: '#f1f8e9' }}>
            <p style={{ color: '#2e7d32', fontWeight: 500, margin: 0 }}>
              📧 {candidateEmail}
            </p>
            <p style={{ color: '#666', fontSize: 12, marginTop: 4, marginBottom: 0 }}>
              Email automatically extracted from the uploaded PDF
            </p>
          </div>
        </section>
      )}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Interviewer Email</h2>
        <div style={{ border: '1px dashed #bbb', padding: '1rem', borderRadius: 4, background: '#fafafa' }}>
          <EmailInput
            value={interviewerEmail}
            onChange={e => setInterviewerEmail(e.target.value)}
            onError={setEmailError}
          />
          {emailError && interviewerEmail.length > 0 && (
            <p style={{ color: '#d32f2f', fontSize: 14, marginTop: 4 }}>{emailError}</p>
          )}
          <button
            type="button"
            disabled={!canUpload}
            style={{
              marginTop: 16,
              padding: '0.75rem 1.5rem',
              borderRadius: 4,
              border: 'none',
              background: canUpload ? '#1976d2' : '#ccc',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              cursor: canUpload ? 'pointer' : 'not-allowed',
              width: '100%'
            }}
            onClick={handleUploadClick}
          >
            {pdfParsingLoading ? 'Processing PDF...' : 'Upload & Process'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default InterviewCreate; 