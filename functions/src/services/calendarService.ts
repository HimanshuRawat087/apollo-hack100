import { google } from 'googleapis';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://oauth2callback-fvtj5v3sya-uc.a.run.app';

export async function createInterviewCalendarEvent({
  recruiterToken,
  candidateEmail,
  interviewerEmail,
  subject,
  meetingTime,
  agenda,
  instructions,
  resumeUrl,
}: {
  recruiterToken: string,
  candidateEmail: string,
  interviewerEmail: string,
  subject: string,
  meetingTime: string,
  agenda?: string,
  instructions?: string,
  resumeUrl?: string,
}) {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: recruiterToken });
  await oAuth2Client.getAccessToken();

  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const title = subject && subject.trim().length > 0
    ? subject
    : `Interview: ${candidateEmail} & ${interviewerEmail}`;

  let description = (agenda || instructions || '').trim();
  if (resumeUrl && resumeUrl.length > 0) {
    description += (description ? '\n\n' : '') + `Candidate Resume: ${resumeUrl}`;
  }

  const startDate = new Date(meetingTime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

  const event = {
    summary: title,
    description,
    start: { dateTime: startDate.toISOString(), timeZone: 'Asia/Kolkata' },
    end: { dateTime: endDate.toISOString(), timeZone: 'Asia/Kolkata' },
    attendees: [candidateEmail, interviewerEmail].map(email => ({ email })),
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all',
  });

  const eventId = response.data.id!;
  const meetLink = response.data.conferenceData?.entryPoints?.find(
    (ep: any) => ep.entryPointType === 'video'
  )?.uri || undefined;

  return {
    eventId,
    meetLink,
    meetingTime,
  };
} 