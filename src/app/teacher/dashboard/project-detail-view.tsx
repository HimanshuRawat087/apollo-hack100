"use client";

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
import { 
  ArrowLeft,
  Users,
  UserPlus,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Star,
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  BarChart3,
  User,
  Mail,
  GraduationCap,
  ChevronRight,
  Activity,
  BookOpenCheck,
  Timer,
  Trophy,
  Lightbulb,
  FileText,
  Eye
} from 'lucide-react';

// Apollo Design System Components
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

import { SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail';
import { cn } from '@/lib/utils';
import AssignProjectDialog from '@/components/teacher/assign-project-dialog';

// Interfaces
interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  teacherId: string;
  createdAt: any;
  tasks: SavedProjectTask[];
  totalAssignments?: number;
  activeAssignments?: number;
  completedAssignments?: number;
}

interface StudentAssignment {
  id: string;
  projectId: string;
  studentUid: string;
  studentName: string;
  assignedAt: any;
  status: 'assigned' | 'in-progress' | 'completed' | 'overdue';
  progress?: {
    totalTasks: number;
    completedTasks: number;
    currentTask: number;
    overallProgress: number;
  };
  studentEmail?: string;
}

// Project Overview Component
const ProjectOverview = ({ project }: { project: ProjectTemplate }) => {
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': 
        return { variant: 'success' as const, icon: '🟢' };
      case 'medium': 
        return { variant: 'warning' as const, icon: '🟡' };
      case 'difficult': 
        return { variant: 'destructive' as const, icon: '🔴' };
      default: 
        return { variant: 'secondary' as const, icon: '⚪' };
    }
  };

  const difficultyConfig = getDifficultyConfig(project.difficulty);
  const totalTasks = project.tasks?.length || 0;
  const totalHints = project.tasks?.reduce((total, task) => total + (task.hints?.length || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 flex items-center justify-center shadow-lg">
            <BookOpen size={48} className="text-blueberry-600 dark:text-blueberry-400" />
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blueberry-400 to-blueberry-600 flex items-center justify-center animate-pulse">
            <Star size={24} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent dark:from-blueberry-400 dark:to-blueberry-500">
            {project.title}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto font-normal leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant={difficultyConfig.variant} size="lg">
              {difficultyConfig.icon} {project.difficulty}
            </Badge>
            <Badge variant="outline" size="lg">
              <Clock className="w-4 h-4 mr-2" />
              {project.duration}
            </Badge>
            <Badge variant="soft-primary" size="lg">
              <Target className="w-4 h-4 mr-2" />
              {totalTasks} tasks
            </Badge>
            <Badge variant="outline" size="lg">
              <Lightbulb className="w-4 h-4 mr-2" />
              {totalHints} hints
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
            <Target className="text-blueberry-600 dark:text-blueberry-400" size={40} />
          </div>
          <div className="text-3xl font-bold text-blueberry-600 dark:text-blueberry-400">{totalTasks}</div>
          <div className="text-neutral-600 dark:text-neutral-400">Total Tasks</div>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900 dark:to-success-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
            <Lightbulb className="text-success-600 dark:text-success-400" size={40} />
          </div>
          <div className="text-3xl font-bold text-success-600 dark:text-success-400">{totalHints}</div>
          <div className="text-neutral-600 dark:text-neutral-400">AI Hints</div>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900 dark:to-warning-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
            <Users className="text-warning-600 dark:text-warning-400" size={40} />
          </div>
          <div className="text-3xl font-bold text-warning-600 dark:text-warning-400">{project.totalAssignments || 0}</div>
          <div className="text-neutral-600 dark:text-neutral-400">Total Assigned</div>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
            <Activity className="text-neutral-600 dark:text-neutral-400" size={40} />
          </div>
          <div className="text-3xl font-bold text-neutral-600 dark:text-neutral-400">{project.activeAssignments || 0}</div>
          <div className="text-neutral-600 dark:text-neutral-400">Active Now</div>
        </div>
      </div>
    </div>
  );
};

