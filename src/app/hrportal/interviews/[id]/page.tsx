'use client';

import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';

// const statusSteps = [
//   { key: 'created', label: 'Interview Created', color: 'green' },
//   { key: 'email_to_candidate', label: 'Invitation Sent to Candidate', color: 'green' },
//   { key: 'waiting_for_candidate_reply', label: 'Waiting for Candidate Reply', color: 'blue' },
//   { key: 'email_to_interviewer', label: 'Invitation Sent to Interviewer', color: 'green' },
//   { key: 'waiting_for_interviewer_reply', label: 'Waiting for Interviewer Reply', color: 'blue' },
//   { key: 'confirmation_of_event', label: 'Slots Matched, Scheduling', color: 'green' },
//   { key: 'Scheduled', label: 'Interview Scheduled', color: 'green' },
//   { key: 'failed', label: 'Failed/Human Intervention Needed', color: 'green' },
//   { key: 'completed', label: 'Interview Completed', color: 'green' },
// ];

// function getTimelineSteps(status) {
//   // Map backend status to expanded frontend steps
//   switch (status) {
//     case 'email_to_candidate':
//       return statusSteps.slice(0, 3); // up to 'Waiting for Candidate Reply'
//     case 'email_to_interviewer':
//       return statusSteps.slice(0, 5); // up to 'Waiting for Interviewer Reply'
//     default: {
//       const idx = statusSteps.findIndex(s => s.key === status);
//       if (idx === -1) return [statusSteps[0]];
//       return statusSteps.slice(0, idx + 1);
//     }
//   }
// }

// Type definitions
interface TimelineEvent {
  isStatus?: boolean;
  isWaiting?: boolean;
  waitingFor?: 'candidate' | 'interviewer';
  waitingKey?: string;
  message_id?: string;
  stepLabel: string;
  color: string;
  createdAt: Date;
  from?: string;
  to?: string;
  content?: string;
}

interface ConversationMessage {
  from: string;
  to: string;
  content: string;
  createdAt: any;
  subject?: string;
  message_id?: string;
}

