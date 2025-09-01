"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { LayoutDashboard, Users, Briefcase, Book, LogOut, Bell, Search } from 'lucide-react';

// Apollo Design System Components
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Minimal sidebar components
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  SidebarGroup,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';

// Navigation items configuration with badges and descriptions
const navigationItems = [
  {
    href: '/teacher/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    description: 'Overview and analytics',
    badge: null,
  },
  {
    href: '/teacher/dashboard/student-mentor',
    label: 'Student Mentor',
    icon: <Users />,
    description: 'Guide and support students',
    badge: '12',
  },
  {
    href: '/teacher/dashboard/curriculum-suggestor',
    label: 'Curriculum Suggestor',
    icon: <Book />,
    description: 'AI-powered curriculum planning',
    badge: 'New',
  },
  {
    href: '/teacher/dashboard/admin-work',
    label: 'Admin Work',
    icon: <Briefcase />,
    description: 'Administrative tasks',
    badge: null,
  },
];

// Enhanced Apollo Logo Component with gradient and animation
const ApolloLogo = ({ className = "" }) => {
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
            className="text-white transform group-hover:scale-110 transition-transform duration-300"
          >
            <rect x="15" y="15" width="40" height="40" rx="8" ry="8" fill="currentColor" />
            <rect x="35" y="35" width="40" height="40" rx="8" ry="8" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
      </div>
      
      {(!isCollapsed || isMobile) && (
        <div className="flex-1 min-w-0 group">
          <h2 className="heading-3 text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blueberry-600 dark:group-hover:text-blueberry-400 transition-colors">
            Apollo
          </h2>
          <p className="overline text-blueberry-600 dark:text-blueberry-400">
            Teacher Portal
          </p>
        </div>
      )}
    </div>
  );
};

// Enhanced User Profile with Apollo components
const UserProfile = () => {
  const { user } = useAuth();
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;
  
  if (!user) return null;
  
  const UserAvatar = () => (
    user.photoURL ? (
      <img
        src={user.photoURL}
        alt={user.displayName || 'Profile'}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-blueberry-200 dark:ring-blueberry-700 shadow-sm"
      />
    ) : (
      <div className="w-10 h-10 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="subtitle text-white">
          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'T'}
        </span>
      </div>
    )
  );
  
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 cursor-pointer">
              <UserAvatar />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="subtitle">{user.displayName || 'Teacher'}</p>
              <p className="body-text text-neutral-600 dark:text-neutral-400">{user.email}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Card variant="ghost" className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <UserAvatar />
        <div className="flex-1 min-w-0">
          <p className="subtitle text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blueberry-600 dark:group-hover:text-blueberry-400 transition-colors">
            {user.displayName || 'Teacher'}
          </p>
          <p className="body-text text-neutral-600 dark:text-neutral-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Enhanced Logout Button with Apollo Button component
const LogoutButton = () => {
  const { signOutUser } = useAuth();
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;
  
  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="w-10 h-10 text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-950"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="w-full justify-start gap-3 text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-950 transition-all duration-200"
    >
      <LogOut className="w-5 h-5" />
      <span className="subtitle">Logout</span>
    </Button>
  );
};

// Enhanced Header with Apollo components
const DashboardHeader = ({ title, description }: { title: string; description: string }) => (
  <Card variant="elevated" className="sticky top-0 z-20 border-b-0 rounded-none shadow-sm backdrop-blur-sm bg-white/95 dark:bg-neutral-900/95">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="space-y-1">
            <h1 className="heading-2 text-neutral-900 dark:text-neutral-100">
              {title}
            </h1>
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" className="relative">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge 
              variant="destructive" 
              size="sm" 
              className="absolute -top-1 -right-1 w-2 h-2 p-0 flex items-center justify-center"
            >
              <span className="sr-only">3 notifications</span>
            </Badge>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced Footer with Apollo styling
const DashboardFooter = () => (
  <Card variant="ghost" className="border-t border-neutral-200 dark:border-neutral-700 rounded-none">
    <CardContent className="p-4 text-center">
      <p className="body-text text-neutral-500 dark:text-neutral-400">
        Apollo Education Platform © {new Date().getFullYear()}
      </p>
      <p className="overline text-blueberry-600 dark:text-blueberry-400 mt-1">
        Empowering Teachers, Inspiring Students
      </p>
    </CardContent>
  </Card>
);

// Internal Layout Component
function TeacherDashboardInternal({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPage = navigationItems.find(item => item.href === pathname);
  
  return (
    <TooltipProvider>
      {/* Enhanced Sidebar */}
      <Sidebar className="bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
        <SidebarHeader className="p-6 group">
          <Link href="/teacher/dashboard" className="block w-full">
            <ApolloLogo />
          </Link>
        </SidebarHeader>

        <SidebarNav className="px-4">
          <SidebarGroup>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="block">
                  <SidebarNavItem
                    icon={item.icon}
                    active={isActive}
                    className="group relative"
                  >
                    <div className="flex-1">
                      <span className="subtitle">{item.label}</span>
                    </div>
                  </SidebarNavItem>
                </Link>
              );
            })}
          </SidebarGroup>
        </SidebarNav>

        <SidebarFooter className="p-4 space-y-4">
          <UserProfile />
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>

      {/* Enhanced Main Content */}
      <SidebarContent className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 min-h-screen">
        {/* <DashboardHeader 
          title={currentPage?.label || 'Dashboard'}
          description={currentPage?.description || 'Teacher Portal - Apollo Education Platform'}
        /> */}

        {/* Page Content with enhanced styling */}
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <DashboardFooter />
      </SidebarContent>
    </TooltipProvider>
  );
}

// Enhanced Loading Component
const TeacherDashboardLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-blueberry-50 dark:from-neutral-900 dark:to-blueberry-950">
    <Card variant="feature" size="lg" className="max-w-md mx-auto text-center shadow-2xl">
      <CardHeader>
        <div className="mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg width="32" height="32" viewBox="0 0 100 100" className="text-white">
              <rect x="15" y="15" width="40" height="40" rx="8" fill="currentColor" />
              <rect x="35" y="35" width="40" height="40" rx="8" fill="currentColor" opacity="0.7" />
            </svg>
          </div>
        </div>
        <CardTitle gradient size="lg">
          Apollo Teacher Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoadingSpinner 
          size="lg" 
          variant="primary" 
          showLabel={true}
          label="Loading Dashboard"
          description="Preparing your personalized teaching environment..."
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blueberry-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blueberry-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blueberry-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main Layout Component
export default function TeacherDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.replace('/login');
      return;
    }
    
    if (user.role !== 'teacher') {
      console.warn(`User ${user.uid} with role ${user.role} attempted to access teacher section. Redirecting.`);
      router.replace('/');
      return;
    }
  }, [user, loading, router]);

  if (loading || !user || user?.role !== 'teacher') {
    return <TeacherDashboardLoading />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <TeacherDashboardInternal>
        {children}
      </TeacherDashboardInternal>
    </SidebarProvider>
  );
}