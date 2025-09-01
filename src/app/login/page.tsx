"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/types';
import { 
  GraduationCap, 
  Users, 
  Sparkles, 
  BookOpen, 
  Trophy,
  ArrowRight,
  Chrome
} from 'lucide-react';

// Apollo Design System Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';

// Apollo Logo Component (matching landing page)
const ApolloLogo = ({ size = "default" }: { size?: "sm" | "default" | "lg" }) => {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "20" },
    default: { container: "w-12 h-12", icon: "24" },
    lg: { container: "w-16 h-16", icon: "32" }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size].container} bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          width={sizes[size].icon} 
          height={sizes[size].icon} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg" 
          className="text-white"
        >
          <rect x="15" y="15" width="40" height="40" rx="8" ry="8" fill="currentColor" />
          <rect x="35" y="35" width="40" height="40" rx="8" ry="8" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
      {size !== "sm" && (
        <div>
          <h1 className={size === "lg" ? "heading-1" : "heading-2"}>
            <span className="bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent font-bold">
              Apollo
            </span>
          </h1>
          <p className="overline text-blueberry-600 dark:text-blueberry-400">
            Education Platform
          </p>
        </div>
      )}
    </div>
  );
};

// Enhanced Top Navigation (matching landing page)
const TopNavigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="group">
          <ApolloLogo size="default" />
        </Link>
      </div>
    </div>
  </nav>
);