function getStatusBadge(status: string): JSX.Element {
  const colorMap: Record<string, string> = {
    created: 'bg-green-200 text-gray-800',
    email_to_candidate: 'bg-green-200 text-blue-800',
    email_to_interviewer: 'bg-green-200 text-yellow-800',
    confirmation_of_event: 'bg-green-200 text-purple-800',
    Scheduled: 'bg-green-200 text-green-800',
    failed: 'bg-red-200 text-red-800',
    completed: 'bg-green-300 text-green-900',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ml-2 ${colorMap[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
  );
}

function isHtml(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function getInitials(email: string): string {
  if (!email) return '?';
  return email[0].toUpperCase();
}

function getSenderRole(email: string, interviewData: any): string {
  if (!email || !interviewData) return '';
  if (email === interviewData.candidateEmail) return 'Candidate:';
  if (email === interviewData.interviewerEmail) return 'Interviewer:';
  if (email === interviewData.recruiterEmail) return 'Recruiter:';
  return '';
}

// Improved message matching for each status step
function findMessageForStep(step: { key: string }, conversationLog: ConversationMessage[], interviewData: any): ConversationMessage[] {
  switch (step.key) {
    case 'email_to_candidate':
      return conversationLog.filter((msg) => msg.from === interviewData.recruiterEmail && msg.to === interviewData.candidateEmail);
    case 'waiting_for_candidate_reply':
      return conversationLog.filter((msg) => msg.from === interviewData.candidateEmail && msg.to === interviewData.recruiterEmail);
    case 'email_to_interviewer':
      return conversationLog.filter((msg) => msg.from === interviewData.recruiterEmail && msg.to === interviewData.interviewerEmail);
    case 'waiting_for_interviewer_reply':
      return conversationLog.filter((msg) => msg.from === interviewData.interviewerEmail && msg.to === interviewData.recruiterEmail);
    case 'confirmation_of_event':
      return conversationLog.filter((msg) => msg.from === interviewData.recruiterEmail && msg.to === interviewData.candidateEmail && msg.subject && msg.subject.toLowerCase().includes('confirmation'));
    case 'Scheduled':
      return conversationLog.filter((msg) => msg.from === interviewData.recruiterEmail && msg.subject && msg.subject.toLowerCase().includes('scheduled'));
    default:
      return [];
  }
}

const InterviewDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversationLog, setConversationLog] = useState<any[]>([]);
  const [confirmationMatchedAt, setConfirmationMatchedAt] = useState<Date | null>(null);

  useEffect(() => {
    let interval: any;
    const fetchInterview = async () => {
      const db = getFirestore();
      const interviewRef = doc(db, 'interviews', params.id as string);
      const interviewSnap = await getDoc(interviewRef);
      if (interviewSnap.exists()) {
        setInterviewData(interviewSnap.data());
      }
      // Fetch conversation log
      const convQuery = query(
        collection(db, 'conversations'),
        where('interview_id', '==', params.id),
        orderBy('createdAt', 'asc')
      );
      const convSnap = await getDocs(convQuery);
      setConversationLog(convSnap.docs.map(doc => doc.data()));

      // Fetch aiRequests for slots matched
      const aiRequestQuery = query(
        collection(db, 'aiRequests'),
        where('interview_id', '==', params.id),
        where('nextStep', '==', 'confirmation_of_event')
      );
      const aiRequestSnap = await getDocs(aiRequestQuery);
      if (!aiRequestSnap.empty) {
        const aiDoc = aiRequestSnap.docs[0];
        const ts = aiDoc.data().updatedAt || aiDoc.data().createdAt;
        setConfirmationMatchedAt(ts && ts.toDate ? ts.toDate() : ts ? new Date(ts) : null);
      } else {
        setConfirmationMatchedAt(null);
      }

      setLoading(false);
    };
    fetchInterview();
    interval = setInterval(fetchInterview, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!interviewData) return <div className="text-red-500">Interview not found.</div>;

  // Add manual action handler
  function handleManualAction() {
    alert('Manual intervention or resend email triggered! (Implement backend call here)');
  }

  // Build a message-driven timeline with dynamic 'Waiting for X Reply' events
  const timelineEvents: TimelineEvent[] = [];
  let waitingFor: 'candidate' | 'interviewer' | null = null;

  // Add synthetic status events at the correct time
  if (interviewData.createdAt) {
    timelineEvents.push({
      isStatus: true,
      stepLabel: 'Interview Created',
      color: 'green',
      createdAt: interviewData.createdAt.toDate ? interviewData.createdAt.toDate() : new Date(0),
    });
  }
  if (confirmationMatchedAt) {
    timelineEvents.push({
      isStatus: true,
      stepLabel: 'Slots Matched, Scheduling',
      color: 'green',
      createdAt: confirmationMatchedAt,
    });
  }

  // Sort messages chronologically
  const sortedMessages: ConversationMessage[] = [...conversationLog].sort((a, b) => {
    const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
    const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
    return aDate - bDate;
  });

  sortedMessages.forEach((msg, idx) => {
    const createdAt = msg.createdAt?.toDate ? msg.createdAt.toDate() : new Date(0);
    let stepLabel = '';
    let color = '';
    let waitingLabel = '';
    let waitingKey = '';
    // Outgoing from recruiter
    if (msg.from === interviewData.recruiterEmail && msg.to === interviewData.candidateEmail) {
      stepLabel = 'Invitation Sent to Candidate';
      color = 'blue';
      waitingFor = 'candidate';
      waitingLabel = 'Waiting for Candidate Reply';
      waitingKey = 'waiting_for_candidate_reply_' + idx;
      timelineEvents.push({ ...msg, stepLabel, color, createdAt });
      timelineEvents.push({
        isWaiting: true,
        waitingFor: 'candidate',
        stepLabel: waitingLabel,
        color: 'green',
        createdAt,
        waitingKey,
      });
    } else if (msg.from === interviewData.recruiterEmail && msg.to === interviewData.interviewerEmail) {
      stepLabel = 'Invitation Sent to Interviewer';
      color = 'blue';
      waitingFor = 'interviewer';
      waitingLabel = 'Waiting for Interviewer Reply';
      waitingKey = 'waiting_for_interviewer_reply_' + idx;
      timelineEvents.push({ ...msg, stepLabel, color, createdAt });
      timelineEvents.push({
        isWaiting: true,
        waitingFor: 'interviewer',
        stepLabel: waitingLabel,
        color: 'green',
        createdAt,
        waitingKey,
      });
    } else if (msg.from === interviewData.candidateEmail && msg.to === interviewData.recruiterEmail) {
      stepLabel = 'Candidate Reply';
      color = 'green';
      // Replace last waiting for candidate event with this reply
      let replaced = false;
      for (let i = timelineEvents.length - 1; i >= 0; i--) {
        if (timelineEvents[i].isWaiting && timelineEvents[i].waitingFor === 'candidate') {
          timelineEvents[i] = { ...msg, stepLabel, color, createdAt };
          replaced = true;
          break;
        }
      }
      if (!replaced) {
        timelineEvents.push({ ...msg, stepLabel, color, createdAt });
      }
      waitingFor = null;
    } else if (msg.from === interviewData.interviewerEmail && msg.to === interviewData.recruiterEmail) {
      stepLabel = 'Interviewer Reply';
      color = 'green';
      // Replace last waiting for interviewer event with this reply
      let replaced = false;
      for (let i = timelineEvents.length - 1; i >= 0; i--) {
        if (timelineEvents[i].isWaiting && timelineEvents[i].waitingFor === 'interviewer') {
          timelineEvents[i] = { ...msg, stepLabel, color, createdAt };
          replaced = true;
          break;
        }
      }
      if (!replaced) {
        timelineEvents.push({ ...msg, stepLabel, color, createdAt });
      }
      waitingFor = null;
    } else {
      // Other messages
      stepLabel = 'Other';
      color = 'gray';
      timelineEvents.push({ ...msg, stepLabel, color, createdAt });
    }
  });

  // Add scheduled, completed, and failed statuses at the correct time
  if (interviewData.status === 'Scheduled' && interviewData.meeting?.timeStamp) {
    timelineEvents.push({
      isStatus: true,
      stepLabel: 'Interview Scheduled',
      color: 'green',
      createdAt: new Date(interviewData.meeting.timeStamp),
    });
  }
  if (interviewData.status === 'confirmation_of_event') {
    timelineEvents.push({
      isStatus: true,
      stepLabel: 'Slots Matched, Scheduling',
      color: 'green',
      createdAt: interviewData.confirmationMatchedAt ? (interviewData.confirmationMatchedAt.toDate ? interviewData.confirmationMatchedAt.toDate() : new Date(interviewData.confirmationMatchedAt)) : new Date(),
    });
  }
  if (interviewData.status === 'completed') {
    timelineEvents.push({
      isStatus: true,
      stepLabel: 'Interview Completed',
      color: 'green',
      createdAt: interviewData.completedAt ? (interviewData.completedAt.toDate ? interviewData.completedAt.toDate() : new Date(0)) : new Date(),
    });
  }
  if (interviewData.status === 'failed' || interviewData.status === 'human_intervention_needed') {
    timelineEvents.push({
      isStatus: true,
      stepLabel: 'Failed / Human Intervention Needed',
      color: 'red',
      createdAt: new Date(), // Use a more accurate timestamp if available
    });
  }

  // Sort all events by time
  const allTimelineEvents: TimelineEvent[] = [...timelineEvents].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <button
        className="mb-4 px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition font-semibold"
        onClick={() => router.push('/hrportal/interviews')}
      >
        ← Back to All Interviews
      </button>
      <h1 className="text-2xl font-bold mb-4">Interview Details</h1>
      <div className="mb-2"><b>Candidate Email:</b> {interviewData.candidateEmail}</div>
      <div className="mb-2"><b>Interviewer Email:</b> {interviewData.interviewerEmail}</div>
      <div className="mb-2"><b>Status:</b> {getStatusBadge(interviewData.status)}
        {(interviewData.status === 'failed' || interviewData.status === 'human_intervention_needed') && (
          <button
            className="ml-4 px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            onClick={handleManualAction}
          >
            Manual Intervention / Resend Email
          </button>
        )}
      </div>
      <div className="mb-2"><b>Scheduled Time:</b> {interviewData.meeting?.timeStamp ? new Date(interviewData.meeting.timeStamp).toLocaleString() : '-'}</div>
      {interviewData.meeting && (
        <div className="mb-4 p-4 bg-blue-50 rounded border">
          <h2 className="text-lg font-semibold mb-2">Meeting Details</h2>
          <div><b>Meeting Link:</b> {interviewData.meeting.link ? <a href={interviewData.meeting.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{interviewData.meeting.link}</a> : '-'}</div>
          <div><b>Meeting Time:</b> {interviewData.meeting.timeStamp ? new Date(interviewData.meeting.timeStamp).toLocaleString() : '-'}</div>
          <div><b>Agenda:</b> {interviewData.agenda || '-'}</div>
          <div><b>Instructions:</b> {interviewData.instructions || '-'}</div>
          <div><b>Resume:</b> {interviewData.resumeUrl ? <a href={interviewData.resumeUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View Resume</a> : '-'}</div>
        </div>
      )}
      <hr className="my-4" />
      {/* Message-driven Timeline with Waiting and Status Events */}
      <div className="w-full">
        {allTimelineEvents.slice().reverse().map((event, idx) => (
          <div key={(event as any).waitingKey || (event as any).message_id || event.stepLabel || idx} className="flex flex-row items-stretch w-full min-h-[64px]">
              {/* Timeline Dot and Line */}
              <div className="flex flex-col items-center relative" style={{ width: 28 }}>
                {/* Vertical Line above the dot (except for first step) */}
              {idx !== 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 bg-green-500" style={{ top: 0, width: 4, height: '50%', zIndex: 0 }}></div>
                )}
                {/* Dot */}
              <span className={`z-10 inline-block w-4 h-4 rounded-full border-2 border-white my-0.5 ${event.color === 'blue' ? 'bg-blue-500' : event.color === 'yellow' ? 'bg-yellow-500' : event.color === 'green' ? 'bg-green-500' : event.color === 'red' ? 'bg-red-500' : event.color === 'gray' ? 'bg-gray-300' : 'bg-green-500'}`}></span>
                {/* Vertical Line below the dot (except for last step) */}
              {idx !== allTimelineEvents.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 bg-green-500" style={{ top: '50%', width: 4, height: '50%', zIndex: 0 }}></div>
                )}
            </div>
            {/* Timeline Content */}
            <div className="flex-1 flex flex-col gap-2 mb-8 items-start w-full justify-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{event.stepLabel}</span>
              </div>
              {event.isStatus ? (
                <div className={`w-full ml-8 font-semibold p-3 rounded ${event.color === 'green' ? 'bg-green-50 text-green-700 border border-green-200' : event.color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' : event.color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
                  {event.stepLabel}
                </div>
              ) : event.isWaiting ? (
                <div className="w-full ml-8 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3 font-semibold">
                  {event.stepLabel}
                </div>
              ) : (
                  <div className="w-full ml-8">
                    <div className="mb-1 text-xs font-semibold text-red-500 inline-block">
                    {getSenderRole(event.from!, interviewData)}
                    </div>
                    <div className="p-4 border rounded-xl bg-white flex items-start gap-3 shadow-md mt-1">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-base">
                      {getInitials(event.from!)}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">
                        <b>{event.from}</b> to <b>{event.to}</b> &middot; {event.createdAt ? event.createdAt.toLocaleString() : ''}
                      </div>
                      {isHtml(event.content!) ? (
                        <div className="text-sm" dangerouslySetInnerHTML={{ __html: event.content ?? '' }} />
                      ) : (
                        <div className="whitespace-pre-line text-sm">{event.content}</div>
                      )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewDetailsPage; 