'use client';

import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AccountInfo from '@/components/hrportal/AccountInfo';
import Link from 'next/link';

export default function HrPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible>
        <div className="flex flex-col h-full p-4 gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg">HR Portal</h2>
            <SidebarTrigger />
          </div>
            <AccountInfo />
          <nav className="flex flex-col gap-2">
            <Link href="/hrportal/create" className="hover:underline">Create Interview</Link>
            <Link href="/hrportal/interviews" className="hover:underline">View Interviews</Link>
          </nav>
        </div>
      </Sidebar>
      <div className="flex-1 ml-[16rem] flex justify-center items-start p-8">{children}</div>
    </SidebarProvider>
  );
} 