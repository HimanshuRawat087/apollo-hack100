'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { CheckCircle, User, Mail, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';

const STATUS_COLORS = {
  scheduled: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  email_to_candidate: 'bg-blue-100 text-blue-800',
  email_to_interviewer: 'bg-yellow-100 text-yellow-800',
  confirmation_of_event: 'bg-green-100 text-green-800',
};
const STATUS_LABELS = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  failed: 'Failed',
  email_to_candidate: 'Candidate Invited',
  email_to_interviewer: 'Interviewer Invited',
  confirmation_of_event: 'Slots Matched',
};
const STATUS_TOOLTIPS = {
  scheduled: 'Interview is scheduled',
  completed: 'Interview is completed',
  failed: 'Interview failed or needs intervention',
  email_to_candidate: 'Invitation sent to candidate',
  email_to_interviewer: 'Invitation sent to interviewer',
  confirmation_of_event: 'Slots matched, scheduling in progress',
};
const STATUS_PROGRESS = [
  'email_to_candidate',
  'email_to_interviewer',
  'confirmation_of_event',
  'scheduled',
  'completed',
  'failed',
];

function getInitials(email: string) {
  if (!email) return '?';
  return email[0].toUpperCase();
}

function getProgressIndex(status: string) {
  const idx = STATUS_PROGRESS.indexOf(status);
  return idx === -1 ? 0 : idx;
}

const InterviewList = () => {
  const { user, loading } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    setError(null);
    const db = getFirestore();
    const q = query(
      collection(db, 'interviews'),
      where('created_by', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    getDocs(q)
      .then((snapshot) => {
        setInterviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFetching(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch interviews');
        setFetching(false);
      });
  }, [user]);

  if (loading || fetching) return <div>Loading interviews...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!interviews.length) return <div>No interviews found.</div>;

  // Summary stats
  const total = interviews.length;
  const scheduledStatuses = ['scheduled'];
  const completedStatuses = ['completed'];
  const failedStatuses = ['failed'];
  const scheduled = interviews.filter(i => scheduledStatuses.includes((i.status || '').toLowerCase())).length;
  const completed = interviews.filter(i => completedStatuses.includes((i.status || '').toLowerCase())).length;
  const failed = interviews.filter(i => failedStatuses.includes((i.status || '').toLowerCase())).length;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Summary Card */}
      <div className="flex flex-row gap-6 mb-6">
        <div className="flex-1 bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-gray-500">Total</span>
        </div>
        <div className="flex-1 bg-green-50 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700">{scheduled}</span>
          <span className="text-green-700">Scheduled</span>
        </div>
        <div className="flex-1 bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-700">{completed}</span>
          <span className="text-blue-700">Completed</span>
        </div>
        <div className="flex-1 bg-red-50 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-red-700">{failed}</span>
          <span className="text-red-700">Failed</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-bold text-xl mb-4">All Interviews</h2>
        <table className="min-w-full table-fixed border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="w-1/5 px-4 py-2 text-left">Candidate</th>
              <th className="w-1/5 px-4 py-2 text-left">Interviewer</th>
              <th className="w-1/6 px-4 py-2 text-left">Status</th>
              <th className="w-1/6 px-4 py-2 text-left">Scheduled Time</th>
              <th className="w-1/6 px-4 py-2 text-left">Progress</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => {
              const status = (interview.status || '').toLowerCase();
              const statusLabel = STATUS_LABELS[status] || status || 'Unknown';
              const statusColor = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
              const statusTooltip = STATUS_TOOLTIPS[status] || '';
              const progressIdx = getProgressIndex(status);
              return (
                <tr
                  key={interview.id}
                  className="bg-white hover:bg-blue-50 rounded-xl shadow-sm cursor-pointer transition"
                  onClick={() => window.location.href = `/hrportal/interviews/${interview.id}`}
                >
                  {/* Candidate */}
                  <td className="px-4 py-2 whitespace-nowrap items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                      {getInitials(interview.candidateEmail)}
                    </span>
                    <span className="text-sm">{interview.candidateEmail}</span>
                  </td>
                  {/* Interviewer */}
                  <td className="px-4 py-2 whitespace-nowrap items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold">
                      {getInitials(interview.interviewerEmail)}
                    </span>
                    <span className="text-sm">{interview.interviewerEmail}</span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="relative group">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {status === 'scheduled' && <Calendar className="w-4 h-4" />}
                        {status === 'completed' && <CheckCircle className="w-4 h-4" />}
                        {status === 'failed' && <AlertTriangle className="w-4 h-4" />}
                        {status === 'email_to_candidate' && <Mail className="w-4 h-4" />}
                        {status === 'email_to_interviewer' && <Mail className="w-4 h-4" />}
                        {status === 'confirmation_of_event' && <CheckCircle className="w-4 h-4" />}
                        {statusLabel}
                      </span>
                      {statusTooltip && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                          {statusTooltip}
                        </span>
                      )}
                    </span>
                  </td>
                  {/* Scheduled Time */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    {interview.meeting?.timeStamp ? new Date(interview.meeting.timeStamp).toLocaleString() : '-'}
                  </td>
                  {/* Progress */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {STATUS_PROGRESS.slice(0, 5).map((step, idx) => (
                        <span
                          key={step}
                          className={`inline-block w-3 h-3 rounded-full ${progressIdx >= idx ? 'bg-green-500' : 'bg-gray-300'}`}
                          title={STATUS_LABELS[step]}
                        ></span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewList; 