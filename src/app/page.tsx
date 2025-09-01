"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import LandingPage from './landing/page';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      // Still loading auth state, do nothing yet.
      return;
    }

    if (user) {
      // User is authenticated - redirect based on role
      const role = user.role;
      if (role === 'teacher') {
        router.replace('/teacher/dashboard');
      } else if (role === 'student') {
        router.replace('/student/dashboard');
      } else {
        // User is authenticated but has no valid role or role is still loading
        // You could either:
        // 1. Wait for role to be populated
        // 2. Redirect to a role selection page
        // 3. Redirect to login to re-authenticate
        // For now, let's redirect to login for users with invalid/missing roles
        console.warn('User authenticated but has invalid role:', role);
        router.replace('/login');
      }
    }
    // If user is null (not authenticated), do nothing - show the landing page
  }, [user, loading, router]);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is authenticated, show loading while redirect happens
  if (user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Redirecting...</p>
      </div>
    );
  }

  // User is not authenticated - show landing page
  return <LandingPage />;
}