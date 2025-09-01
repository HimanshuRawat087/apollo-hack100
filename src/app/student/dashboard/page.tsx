// app/student/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, doc, getDoc, Timestamp, documentId } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  GraduationCap, 
  BookOpen, 
  AlertTriangle, 
  User, 
  Calendar, 
  Clock, 
  Target, 
  Sparkles, 
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

// Import types
import ProjectResources from '@/components/student/student-assigned-project-detail';
import { SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail';

// Define an interface that combines data from 'assignedProjects' and 'projects' collections
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
  resources?: typeof ProjectResources;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [assignedProjects, setAssignedProjects] = useState<AssignedProjectWithDetails[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const fetchAssignedProjects = useCallback(async () => {
    if (!user || !firebaseDbService || !user.uid) return;

    setLoadingProjects(true);
    setFetchError(null);
    
    try {
      // Step 1: Fetch all assigned projects for the student
      const assignmentsRef = collection(firebaseDbService, 'assignedProjects');
      const assignmentQuery = query(assignmentsRef, where('studentUid', '==', user.uid));
      const assignmentSnapshot = await getDocs(assignmentQuery);

      if (assignmentSnapshot.empty) {
        setAssignedProjects([]);
        setLoadingProjects(false);
        return;
      }

      // Step 2: Extract unique project IDs
      const assignmentData = assignmentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const projectIds = [...new Set(assignmentData.map(assignment => assignment.projectId))];
      
      if (projectIds.length === 0) {
        setAssignedProjects([]);
        setLoadingProjects(false);
        return;
      }

      // Step 3: Batch fetch all project details
      const chunkSize = 10;
      const projectChunks: string[][] = [];
      
      for (let i = 0; i < projectIds.length; i += chunkSize) {
        projectChunks.push(projectIds.slice(i, i + chunkSize));
      }

      const allProjects: { [key: string]: any } = {};
      
      // Fetch projects in batches
      for (const chunk of projectChunks) {
        const projectsRef = collection(firebaseDbService, 'projects');
        const projectQuery = query(projectsRef, where(documentId(), 'in', chunk));
        const projectSnapshot = await getDocs(projectQuery);
        
        projectSnapshot.docs.forEach(doc => {
          allProjects[doc.id] = { id: doc.id, ...doc.data() };
        });
      }

      // Step 4: Combine assignment data with project details
      const fetchedAssignedProjects: AssignedProjectWithDetails[] = [];
      
      assignmentData.forEach(assignment => {
        const projectData = allProjects[assignment.projectId];
        
        if (projectData) {
          fetchedAssignedProjects.push({
            assignedProjectId: assignment.id,
            projectId: assignment.projectId,
            studentUid: assignment.studentUid,
            studentName: assignment.studentName || user.displayName || user.email || 'N/A',
            teacherUid: assignment.teacherUid,
            assignedAt: assignment.assignedAt as Timestamp,
            status: assignment.status,
            title: projectData.title,
            description: projectData.description,
            difficulty: projectData.difficulty,
            duration: projectData.duration,
            tasks: assignment.tasks || [],
            resources: assignment.resources || {}
          });
        } else {
          console.warn(`Project document with ID ${assignment.projectId} not found for student ${user.uid}. Skipping this assignment.`);
        }
      });
      
      // Sort by assignment date (newest first)
      fetchedAssignedProjects.sort((a, b) => {
        const dateA = a.assignedAt?.toDate?.() || new Date(0);
        const dateB = b.assignedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setAssignedProjects(fetchedAssignedProjects);
    } catch (error) {
      console.error("Error fetching assigned projects for student:", error);
      setFetchError("Failed to load your projects. Please try again later.");
    } finally {
      setLoadingProjects(false);
    }
  }, [user, user?.displayName, user?.email]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAssignedProjects();
    }
  }, [user, authLoading, fetchAssignedProjects]);

  // Function to handle clicking on a project card to view details
  const handleViewDetails = (project: AssignedProjectWithDetails) => {
    // Navigate to the project detail page using Next.js router
    router.push(`/student/project/${project.projectId}`);
  };

  // Filter projects based on search and filters
  const filteredProjects = assignedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  // Helper function to get status badge variant and color
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

  // Helper function to get difficulty badge variant
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

  // Get summary statistics
  const stats = {
    total: assignedProjects.length,
    completed: assignedProjects.filter(p => p.status.toLowerCase() === 'completed').length,
    inProgress: assignedProjects.filter(p => p.status.toLowerCase() === 'in-progress').length,
    assigned: assignedProjects.filter(p => p.status.toLowerCase() === 'assigned').length
  };

  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900">
        <LoadingSpinner 
          layout="centered"
          size="xl"
          variant="primary"
          label="Loading your dashboard"
          description="Please wait while we fetch your assigned projects..."
          showLabel
        />
      </div>
    );
  }

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
              Please sign in to view your student dashboard and assigned projects.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 mx-auto max-w-7xl bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 flex items-center justify-center shadow-lg">
            <GraduationCap size={48} className="text-blueberry-600 dark:text-blueberry-400" />
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blueberry-400 to-blueberry-600 flex items-center justify-center animate-pulse">
            <Sparkles size={24} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="heading-1 bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent dark:from-blueberry-400 dark:to-blueberry-500">
            Student Dashboard
          </h1>
          <p className="heading-3 text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Welcome back, {user.displayName || user.email || 'Student'}! Here are your assigned projects and learning opportunities.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {assignedProjects.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col items-center space-y-3 pt-6">
              <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={24} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div className="space-y-1">
                <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">{stats.total}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Total Projects</div>
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col items-center space-y-3 pt-6">
              <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle size={24} className="text-success-600 dark:text-success-400" />
              </div>
              <div className="space-y-1">
                <div className="heading-2 text-success-600 dark:text-success-400">{stats.completed}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Completed</div>
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col items-center space-y-3 pt-6">
              <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock size={24} className="text-warning-600 dark:text-warning-400" />
              </div>
              <div className="space-y-1">
                <div className="heading-2 text-warning-600 dark:text-warning-400">{stats.inProgress}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">In Progress</div>
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col items-center space-y-3 pt-6">
              <div className="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target size={24} className="text-error-600 dark:text-error-400" />
              </div>
              <div className="space-y-1">
                <div className="heading-2 text-error-600 dark:text-error-400">{stats.assigned}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">New Assignments</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter Section */}
      {assignedProjects.length > 0 && (
        <Card variant="elevated" className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                <Filter size={20} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div>
                <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Filter Projects</CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                  Search and filter your assigned projects
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Search Projects</label>
                <Input
                  variant="outline"
                  size="default"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search size={16} />}
                />
              </div>
              
              <div className="space-y-2">
                <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger variant="outline" size="default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Difficulty</label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger variant="outline" size="default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Filter Results Info */}
            {(searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all') && (
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" size="default">
                  {filteredProjects.length} of {assignedProjects.length} projects shown
                </Badge>
                {(searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDifficultyFilter('all');
                    }}
                    className="text-blueberry-600 hover:text-blueberry-700"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="w-full">
        {loadingProjects ? (
          <LoadingSpinner 
            layout="centered"
            size="lg"
            variant="primary"
            label="Loading your projects"
            description="Fetching your assigned projects and tasks..."
            showLabel
          />
        ) : fetchError ? (
          <Card variant="ghost" className="text-center py-16">
            <CardContent size="xl">
              <div className="w-24 h-24 bg-error-100 dark:bg-error-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={48} className="text-error-600 dark:text-error-400" />
              </div>
              <div className="space-y-4">
                <h3 className="heading-3 text-error-800 dark:text-error-200">Unable to Load Projects</h3>
                <p className="body-text text-error-700 dark:text-error-300 max-w-md mx-auto">{fetchError}</p>
                <Button 
                  variant="outline" 
                  onClick={fetchAssignedProjects}
                  className="border-error-300 text-error-700 hover:bg-error-50 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-950"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card variant="ghost" className="text-center py-16">
            <CardContent size="xl">
              <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={48} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <div className="space-y-2">
                <h3 className="heading-3 text-neutral-900 dark:text-neutral-100">
                  {assignedProjects.length === 0 ? 'No Projects Assigned Yet' : 'No Projects Match Your Filters'}
                </h3>
                <p className="body-text text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  {assignedProjects.length === 0 
                    ? "You don't have any projects assigned to you yet. Check back later or contact your instructor for assignments."
                    : "Try adjusting your search criteria or clear the filters to see more projects."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const statusProps = getStatusBadgeProps(project.status);
              const StatusIcon = statusProps.icon;
              
              return (
                <Card
                  key={project.assignedProjectId}
                  variant="elevated"
                  className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                  onClick={() => handleViewDetails(project)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle size="lg" className="text-neutral-900 dark:text-neutral-100 group-hover:text-blueberry-700 dark:group-hover:text-blueberry-300 transition-colors line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-neutral-500 dark:text-neutral-400">
                          <Calendar size={14} />
                          <span className="body-text text-sm">
                            {project.assignedAt ? format(project.assignedAt.toDate(), 'PPP') : 'Date not available'}
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <StatusIcon size={20} className="text-blueberry-600 dark:text-blueberry-400" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-3">
                      <Badge variant={getDifficultyBadgeVariant(project.difficulty)} size="sm">
                        {project.difficulty}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        <Clock size={12} className="mr-1" />
                        {project.duration}
                      </Badge>
                      <Badge variant={statusProps.variant} size="sm">
                        <StatusIcon size={12} className="mr-1" />
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="body-text text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      {project.tasks && project.tasks.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Target size={14} className="text-blueberry-600 dark:text-blueberry-400" />
                          <span className="body-text text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            {project.tasks.length} Task{project.tasks.length !== 1 ? 's' : ''} Available
                          </span>
                        </div>
                      )}
                      
                      {project.resources?.papers && project.resources.papers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-warning-600 dark:text-warning-400" />
                          <span className="body-text text-neutral-700 dark:text-neutral-300 font-medium text-sm">
                            {project.resources.papers.length} Research Paper{project.resources.papers.length !== 1 ? 's' : ''} Available
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-blueberry-600 hover:text-blueberry-700 hover:bg-blueberry-50 dark:text-blueberry-400 dark:hover:bg-blueberry-950 group-hover:bg-blueberry-100 dark:group-hover:bg-blueberry-900"
                      >
                        View Project Details
                        <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Section */}
      {assignedProjects.length > 0 && (
        <Card variant="gradient" className="mt-8">
          <CardContent className='pt-6'>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-900 rounded-xl flex items-center justify-center">
                <GraduationCap size={24} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div className="flex-1">
                <h3 className="subtitle text-blueberry-800 dark:text-blueberry-200 mb-2">Learning Tips</h3>
                <div className="grid md:grid-cols-3 gap-4 body-text text-blueberry-700 dark:text-blueberry-300">
                  <div className="space-y-1">
                    <p className="overline text-blueberry-900 dark:text-blueberry-100">Stay Organized</p>
                    <p>Click on projects to view detailed tasks and requirements</p>
                  </div>
                  <div className="space-y-1">
                    <p className="overline text-blueberry-900 dark:text-blueberry-100">Track Progress</p>
                    <p>Monitor your completion status and upcoming deadlines</p>
                  </div>
                  <div className="space-y-1">
                    <p className="overline text-blueberry-900 dark:text-blueberry-100">Ask Questions</p>
                    <p>Reach out to your instructor if you need help or clarification</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}