import { onRequest } from 'firebase-functions/v2/https';
import { google } from 'googleapis';
import * as admin from 'firebase-admin';
import cors from 'cors';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://oauth2callback-fvtj5v3sya-uc.a.run.app';

const corsHandler = cors({ origin: true });

/**
 * Gmail email sending service (frontend must provide final HTML/text content)
 */
export const sendGmailEmail = onRequest({ region: 'us-central1' }, (req, res) => {
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
      const { to, from, subject, uid, html } = req.body as {
        to: string;
        from: string;
        subject: string;
        uid: string;
        html?: string;
      };
      // 1. Get refresh token from Firestore
      const doc = await admin.firestore().collection('gmailTokens').doc(uid).get();
      const data = doc.data();
      if (!data || !data.refresh_token) {
        res.status(400).json({ success: false, error: 'No Gmail refresh token found for user.' });
        return; 
      }
      // 2. Set up OAuth2 client
      const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      oAuth2Client.setCredentials({ refresh_token: data.refresh_token });
      // 3. Get fresh access token
      await oAuth2Client.getAccessToken();
      // 4. Use provided HTML (or text) as email content
      if (!html) {
        res.status(400).json({ success: false, error: 'No email content (html) provided.' });
        return;
      }
      // 5. Send email as before, using oAuth2Client as auth
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      const message =
        `To: ${to}\r\n` +
        `From: ${from}\r\n` +
        `Subject: ${subject}\r\n` +
        'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
        html;
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });
      res.status(200).json({ success: true, messageId: response.data.id });
    } catch (error: any) {
      console.error('Request body:', req.body);
      console.error('Gmail send error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}); 