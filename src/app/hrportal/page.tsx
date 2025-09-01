import { redirect } from 'next/navigation';

export default function HrPortalRootPage() {
  redirect('/hrportal/create');
  return null;
} 