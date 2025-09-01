"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Trophy, 
  Calendar,
  MessageSquare,
  LogOut, 
  Bell, 
  Search,
  GraduationCap
} from 'lucide-react';

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

// Student navigation items with learning-focused features
const navigationItems = [
  {
    href: '/student/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    description: 'Your learning overview',
    badge: null,
  },
  {
    href: '/student/assessment',
    label: 'Self Assessment',
    icon: <Trophy />,
    description: 'Your personal growth assessment',
    badge: null,
  },
  {
    href: '/student/dashboard/courses',
    label: 'My Courses',
    icon: <BookOpen />,
    description: 'Active courses and materials',
    badge: '5',
  },
  {
    href: '/student/dashboard/assignments',
    label: 'Assignments',
    icon: <Calendar />,
    description: 'Tasks and deadlines',
    badge: '3',
  },
  {
    href: '/student/dashboard/study-groups',
    label: 'Study Groups',
    icon: <Users />,
    description: 'Collaborate with peers',
    badge: null,
  },
  {
    href: '/student/dashboard/achievements',
    label: 'Achievements',
    icon: <Trophy />,
    description: 'Your progress and awards',
    badge: 'New',
  },
  {
    href: '/student/dashboard/messages',
    label: 'Messages',
    icon: <MessageSquare />,
    description: 'Chat with teachers and peers',
    badge: '2',
  },
];

// Enhanced Apollo Logo for Students
const ApolloStudentLogo = ({ className = "" }) => {
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <GraduationCap className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blueberry-500 rounded-full animate-pulse"></div>
      </div>
      
      {(!isCollapsed || isMobile) && (
        <div className="flex-1 min-w-0 group">
          <h2 className="heading-3 text-neutral-900 dark:text-neutral-100 truncate group-hover:text-success-600 dark:group-hover:text-success-400 transition-colors">
            Apollo
          </h2>
          <p className="overline text-success-600 dark:text-success-400">
            Student Portal
          </p>
        </div>
      )}
    </div>
  );
};

// Enhanced Student Profile
const StudentProfile = () => {
  const { user } = useAuth();
  const { isOpen, isMobile } = useSidebar();
  const isCollapsed = !isOpen && !isMobile;
  
  if (!user) return null;
  
  const StudentAvatar = () => (
    user.photoURL ? (
      <img
        src={user.photoURL}
        alt={user.displayName || 'Profile'}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-success-200 dark:ring-success-700 shadow-sm"
      />
    ) : (
      <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="subtitle text-white">
          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'S'}
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
              <StudentAvatar />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="subtitle">{user.displayName || 'Student'}</p>
              <p className="body-text text-neutral-600 dark:text-neutral-400">{user.email}</p>
              <Badge variant="success" size="sm">Learning</Badge>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Card variant="ghost" className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <StudentAvatar />
        <div className="flex-1 min-w-0">
          <p className="subtitle text-neutral-900 dark:text-neutral-100 truncate group-hover:text-success-600 dark:group-hover:text-success-400 transition-colors">
            {user.displayName || 'Student'}
          </p>
          <p className="body-text text-neutral-600 dark:text-neutral-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Enhanced Logout Button for Student
const StudentLogoutButton = () => {
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

// Student Dashboard Header
const StudentDashboardHeader = ({ title, description }: { title: string; description: string }) => (
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
              <span className="sr-only">5 notifications</span>
            </Badge>
          </Button>
          {/* Quick GPA Display */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-success-50 dark:bg-success-950 rounded-lg">
            <Trophy className="w-4 h-4 text-success-600 dark:text-success-400" />
            <span className="subtitle text-success-900 dark:text-success-100">GPA: 3.8</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Student Dashboard Footer
const StudentDashboardFooter = () => (
  <Card variant="ghost" className="border-t border-neutral-200 dark:border-neutral-700 rounded-none">
    <CardContent className="p-4 text-center">
      <p className="body-text text-neutral-500 dark:text-neutral-400">
        Apollo Education Platform © {new Date().getFullYear()}
      </p>
      <p className="overline text-success-600 dark:text-success-400 mt-1">
        Your Journey to Excellence Starts Here
      </p>
    </CardContent>
  </Card>
);

// Internal Layout Component
function StudentDashboardInternal({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPage = navigationItems.find(item => 
    item.href === pathname || pathname.startsWith(item.href + '/')
  );
  
  return (
    <TooltipProvider>
      {/* Enhanced Student Sidebar */}
      <Sidebar className="bg-gradient-to-b from-white to-success-50/30 dark:from-neutral-900 dark:to-success-950/20">
        <SidebarHeader className="p-6 group">
          <Link href="/student/dashboard" className="block w-full">
            <ApolloStudentLogo />
          </Link>
        </SidebarHeader>

        <SidebarNav className="px-4">
          <SidebarGroup>
            {navigationItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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
          <StudentProfile />
          <StudentLogoutButton />
        </SidebarFooter>
      </Sidebar>

      {/* Enhanced Main Content */}
      <SidebarContent className="bg-gradient-to-br from-neutral-50 to-success-50/20 dark:from-neutral-900 dark:to-success-950/10 min-h-screen">
        {/* <StudentDashboardHeader 
          title={currentPage?.label || 'Dashboard'}
          description={currentPage?.description || 'Student Portal - Apollo Education Platform'}
        /> */}

        {/* Page Content with enhanced styling */}
        <main className="flex-1 p-6 space-y-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <StudentDashboardFooter />
      </SidebarContent>
    </TooltipProvider>
  );
}

// Enhanced Student Loading Component
const StudentDashboardLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 to-success-50 dark:from-neutral-900 dark:to-success-950">
    <Card variant="feature" size="lg" className="max-w-md mx-auto text-center shadow-2xl">
      <CardHeader>
        <div className="mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle gradient size="lg">
          Apollo Student Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoadingSpinner 
          size="lg" 
          variant="success" 
          showLabel={true}
          label="Loading Dashboard"
          description="Preparing your learning environment..."
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        {/* Learning motivation */}
        <div className="mt-4 p-3 bg-success-50 dark:bg-success-950 rounded-lg">
          <p className="body-text text-success-800 dark:text-success-200 text-sm">
            "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Main Layout Component
export default function StudentDashboardLayout({
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
    
    if (user.role !== 'student') {
      console.warn(`User ${user.uid} with role ${user.role} attempted to access student section. Redirecting.`);
      router.replace('/');
      return;
    }
  }, [user, loading, router]);

  if (loading || !user || user?.role !== 'student') {
    return <StudentDashboardLoading />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <StudentDashboardInternal>
        {children}
      </StudentDashboardInternal>
    </SidebarProvider>
  );
}
