'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
import { 
  BookOpen, 
  Lightbulb, 
  TrendingUp,
  Clock,
  Filter,
  BarChart3,
  Users,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Target,
  Calendar,
  Award,
  Plus,
  Search
} from 'lucide-react';

// Apollo Design System Components
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SavedProjectTask } from './student-mentor/idea-detail';
import { cn } from '@/lib/utils';
import ProjectDetailView from './project-detail-view';

// Project Template Interface
interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  teacherId: string;
  createdAt: Timestamp;
  tasks: SavedProjectTask[];
  // Assignment statistics
  totalAssignments?: number;
  activeAssignments?: number;
  completedAssignments?: number;
}

// Enhanced Dashboard Header Component
const DashboardHeader = ({ 
  totalProjects, 
  totalAssignments, 
  activeAssignments 
}: { 
  totalProjects: number;
  totalAssignments: number;
  activeAssignments: number;
}) => (
  <Card variant="gradient" className="mb-8">
    <CardHeader className="text-center pb-6">
      <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-3xl flex items-center justify-center shadow-2xl">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <CardTitle size="xl" gradient className="mb-3">
        My Project Templates
      </CardTitle>
      <p className="body-text text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto text-lg">
        Manage your AI-generated project templates, track student assignments, and create new learning experiences
      </p>
    </CardHeader>
    
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-blueberry-100 dark:bg-blueberry-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Target className="w-7 h-7 text-blueberry-600 dark:text-blueberry-400" />
          </div>
          <div>
            <p className="heading-1 text-blueberry-600 dark:text-blueberry-400">{totalProjects}</p>
            <p className="subtitle text-neutral-700 dark:text-neutral-300">Project Templates</p>
            <p className="body-text text-neutral-500 dark:text-neutral-400 text-sm">Created by you</p>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-success-100 dark:bg-success-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Users className="w-7 h-7 text-success-600 dark:text-success-400" />
          </div>
          <div>
            <p className="heading-1 text-success-600 dark:text-success-400">{totalAssignments}</p>
            <p className="subtitle text-neutral-700 dark:text-neutral-300">Total Assignments</p>
            <p className="body-text text-neutral-500 dark:text-neutral-400 text-sm">Across all projects</p>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-warning-100 dark:bg-warning-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-7 h-7 text-warning-600 dark:text-warning-400" />
          </div>
          <div>
            <p className="heading-1 text-warning-600 dark:text-warning-400">{activeAssignments}</p>
            <p className="subtitle text-neutral-700 dark:text-neutral-300">Active Assignments</p>
            <p className="body-text text-neutral-500 dark:text-neutral-400 text-sm">Currently in progress</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced Filter and Search Component
const ProjectControls = ({ 
  searchTerm,
  setSearchTerm,
  sortFilter,
  setSortFilter,
  difficultyFilter,
  setDifficultyFilter,
  onCreateNew,
  onManageAssessment
}: { 
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortFilter: string;
  setSortFilter: (value: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (value: string) => void;
  onCreateNew: () => void;
  onManageAssessment: () => void;
}) => (
  <Card variant="elevated" className="mb-6 shadow-lg">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1 w-full lg:w-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <Input
              placeholder="Search project templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              size="lg"
              className="md:col-span-1"
            />
            
            {/* Sort Filter */}
            <Select onValueChange={setSortFilter} value={sortFilter}>
              <SelectTrigger size="lg">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="most-assigned">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Most Assigned
                  </div>
                </SelectItem>
                <SelectItem value="alphabetical">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Alphabetical
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Difficulty Filter */}
            <Select onValueChange={setDifficultyFilter} value={difficultyFilter}>
              <SelectTrigger size="lg">
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <Separator />
                <SelectItem value="Easy">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                    Easy
                  </div>
                </SelectItem>
                <SelectItem value="Medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="Difficult">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                    Difficult
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Manage Assessment Button */}
          <Button
            variant="outline"
            size="xl"
            onClick={onManageAssessment}
            className="w-full lg:w-auto"
          >
            <Award className="w-5 h-5 mr-2" />
            Manage Assessment
          </Button>
          {/* Create New Project Button */}
          <Button
            variant="default"
            size="xl"
            onClick={onCreateNew}
            className="bg-gradient-to-r from-blueberry-600 to-blueberry-700 hover:from-blueberry-700 hover:to-blueberry-800 shadow-button hover:shadow-button-hover w-full lg:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Enhanced Project Template Card Component
const ProjectTemplateCard = ({ 
  project, 
  onClick 
}: { 
  project: ProjectTemplate; 
  onClick: () => void;
}) => {
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': 
        return { variant: 'success' as const, icon: '🟢', color: 'text-success-700' };
      case 'medium': 
        return { variant: 'warning' as const, icon: '🟡', color: 'text-warning-700' };
      case 'difficult': 
        return { variant: 'destructive' as const, icon: '🔴', color: 'text-error-700' };
      default: 
        return { variant: 'secondary' as const, icon: '⚪', color: 'text-neutral-700' };
    }
  };

  const difficultyConfig = getDifficultyConfig(project.difficulty);
  const totalTasks = project.tasks?.length || 0;
  const totalHints = project.tasks?.reduce((total, task) => total + (task.hints?.length || 0), 0) || 0;

  return (
    <Card 
      variant="interactive"
      className="group cursor-pointer h-full flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-blueberry-300 dark:hover:border-blueberry-600"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <CardTitle className="heading-3 text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-blueberry-600 dark:group-hover:text-blueberry-400 transition-colors flex-1">
            {project.title}
          </CardTitle>
          <div className="w-12 h-12 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-950 dark:to-blueberry-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blueberry-500 group-hover:to-blueberry-600 transition-all duration-300 shadow-lg">
            <Lightbulb className="w-6 h-6 text-blueberry-600 dark:text-blueberry-400 group-hover:text-white transition-colors" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={difficultyConfig.variant} size="default" className="font-semibold">
            {difficultyConfig.icon} {project.difficulty}
          </Badge>
          <Badge variant="outline" size="default">
            <Clock className="w-3 h-3 mr-1" />
            {project.duration}
          </Badge>
          <Badge variant="soft-primary" size="default">
            <Target className="w-3 h-3 mr-1" />
            {totalTasks} tasks
          </Badge>
        </div>

        {/* Assignment Statistics */}
        {(project.totalAssignments || 0) > 0 && (
          <div className="flex items-center gap-2 p-2 bg-success-25 dark:bg-success-950 rounded-lg border border-success-200 dark:border-success-800">
            <Users className="w-4 h-4 text-success-600 dark:text-success-400" />
            <span className="body-text text-success-700 dark:text-success-300 text-sm font-medium">
              Assigned to {project.totalAssignments} student{project.totalAssignments !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <p className="body-text text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Project Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 bg-blueberry-25 dark:bg-blueberry-950 rounded-lg">
            <p className="heading-3 text-blueberry-600 dark:text-blueberry-400">{totalTasks}</p>
            <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-xs font-medium">Tasks</p>
          </div>
          <div className="text-center p-3 bg-success-25 dark:bg-success-950 rounded-lg">
            <p className="heading-3 text-success-600 dark:text-success-400">{totalHints}</p>
            <p className="body-text text-success-700 dark:text-success-300 text-xs font-medium">AI Hints</p>
          </div>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full group-hover:border-blueberry-400 group-hover:text-blueberry-600 group-hover:bg-blueberry-50 dark:group-hover:bg-blueberry-950 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Manage & Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ hasFilter, onCreateNew }: { hasFilter: boolean; onCreateNew: () => void; }) => (
  <Card variant="ghost" className="text-center py-16">
    <CardContent>
      <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-3xl flex items-center justify-center shadow-lg">
        <BookOpen className="w-12 h-12 text-neutral-400" />
      </div>
      <CardTitle size="lg" className="mb-3">
        {hasFilter ? 'No projects match your search' : 'No project templates yet'}
      </CardTitle>
      <p className="body-text text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
        {hasFilter 
          ? 'Try adjusting your search terms or filters to find the projects you\'re looking for.'
          : 'Start creating AI-powered project templates that you can assign to multiple students and reuse across different classes.'
        }
      </p>
      {!hasFilter && (
        <Button 
          variant="default" 
          size="xl"
          onClick={onCreateNew}
          className="shadow-button hover:shadow-button-hover bg-gradient-to-r from-blueberry-600 to-blueberry-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Project
        </Button>
      )}
    </CardContent>
  </Card>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex justify-center items-center py-20">
    <LoadingSpinner 
      size="2xl" 
      variant="primary" 
      showLabel={true}
      label="Loading Project Templates"
      description="Fetching your AI-generated projects and assignment statistics..."
    />
  </div>
);

export default function TeacherDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectTemplate[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedProject, setSelectedProject] = useState<ProjectTemplate | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const fetchProjectTemplates = useCallback(async () => {
    if (!user || !firebaseDbService || !user.uid) return;

    setLoadingProjects(true);
    try {
      // Step 1: Fetch all project templates created by the teacher (without orderBy to avoid index)
      const projectsRef = collection(firebaseDbService, 'projects');
      const projectQuery = query(
        projectsRef, 
        where('teacherId', '==', user.uid)
      );
      const projectSnapshot = await getDocs(projectQuery);

      if (projectSnapshot.empty) {
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      // Step 2: Get all projects data and sort in memory
      const allProjectsData = projectSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectTemplate[];

      // Sort in memory by createdAt (newest first)
      allProjectsData.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      // Step 3: Fetch ALL assignment statistics for the teacher at once
      const assignedProjectsRef = collection(firebaseDbService, 'assignedProjects');
      const allAssignmentsQuery = query(
        assignedProjectsRef,
        where('teacherUid', '==', user.uid)
      );
      const allAssignmentsSnapshot = await getDocs(allAssignmentsQuery);
      
      // Group assignments by projectId
      const assignmentsByProject: { [projectId: string]: any[] } = {};
      allAssignmentsSnapshot.docs.forEach(doc => {
        const assignment = doc.data();
        const projectId = assignment.projectId;
        if (!assignmentsByProject[projectId]) {
          assignmentsByProject[projectId] = [];
        }
        assignmentsByProject[projectId].push(assignment);
      });

      // Step 4: Add statistics to each project
      const projectsWithStats: ProjectTemplate[] = allProjectsData.map(projectData => {
        const projectAssignments = assignmentsByProject[projectData.id] || [];
        
        const totalAssignments = projectAssignments.length;
        const activeAssignments = projectAssignments.filter(assignment => {
          const status = assignment.status;
          return status === 'assigned' || status === 'in-progress';
        }).length;
        const completedAssignments = projectAssignments.filter(assignment => {
          const status = assignment.status;
          return status === 'completed';
        }).length;

        return {
          ...projectData,
          totalAssignments,
          activeAssignments,
          completedAssignments
        };
      });
      
      setProjects(projectsWithStats);
    } catch (error) {
      console.error("Error fetching project templates:", error);
      setProjects([]); // Set empty array on error
    } finally {
      setLoadingProjects(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProjectTemplates();
    }
  }, [user, authLoading, fetchProjectTemplates]);

  const handleViewDetails = (project: ProjectTemplate) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setViewMode('list');
    // Refresh data when coming back from detail view
    fetchProjectTemplates();
  };

  const handleCreateNew = () => {
    // Navigate to Student Mentor page
    window.location.href = '/teacher/dashboard/student-mentor';
  };

  const handleManageAssessment = () => {
    window.location.href = '/teacher/assessment-admin';
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(project => project.difficulty === difficultyFilter);
    }

    // Apply sorting
    switch (sortFilter) {
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
        break;
      case 'most-assigned':
        filtered.sort((a, b) => (b.totalAssignments || 0) - (a.totalAssignments || 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        break;
    }

    return filtered;
  }, [projects, searchTerm, sortFilter, difficultyFilter]);

  // Calculate statistics
  const totalProjects = projects.length;
  const totalAssignments = projects.reduce((sum, p) => sum + (p.totalAssignments || 0), 0);
  const activeAssignments = projects.reduce((sum, p) => sum + (p.activeAssignments || 0), 0);

  if (authLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card variant="feature" className="text-center max-w-md">
          <CardContent className="p-8">
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              Please sign in to view your dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={handleBackToList}
        teacherId={user.uid}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <DashboardHeader 
        totalProjects={totalProjects}
        totalAssignments={totalAssignments}
        activeAssignments={activeAssignments}
      />

      <ProjectControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortFilter={sortFilter}
        setSortFilter={setSortFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        onCreateNew={handleCreateNew}
        onManageAssessment={handleManageAssessment}
      />

      {loadingProjects ? (
        <LoadingState />
      ) : projects.length === 0 ? (
        <EmptyState hasFilter={false} onCreateNew={handleCreateNew} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState hasFilter={true} onCreateNew={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectTemplateCard
              key={project.id}
              project={project}
              onClick={() => handleViewDetails(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}