// Task Breakdown Component
const TaskBreakdown = ({ tasks }: { tasks: SavedProjectTask[] }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
          <Target className="text-neutral-600 dark:text-neutral-400" size={40} />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">No tasks defined</h3>
          <p className="text-neutral-500 dark:text-neutral-500 max-w-md mx-auto">
            This project template doesn't have any tasks configured yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpenCheck className="text-blueberry-600 dark:text-blueberry-400" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Task Breakdown</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          This project contains {tasks.length} learning tasks designed to guide students through the complete learning journey.
        </p>
      </div>
      
      <div className="space-y-6">
        {tasks.map((task, index) => (
          <Card key={task.taskId} variant="elevated" className="hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-lg font-bold text-white">{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{task.taskName}</h4>
                    {task.hints && task.hints.length > 0 && (
                      <Badge variant="gradient" size="sm">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {task.hints.length} hints
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-600 dark:text-neutral-400">Duration: <strong>{task.duration} days</strong></span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-600 dark:text-neutral-400">Start: <strong>{task.startDate}</strong></span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-neutral-500" />
                      <span className="text-neutral-600 dark:text-neutral-400">End: <strong>{task.endDate}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Student Assignments Component
const StudentAssignments = ({ 
  assignments, 
  loading, 
  onAssignNew,
  onViewStudentDetail 
}: { 
  assignments: StudentAssignment[];
  loading: boolean;
  onAssignNew: () => void;
  onViewStudentDetail: (projectId: string) => void;
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { variant: 'success' as const, icon: CheckCircle, label: 'Completed' };
      case 'in-progress':
        return { variant: 'default' as const, icon: Clock, label: 'In Progress' };
      case 'overdue':
        return { variant: 'destructive' as const, icon: AlertTriangle, label: 'Overdue' };
      case 'assigned':
      default:
        return { variant: 'secondary' as const, icon: Calendar, label: 'Assigned' };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="xl" showLabel label="Loading student assignments..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="text-blueberry-600 dark:text-blueberry-400" size={48} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Student Assignments</h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {assignments.length} students are currently working on this project. Track their progress and provide support when needed.
          </p>
        </div>

        <div className="space-y-3">
          <Button variant="gradient" size="xl" onClick={onAssignNew} className="w-full max-w-md">
            <UserPlus className="mr-2 h-5 w-5" />
            Assign to More Students
          </Button>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <Users className="text-neutral-600 dark:text-neutral-400" size={40} />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-neutral-600 dark:text-neutral-400">No students assigned yet</h3>
            <p className="text-neutral-500 dark:text-neutral-500 max-w-md mx-auto">
              This project template hasn't been assigned to any students yet. Start by assigning it to students in your class.
            </p>
          </div>
          <Button variant="gradient" size="xl" onClick={onAssignNew}>
            <UserPlus className="mr-2 h-5 w-5" />
            Assign to Students
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {assignments.map((assignment) => {
            const statusConfig = getStatusConfig(assignment.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card 
                key={assignment.id} 
                variant="elevated" 
                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => onViewStudentDetail(assignment.projectId)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl font-bold text-white">
                        {assignment.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-blueberry-600 dark:group-hover:text-blueberry-400 transition-colors">
                        {assignment.studentName}
                      </CardTitle>
                      {assignment.studentEmail && (
                        <div className="flex items-center gap-2 mt-2">
                          <Mail className="w-4 h-4 text-neutral-500" />
                          <p className="text-neutral-600 dark:text-neutral-400">{assignment.studentEmail}</p>
                        </div>
                      )}
                    </div>
                    <Badge variant={statusConfig.variant} size="lg">
                      <StatusIcon className="w-4 h-4 mr-2" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {/* Assignment Date */}
                    <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                      <Calendar className="w-5 h-5 text-blueberry-500" />
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">Assigned Date</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {assignment.assignedAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress */}
                    {assignment.progress && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blueberry-500" />
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">Progress</span>
                          </div>
                          <Badge variant="outline" size="sm">
                            Task {assignment.progress.currentTask} of {assignment.progress.totalTasks}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">Completion</span>
                            <span className="font-bold text-neutral-900 dark:text-neutral-100">
                              {Math.round(assignment.progress.overallProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blueberry-500 to-blueberry-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${assignment.progress.overallProgress}%` }}
                            />
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {assignment.progress.completedTasks} of {assignment.progress.totalTasks} tasks completed
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* View Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700 group-hover:text-blueberry-600 dark:group-hover:text-blueberry-400 transition-colors">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-semibold">View Details</span>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main Project Detail View Component
export default function ProjectDetailView({
  project,
  onBack,
  teacherId
}: {
  project: ProjectTemplate;
  onBack: () => void;
  teacherId: string;
}) {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');


  const fetchAssignments = useCallback(async () => {
    if (!project.id || !firebaseDbService || !teacherId) return;

    setLoadingAssignments(true);
    try {
      const assignedProjectsRef = collection(firebaseDbService, 'assignedProjects');
      const assignmentQuery = query(
        assignedProjectsRef,
        where('teacherUid', '==', teacherId)
      );
      const assignmentSnapshot = await getDocs(assignmentQuery);

      const assignmentData: StudentAssignment[] = [];
      
      for (const assignmentDoc of assignmentSnapshot.docs) {
        const data = assignmentDoc.data();
        
        if (data.projectId !== project.id) {
          continue;
        }
        
        let studentEmail = '';
        try {
          const userDoc = await getDoc(doc(firebaseDbService, 'users', data.studentUid));
          if (userDoc.exists()) {
            studentEmail = userDoc.data().email || '';
          }
        } catch (error) {
          console.warn('Could not fetch student email:', error);
        }
        
        assignmentData.push({
          id: assignmentDoc.id,
          projectId: data.projectId,
          studentUid: data.studentUid,
          studentName: data.studentName,
          studentEmail,
          assignedAt: data.assignedAt,
          status: data.status || 'assigned',
          progress: data.progress
        });
      }
      
      setAssignments(assignmentData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  }, [project.id, teacherId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleAssignNew = () => {
    setIsAssignDialogOpen(true);
  };

  const handleViewStudentDetail = (projectId: string) => {
    window.location.href = `/student/project/${projectId}`;
  };

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 w-full max-w-6xl mx-auto">
      {/* Back Button */}
      <Button 
        onClick={onBack} 
        variant="outline" 
        size="lg" 
        className="self-start"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> 
        Back to Projects
      </Button>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 bg-white p-4 rounded-md">
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" icon={<BookOpen className="w-4 h-4" />}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" icon={<Target className="w-4 h-4" />} count={project.tasks?.length || 0}>
              Tasks
            </TabsTrigger>
            <TabsTrigger value="assignments" icon={<Users className="w-4 h-4" />} count={assignments.length}>
              Students
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <ProjectOverview
            project={project}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskBreakdown tasks={project.tasks} />
        </TabsContent>

        <TabsContent value="assignments">
          <StudentAssignments 
            assignments={assignments}
            loading={loadingAssignments}
            onAssignNew={handleAssignNew}
            onViewStudentDetail={handleViewStudentDetail}
          />
        </TabsContent>
      </Tabs>

      {/* Assign Project Dialog */}
      {isAssignDialogOpen && (
        <AssignProjectDialog
          project={{
            id: project.id,
            title: project.title,
            description: project.description,
            difficulty: project.difficulty,
            duration: project.duration,
            tasks: project.tasks
          }}
          isOpen={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          teacherId={teacherId}
          type="savedProject"
        />
      )}
    </div>
  );
}