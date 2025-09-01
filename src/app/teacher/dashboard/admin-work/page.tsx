"use client";

import { useAuth } from '@/context/auth-context';
import React from 'react';
import { Shield, Settings, Bot, Users, BarChart3, FileText } from 'lucide-react';
import AttendanceExtractor from './attendance-extractor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminWorkPage() {
  const { user, loading } = useAuth();

  if (loading || !user) { 
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900">
        <LoadingSpinner 
          layout="centered"
          size="xl"
          variant="primary"
          label="Loading Admin Dashboard"
          description="Please wait while we prepare your workspace..."
          showLabel
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Main Tool Section */}
      <div className="flex-1 px-6 pb-6">
        <Card variant="elevated" className="h-full shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                <Bot size={20} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div>
                <CardTitle className="text-blueberry-700 dark:text-blueberry-300">AI-Powered Tools</CardTitle>
                <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm">
                  Advanced administrative tools powered by artificial intelligence
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent noPadding className="h-full">
            <div className="h-full">
              <AttendanceExtractor />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
