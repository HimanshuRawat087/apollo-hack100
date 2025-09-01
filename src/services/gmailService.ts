// gmailService.ts
// Service for sending emails via Gmail API (OAuth2)

export interface GmailSendOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  uid: string; // Required for backend to look up refresh token
}

export interface GmailSendResult {
  success: boolean;
  messageId?: string;
  error?: {
    message: string;
    code?: number;
    details?: any;
  };
}

/**
 * Sends an email by calling the deployed Firebase Cloud Function endpoint.
 * @param options - Email details (to, from, subject, html/text, uid, etc.)
 */
export async function sendGmailEmail(options: GmailSendOptions): Promise<GmailSendResult> {
  try {
    const response = await fetch('https://sendgmailemail-fvtj5v3sya-uc.a.run.app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: { message: error.message || 'Failed to call Gmail send function.' },
    };
  }
} 