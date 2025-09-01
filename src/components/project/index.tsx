// components/project/index.tsx
"use client";

import { useState } from 'react';
import { ArrowLeft, BookOpen, User, Calendar, Clock, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Import tab components
import ProjectOverview from './overview';
import ProjectPlan from './project-plan';

// Types
import { Timestamp as FirebaseTimestampType } from 'firebase/firestore';
import ProjectSubmissions from './project-submissions';

export interface ProjectResources {
  papers?: ResearchPaper[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  arxivUrl: string;
  pdfUrl: string;
  categories: string[];
  subjects: string[];
  comments?: string;
  submittedDate: string;
  addedAt: FirebaseTimestampType;
  addedBy: string;
}

export interface ProjectTask {
  taskId: string;
  taskName: string;
  duration: string;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface ProjectData {
  assignedProjectId?: string;
  projectId: string;
  studentUid: string;
  studentName: string;
  teacherUid: string;
  assignedAt: FirebaseTimestampType | Date;
  status: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tasks?: ProjectTask[];
  resources?: ProjectResources;
}

export interface ProjectDetailProps {
  project: ProjectData;
  userRole: 'student' | 'teacher';
  onBack: () => void;
}

export default function ProjectDetail({ project, userRole, onBack }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Helper functions
  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { variant: 'success' as const, icon: CheckCircle };
      case 'assigned':
        return { variant: 'soft-primary' as const, icon: BookOpen };
      case 'in-progress':
        return { variant: 'warning' as const, icon: Clock };
      default:
        return { variant: 'secondary' as const, icon: AlertTriangle };
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success' as const;
      case 'medium':
        return 'warning' as const;
      case 'hard':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const formatDate = (date: FirebaseTimestampType | Date) => {
    if (!date) return 'N/A';
    
    if (date instanceof Date) {
      return format(date, 'PPP');
    }
    
    // Firebase Timestamp
    if (typeof date === 'object' && 'toDate' in date) {
      return format(date.toDate(), 'PPP');
    }
    
    return 'N/A';
  };

  const statusProps = getStatusBadgeProps(project.status);
  const StatusIcon = statusProps.icon;

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 max-w-7xl mx-auto bg-neutral-50 dark:bg-neutral-900">
      {/* Header Navigation */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          size="default"
          className="text-blueberry-600 hover:text-blueberry-700 hover:bg-blueberry-50 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
        >
          <ArrowLeft size={16} className="mr-2" />
          {userRole === 'student' ? 'Back to My Projects' : 'Back to Project Management'}
        </Button>
        <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-600" />
        <Badge variant="outline-primary" size="default">
          <User size={14} className="mr-1" />
          {userRole === 'student' ? 'Student View' : 'Teacher View'}
        </Badge>
      </div>

      {/* Project Header Card */}
      <Card variant="feature" className="shadow-2xl">
        <CardHeader size="lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle size="xl" className="text-neutral-900 dark:text-neutral-100 mb-3">
                {project.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-neutral-500 dark:text-neutral-400" />
                <span className="body-text text-neutral-600 dark:text-neutral-400">
                  Assigned on: <span className="font-semibold text-blueberry-700 dark:text-blueberry-300">
                    {formatDate(project.assignedAt)}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant={getDifficultyBadgeVariant(project.difficulty)} size="default">
                  <Target size={14} className="mr-1" />
                  {project.difficulty}
                </Badge>
                <Badge variant="outline" size="default">
                  <Clock size={14} className="mr-1" />
                  {project.duration}
                </Badge>
                <Badge variant={statusProps.variant} size="default">
                  <StatusIcon size={14} className="mr-1" />
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent size="lg">
          <div className="space-y-6">
            <div>
              <h3 className="subtitle text-neutral-900 dark:text-neutral-100 mb-3">Project Description</h3>
              <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                {project.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabbed Content */}
      <Card variant="elevated" className="shadow-xl">
        <CardContent noPadding>
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" icon={<BookOpen size={16} />}>
                  Overview
                </TabsTrigger>
                <TabsTrigger value="project-plan" icon={<Target size={16} />}>
                  Project Plan
                </TabsTrigger>
                <TabsTrigger value="submissions" icon={<CheckCircle size={16} />}>
                  {userRole === 'student' ? 'My Submissions' : 'Student Submissions'}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" variant="flush" className="p-6">
              <ProjectOverview 
                project={project} 
                userRole={userRole} 
                onNavigateToSubmissions={() => setActiveTab("submissions")}
              />
            </TabsContent>

            {/* Project Plan Tab */}
            <TabsContent value="project-plan" variant="flush" className="p-6">
              <ProjectPlan 
                project={project} 
                userRole={userRole} 
              />
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" variant="flush" className="p-6">
              <ProjectSubmissions 
                project={project} 
                userRole={userRole} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <Card variant="ghost" className="border-none">
        <CardContent className="flex justify-center">
          <Button 
            onClick={onBack} 
            variant="outline" 
            size="lg"
            className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
          >
            <ArrowLeft size={18} className="mr-2" />
            {userRole === 'student' ? 'Back to My Projects' : 'Back to Project Management'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}