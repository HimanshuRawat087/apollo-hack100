// app/student/project/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, User, BookOpen } from 'lucide-react';

// Import the existing detail component (we'll use this temporarily)
import StudentAssignedProjectDetail, { ProjectResources } from '@/components/student/student-assigned-project-detail';

// Import types
import { SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail';
import ProjectDetail from '@/components/project';

// Define the project interface
interface AssignedProjectWithDetails {
  assignedProjectId: string;
  projectId: string;
  studentUid: string;
  studentName: string;
  teacherUid: string;
  assignedAt: Timestamp;
  status: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tasks?: SavedProjectTask[];
  resources?: ProjectResources;
}

export default function StudentProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<AssignedProjectWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id as string;

  const fetchProjectDetails = useCallback(async () => {
    if (!user || !firebaseDbService || !user.uid || !projectId) return;

    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Find the assignment record for this student and project
      const assignmentsRef = collection(firebaseDbService, 'assignedProjects');
      const assignmentQuery = user.role === 'teacher' 
        ? query(
            assignmentsRef, 
            where('teacherUid', '==', user.uid),
            where('projectId', '==', projectId)
          )
        : query(
            assignmentsRef, 
            where('studentUid', '==', user.uid),
            where('projectId', '==', projectId)
          );
      const assignmentSnapshot = await getDocs(assignmentQuery);

      if (assignmentSnapshot.empty) {
        setError("Project not found or you don't have access to this project.");
        setLoading(false);
        return;
      }

      // Get the assignment data
      const assignmentDoc = assignmentSnapshot.docs[0];
      const assignmentData = { id: assignmentDoc.id, ...assignmentDoc.data() };

      // Step 2: Fetch the project details
      const projectDocRef = doc(firebaseDbService, 'projects', projectId);
      const projectSnapshot = await getDoc(projectDocRef);

      if (!projectSnapshot.exists()) {
        setError("Project details not found.");
        setLoading(false);
        return;
      }

      const projectData = projectSnapshot.data();

      // Step 3: Combine the data
      const combinedProject: AssignedProjectWithDetails = {
        assignedProjectId: assignmentData.id,
        projectId: projectId,
        studentUid: assignmentData.studentUid,
        studentName: assignmentData.studentName || user.displayName || user.email || 'N/A',
        teacherUid: assignmentData.teacherUid,
        assignedAt: assignmentData.assignedAt as Timestamp,
        status: assignmentData.status,
        title: projectData.title,
        description: projectData.description,
        difficulty: projectData.difficulty,
        duration: projectData.duration,
        tasks: assignmentData.tasks || [],
        resources: assignmentData.resources || {}
      };

      setProject(combinedProject);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Failed to load project details. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user, user?.displayName, user?.email, projectId]);

  useEffect(() => {
    if (!authLoading && user && projectId) {
      fetchProjectDetails();
    }
  }, [user, authLoading, projectId, fetchProjectDetails]);

  const handleBackToList = () => {
    router.push('/student/dashboard');
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900">
        <LoadingSpinner 
          layout="centered"
          size="xl"
          variant="primary"
          label="Loading project details"
          description="Please wait while we fetch your project information..."
          showLabel
        />
      </div>
    );
  }

  // Authentication required
  if (!user) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900">
        <Card variant="ghost" className="text-center py-16 max-w-md">
          <CardContent size="xl">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User size={48} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-2">Authentication Required</h3>
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              Please sign in to view this project.
            </p>
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')}
              className="mt-4"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900">
        <Card variant="ghost" className="text-center py-16 max-w-md">
          <CardContent size="xl">
            <div className="w-24 h-24 bg-error-100 dark:bg-error-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={48} className="text-error-600 dark:text-error-400" />
            </div>
            <div className="space-y-4">
              <h3 className="heading-3 text-error-800 dark:text-error-200">Project Not Found</h3>
              <p className="body-text text-error-700 dark:text-error-300">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleBackToList}
                  className="border-error-300 text-error-700 hover:bg-error-50 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-950"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={fetchProjectDetails}
                  className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Project not found
  if (!project) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900">
        <Card variant="ghost" className="text-center py-16 max-w-md">
          <CardContent size="xl">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={48} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="space-y-4">
              <h3 className="heading-3 text-neutral-900 dark:text-neutral-100">Project Not Found</h3>
              <p className="body-text text-neutral-600 dark:text-neutral-400">
                The requested project could not be found or you don't have access to it.
              </p>
              <Button 
                variant="outline" 
                onClick={handleBackToList}
                className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the project detail component
  return (
    <ProjectDetail
      project={project}
      userRole='student'
      onBack={handleBackToList}
    />
  );
}