// Role Selection Cards
const RoleCard = ({ 
  role, 
  selectedRole, 
  onSelect 
}: { 
  role: UserRole; 
  selectedRole: UserRole; 
  onSelect: (role: UserRole) => void;
}) => {
  const isSelected = selectedRole === role;
  const isTeacher = role === 'teacher';
  
  const roleConfig = {
    teacher: {
      icon: <Users className="w-8 h-8" />,
      title: 'Teacher',
      description: 'Manage courses, mentor students, and track progress',
      features: ['Course Management', 'Student Mentoring', 'Progress Analytics', 'Curriculum Planning'],
      color: 'blueberry',
      badge: 'Educator'
    },
    student: {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Student',
      description: 'Access courses, complete assignments, and track achievements',
      features: ['Course Access', 'Assignment Submission', 'Achievement Tracking', 'Peer Collaboration'],
      color: 'success',
      badge: 'Learner'
    }
  };

  const config = roleConfig[role];

  return (
    <div 
      className={`bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
        isSelected 
          ? 'border-blueberry-500 shadow-xl ring-2 ring-blueberry-200' 
          : 'border-neutral-200 shadow-lg hover:border-blueberry-300'
      }`}
      onClick={() => onSelect(role)}
    >
      <div className="text-center mb-6">
        <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center ${
          isTeacher 
            ? 'bg-gradient-to-br from-blueberry-500 via-blueberry-600 to-blueberry-700' 
            : 'bg-gradient-to-br from-success-500 via-success-600 to-success-700'
        } shadow-lg`}>
          <div className="text-white">
            {config.icon}
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-3">
          <RadioGroupItem value={role} id={`role-${role}`} className="sr-only" />
          <h3 className="heading-3 text-neutral-900 font-semibold">{config.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isTeacher 
              ? 'bg-blueberry-100 text-blueberry-700' 
              : 'bg-success-100 text-success-700'
          }`}>
            {config.badge}
          </span>
        </div>
        
        <p className="body-text text-neutral-600 leading-relaxed">
          {config.description}
        </p>
      </div>
      
      <div className="space-y-3">
        {config.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              isTeacher ? 'bg-blueberry-500' : 'bg-success-500'
            }`} />
            <span className="body-text text-neutral-700 font-medium">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Error Alert Component
const ErrorAlert = ({ error, variant = "error" }: { error: string; variant?: "error" | "warning" }) => (
  <div className={`rounded-2xl p-6 border-2 shadow-lg ${
    variant === "error" 
      ? 'border-error-400 bg-error-50 text-error-800' 
      : 'border-warning-400 bg-warning-50 text-warning-800'
  }`}>
    <p className="body-text text-center font-medium">
      {error}
    </p>
  </div>
);

// Loading Component
const LoginLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-blueberry-400 via-blueberry-500 to-blueberry-700">
    <div className="pt-20">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-white backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30 text-center">
          <div className="mb-8">
            <ApolloLogo size="lg" />
          </div>
          <h1 className="heading-2 bg-gradient-to-r from-blueberry-600 via-blueberry-700 to-blueberry-800 bg-clip-text text-transparent mb-6">
            Welcome to Apollo
          </h1>
          <LoadingSpinner 
            size="lg" 
            variant="primary" 
            showLabel={true}
            label="Signing you in"
            description="Please wait while we authenticate your account..."
          />
        </div>
      </div>
    </div>
  </div>
);

// Features Showcase
const FeaturesShowcase = () => (
  <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-200 mt-8">
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-blueberry-600" />
        <h3 className="heading-3 bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent">
          Why Choose Apollo?
        </h3>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: <BookOpen className="w-6 h-6" />,
          title: 'Smart Learning',
          description: 'AI-powered curriculum suggestions and personalized learning paths'
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: 'Collaborative',
          description: 'Connect teachers and students in meaningful educational experiences'
        },
        {
          icon: <Trophy className="w-6 h-6" />,
          title: 'Achievement Focused',
          description: 'Track progress and celebrate milestones with comprehensive analytics'
        }
      ].map((feature, index) => (
        <div key={index} className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blueberry-100 to-blueberry-200 rounded-2xl flex items-center justify-center mx-auto text-blueberry-600 shadow-lg">
            {feature.icon}
          </div>
          <h4 className="heading-3 text-neutral-900">
            {feature.title}
          </h4>
          <p className="body-text text-neutral-700">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// Main Login Page Component
export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const {
    user,
    signInWithGoogle,
    loading: authLoading,
    authError,
    roleMismatchError,
    clearAuthError,
    clearRoleMismatchError,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (roleMismatchError) {
      return;
    }

    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router, roleMismatchError]);

  const handleSignIn = async () => {
    if (clearAuthError) clearAuthError();
    if (clearRoleMismatchError) clearRoleMismatchError();
    if (selectedRole) {
      await signInWithGoogle(selectedRole);
    }
  };

  if (authLoading || (!authLoading && user && !roleMismatchError)) {
    return <LoginLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blueberry-400 via-blueberry-500 to-blueberry-700">
      <TopNavigation />
      
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Main Login Card */}
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-neutral-200">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="heading-1 bg-gradient-to-r from-blueberry-600 via-blueberry-700 to-blueberry-800 bg-clip-text text-transparent mb-6 font-light">
                Choose Your Role
              </h1>
              <p className="subtitle text-neutral-700 max-w-2xl mx-auto">
                Select how you'll be using Apollo to get started with the right experience for your educational journey
              </p>
            </div>
            
            {/* Role Selection */}
            <div className="space-y-8">
              <RadioGroup
                value={selectedRole}
                onValueChange={(value: UserRole) => setSelectedRole(value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                <RoleCard 
                  role="teacher" 
                  selectedRole={selectedRole} 
                  onSelect={setSelectedRole} 
                />
                <RoleCard 
                  role="student" 
                  selectedRole={selectedRole} 
                  onSelect={setSelectedRole} 
                />
              </RadioGroup>

              {/* Error Messages */}
              {authError && (
                <div className="max-w-2xl mx-auto">
                  <ErrorAlert error={authError} variant="error" />
                </div>
              )}

              {roleMismatchError && (
                <div className="max-w-2xl mx-auto">
                  <ErrorAlert error={roleMismatchError} variant="warning" />
                </div>
              )}

              {/* Separator */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-6 py-2 text-neutral-600 font-medium">Continue with</span>
                  </div>
                </div>
              </div>

              {/* Sign In Button */}
              <div className="space-y-6 max-w-2xl mx-auto">
                <Button 
                  onClick={handleSignIn} 
                  disabled={authLoading}
                  className="w-full h-14 bg-gradient-to-r from-blueberry-500 via-blueberry-600 to-blueberry-700 hover:from-blueberry-600 hover:via-blueberry-700 hover:to-blueberry-800 text-white font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 rounded-xl"
                  loading={authLoading}
                  loadingText="Signing you in..."
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  Continue with Google
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <p className="body-text text-neutral-600 text-center">
                  By continuing, you agree to Apollo's Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>

          {/* Features Showcase */}
          <FeaturesShowcase />
        </div>
      </div>
    </div>
  );
}