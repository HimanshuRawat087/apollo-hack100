import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';
import { FieldValue } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp();
}

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://oauth2callback-fvtj5v3sya-uc.a.run.app';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export const startGmailAuth = onRequest({ region: 'us-central1' }, (req, res) => {
  // Debug logging
  console.log('CLIENT_ID:', CLIENT_ID);
  console.log('CLIENT_SECRET:', CLIENT_SECRET ? 'set' : 'not set');
  console.log('REDIRECT_URI:', REDIRECT_URI);

  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://mail.google.com/', // Gmail full access
      'https://www.googleapis.com/auth/calendar', // Calendar read/write (includes Meet)
      'profile',
      'email',
    ],
    prompt: 'consent',
    state: req.query.uid as string, // Pass user ID for later association
  });
  res.redirect(url);
});

export const oauth2callback = onRequest({ region: 'us-central1' }, async (req, res) => {
  const code = req.query.code as string;
  const uid = req.query.state as string; // Get user ID from state
  const { tokens } = await oAuth2Client.getToken(code);

  // Set the credentials on the client
  oAuth2Client.setCredentials(tokens);

  // Now you can fetch the user's email
  let userEmail = null;
  if (tokens.access_token) {
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    try {
      const userinfo = await oauth2.userinfo.get();
      console.log('Fetched userinfo:', userinfo.data);
      userEmail = userinfo.data.email || null;
    } catch (e) {
      console.error('Failed to fetch user email:', e);
    }
  }

  // Store refresh token, email, etc. in Firestore
  if (tokens.refresh_token && uid) {
    await admin.firestore().collection('gmailTokens').doc(uid).set({
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      expiry_date: tokens.expiry_date,
      last_updated: FieldValue.serverTimestamp(),
      email: userEmail,
    });
    res.set('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gmail Connected</title>
        </head>
        <body>
          <p style="font-family: sans-serif;">✅ Gmail connected! You can close this window.</p>
          <script>
            window.opener?.postMessage({ type: 'GMAIL_AUTH_SUCCESS' }, '*');
            setTimeout(() => window.close(), 1000);
          </script>
        </body>
      </html>
    `);
  } else {
    res.status(400).send('Failed to get refresh token.');
  }
}); 