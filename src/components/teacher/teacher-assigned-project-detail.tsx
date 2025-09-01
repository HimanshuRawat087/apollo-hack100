// components/teacher/teacher-assigned-project-detail.tsx
"use client";

import { ArrowLeft, User, Calendar, Clock, Target, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProjectReport } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Apollo Design System Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';
import { ProjectIdea, SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail';
import TaskHints from '@/app/teacher/dashboard/student-mentor/task-hints';

// Define the interface for the project data this component expects
interface AssignedProjectWithDetails {
  assignedProjectId: string;
  projectId: string;
  studentUid: string;
  studentName: string;
  teacherUid: string;
  assignedAt: Timestamp;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tasks?: SavedProjectTask[];
}

interface TeacherAssignedProjectDetailProps {
  project: AssignedProjectWithDetails;
  onBack: () => void;
}

// Enhanced Project Header Component
const ProjectDetailHeader = ({
  project,
  onBack
}: {
  project: AssignedProjectWithDetails;
  onBack: () => void;
}) => {
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'difficult': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatAssignedDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline" className="shadow-sm">
        <ArrowLeft className="mr-2 h-4 w-4" /> 
        Back to All Projects
      </Button>
      
      <Card variant="feature" className="shadow-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 space-y-3">
              <CardTitle size="lg" className="text-neutral-900 dark:text-neutral-100">
                {project.title}
              </CardTitle>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="subtitle text-neutral-700 dark:text-neutral-300">
                    Assigned to:
                  </span>
                  <span className="subtitle text-blueberry-600 dark:text-blueberry-400">
                    {project.studentName}
                  </span>
                </div>
                {project.assignedAt && (
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span className="body-text">
                      {formatAssignedDate(project.assignedAt)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant={getDifficultyVariant(project.difficulty)} size="default">
                  <Target className="w-3 h-3 mr-1" />
                  {project.difficulty}
                </Badge>
                <Badge variant="outline" size="default">
                  <Clock className="w-3 h-3 mr-1" />
                  {project.duration}
                </Badge>
                <Badge variant="soft-primary" size="default">
                  Assigned
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="body-text text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {project.description}
          </p>
        </CardHeader>
      </Card>
    </div>
  );
};

// Enhanced Student Report Component
const StudentReportSection = ({
  latestReport,
  isLoading
}: {
  latestReport: ProjectReport | null;
  isLoading: boolean;
}) => {
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'on-track': return 'success';
      case 'off-track': return 'destructive';
      default: return 'secondary';
    }
  };

  const getAIRatingVariant = (rating: number | null) => {
    if (rating === null) return 'secondary';
    if (rating >= 8) return 'success';
    if (rating >= 6) return 'default';
    if (rating >= 4) return 'warning';
    return 'destructive';
  };

  // Mock AI rating based on status for demonstration
  let aiRating: number | null = null;
  if (latestReport?.studentProjectStatus) {
    if (latestReport.studentProjectStatus === 'on-track') {
      aiRating = Math.floor(Math.random() * 5) + 6; // 6-10
    } else {
      aiRating = Math.floor(Math.random() * 5) + 1; // 1-5
    }
  }

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <LoadingSpinner size="sm" variant="primary" />
            <span className="body-text text-neutral-600 dark:text-neutral-400">
              Loading student report...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestReport) {
    return (
      <Card variant="ghost" className="text-center py-8">
        <CardContent>
          <div className="mx-auto mb-4 w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-neutral-400" />
          </div>
          <CardTitle size="default" className="mb-2">
            No student reports yet
          </CardTitle>
          <p className="body-text text-neutral-600 dark:text-neutral-400">
            The student hasn't submitted any progress reports for this project.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Status */}
      <Card variant="outlined">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <CardTitle size="default">Student's Self-Report</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(latestReport.studentProjectStatus)} size="default">
                {latestReport.studentProjectStatus === 'on-track' ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : (
                  <AlertTriangle className="w-3 h-3 mr-1" />
                )}
                {latestReport.studentProjectStatus === 'on-track' ? 'On Track' : 'Off Track'}
              </Badge>
            </div>
            {latestReport.submittedAt && (
              <span className="body-text text-neutral-500 dark:text-neutral-400 text-sm">
                {format(latestReport.submittedAt.toDate(), 'PPP p')}
              </span>
            )}
          </div>
          
          <Card variant="ghost" className="bg-neutral-50 dark:bg-neutral-900">
            <CardContent className="p-4">
              <p className="body-text text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {latestReport.textStatus}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card variant="feature" size="sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle size="default" className="text-blueberry-900 dark:text-blueberry-100">
              AI Analysis & Insights
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {aiRating !== null ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={getAIRatingVariant(aiRating)} size="lg">
                  {aiRating >= 6 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  AI Rating: {aiRating}/10
                </Badge>
                <span className="body-text text-blueberry-800 dark:text-blueberry-200">
                  {aiRating >= 8 ? 'Excellent Progress' : 
                   aiRating >= 6 ? 'Good Progress' : 
                   aiRating >= 4 ? 'Needs Attention' : 'Requires Intervention'}
                </span>
              </div>
            </div>
          ) : (
            <p className="body-text text-blueberry-800 dark:text-blueberry-200">
              AI analysis will be available once the student submits their first report.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Enhanced Task Table Component
const ProjectTasksSection = ({
  tasks,
  onShowHints
}: {
  tasks: SavedProjectTask[];
  onShowHints: (task: SavedProjectTask) => void;
}) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Card variant="ghost" className="text-center py-8">
        <CardContent>
          <div className="mx-auto mb-4 w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-neutral-400" />
          </div>
          <CardTitle size="default" className="mb-2">
            No detailed tasks available
          </CardTitle>
          <p className="body-text text-neutral-600 dark:text-neutral-400">
            This project doesn't have a detailed task breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <CardTitle size="default">Project Timeline</CardTitle>
          </div>
          <Badge variant="soft-primary" size="lg">
            {tasks.length} Tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-neutral-900 z-10">
              <TableRow>
                <TableHead className="w-[100px]">Hints</TableHead>
                <TableHead className="w-[30%]">Task Name</TableHead>
                <TableHead className="w-[80px]">Task ID</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead className="w-[120px]">Start Date</TableHead>
                <TableHead className="w-[120px]">End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow 
                  key={task.taskId || index} 
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onShowHints(task)}
                            className="border-blueberry-200 text-blueberry-600 hover:bg-blueberry-50 dark:border-blueberry-700 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Hints
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Get AI-powered hints for this task</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-medium">
                    {task.taskName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" size="sm">
                      #{task.taskId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span className="text-sm">{task.duration} days</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
                    {task.startDate}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
                    {task.endDate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default function TeacherAssignedProjectDetail({
  project,
  onBack
}: TeacherAssignedProjectDetailProps) {
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<SavedProjectTask | null>(null);
  const [latestReport, setLatestReport] = useState<ProjectReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);

  useEffect(() => {
    // Ensure db is defined before proceeding
    if (!db || !project.projectId || !project.studentUid) {
      setIsLoadingReport(false);
      return;
    }

    setIsLoadingReport(true);
    const reportsRef = collection(db, "projectReports");
    const q = query(
      reportsRef,
      where("projectId", "==", project.projectId),
      where("studentUid", "==", project.studentUid),
      orderBy("submittedAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const reportDoc = querySnapshot.docs[0];
        const reportData = { id: reportDoc.id, ...reportDoc.data() } as ProjectReport;
        
        // Ensure submittedAt is correctly handled as Firestore Timestamp
        if (reportData.submittedAt && !(reportData.submittedAt instanceof Timestamp)) {
          if (reportData.submittedAt && typeof reportData.submittedAt === 'object' && 'seconds' in reportData.submittedAt && 'nanoseconds' in reportData.submittedAt) {
            reportData.submittedAt = new Timestamp((reportData.submittedAt as any).seconds, (reportData.submittedAt as any).nanoseconds);
          } else {
            console.warn("latestReport.submittedAt is not a Firestore Timestamp:", reportData.submittedAt);
          }
        }
        setLatestReport(reportData);
      } else {
        setLatestReport(null);
      }
      setIsLoadingReport(false);
    }, (error) => {
      console.error("Error fetching latest student report: ", error);
      toast({
        title: "Error Loading Report",
        description: "Could not load the student's latest project status.",
        variant: "destructive",
      });
      setIsLoadingReport(false);
      setLatestReport(null);
    });

    return () => unsubscribe();
  }, [project.projectId, project.studentUid, toast]);

  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-6xl mx-auto">
        <ProjectDetailHeader project={project} onBack={onBack} />

        {/* Student Report Section */}
        <div className="space-y-4">
          <div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-2">
              Latest Student Report
            </h3>
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              Current progress status and student feedback
            </p>
          </div>
          <StudentReportSection 
            latestReport={latestReport} 
            isLoading={isLoadingReport} 
          />
        </div>

        <Separator />

        {/* Project Tasks Section */}
        <div className="space-y-4">
          <div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-2">
              Project Timeline & Tasks
            </h3>
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              Detailed breakdown of project milestones and deliverables
            </p>
          </div>
          <ProjectTasksSection 
            tasks={project.tasks || []} 
            onShowHints={setSelectedTask} 
          />
        </div>

        {/* Task Hints Dialog */}
        {selectedTask && (
          <TaskHints
            task={selectedTask.taskName}
            idea={project.description} // Assuming project.description is still relevant for the 'idea' prop
            onClose={() => setSelectedTask(null)}
            initialHints={selectedTask.hints || []}
          />
        )}
      </div>
    </TooltipProvider>
  );
}