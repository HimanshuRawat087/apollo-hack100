"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
import type { ProjectIdea, SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail';
import type { UserProfile } from '@/types';
import { format as formatDate } from 'date-fns';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  Target, 
  Users, 
  CheckCircle2,
  AlertCircle,
  Search,
  User,
  Sparkles,
  TrendingUp,
  BookOpen,
  Award,
  GraduationCap,
  Mail,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

// Apollo Design System Components
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { calculateTaskDates } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignProjectDialogProps {
  project: ProjectIdea | null;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teacherId: string;
  type?: "projectIdea" | "savedProject"
}

// Enhanced Project Summary Component
const ProjectSummary = ({ project }: { project: ProjectIdea }) => {
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': 
        return { 
          variant: 'success' as const, 
          icon: '🟢', 
          bg: 'from-success-100 to-success-200', 
          text: 'text-success-700',
          description: 'Beginner-friendly project'
        };
      case 'medium': 
        return { 
          variant: 'warning' as const, 
          icon: '🟡', 
          bg: 'from-warning-100 to-warning-200', 
          text: 'text-warning-700',
          description: 'Intermediate challenge'
        };
      case 'difficult': 
        return { 
          variant: 'destructive' as const, 
          icon: '🔴', 
          bg: 'from-error-100 to-error-200', 
          text: 'text-error-700',
          description: 'Advanced expertise required'
        };
      default: 
        return { 
          variant: 'secondary' as const, 
          icon: '⚪', 
          bg: 'from-neutral-100 to-neutral-200', 
          text: 'text-neutral-700',
          description: 'Standard level project'
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(project.difficulty);

  return (
    <Card variant="feature" size="default" className="overflow-hidden shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-br from-blueberry-25 to-white dark:from-blueberry-950 dark:to-neutral-900">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle size="xl" className="text-blueberry-900 dark:text-blueberry-100 mb-3 leading-tight heading-2">
              {project.title}
            </CardTitle>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant={difficultyConfig.variant} size="lg" className="font-semibold text-sm px-3 py-1">
                {difficultyConfig.icon} {project.difficulty}
              </Badge>
              <Badge variant="outline" size="lg" className="text-sm px-3 py-1">
                <Clock className="w-4 h-4 mr-2" />
                {project.duration}
              </Badge>
              {project.tasks && (
                <Badge variant="soft-primary" size="lg" className="text-sm px-3 py-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {project.tasks.length} tasks
                </Badge>
              )}
            </div>
            <p className="body-text text-blueberry-800 dark:text-blueberry-200 leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      {/* Project Statistics */}
      {project.tasks && project.tasks.length > 0 && (
        <CardContent className="pt-0">
          <Separator className="mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-950 dark:to-blueberry-900 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <TrendingUp className="w-6 h-6 text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <p className="heading-3 text-blueberry-600 dark:text-blueberry-400">
                {project.tasks.length}
              </p>
              <p className="body-text text-blueberry-600 dark:text-blueberry-400 text-sm font-medium">
                Tasks
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-950 dark:to-success-900 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <BookOpen className="w-6 h-6 text-success-600 dark:text-success-400" />
              </div>
              <p className="heading-3 text-success-600 dark:text-success-400">
                {project.tasks.reduce((total, task) => total + (task.hints?.length || 0), 0)}
              </p>
              <p className="body-text text-success-600 dark:text-success-400 text-sm font-medium">
                AI Hints
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-950 dark:to-warning-900 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <Award className="w-6 h-6 text-warning-600 dark:text-warning-400" />
              </div>
              <p className="heading-3 text-warning-600 dark:text-warning-400">
                {project.tasks.reduce((total, task) => total + task.duration, 0)}
              </p>
              <p className="body-text text-warning-600 dark:text-warning-400 text-sm font-medium">
                Days
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Enhanced Student Selection Component
const StudentSelector = ({
  students,
  selectedStudentUid,
  setSelectedStudentUid,
  isLoading,
  isAssigning
}: {
  students: UserProfile[];
  selectedStudentUid: string | undefined;
  setSelectedStudentUid: (uid: string | undefined) => void;
  isLoading: boolean;
  isAssigning: boolean;
}) => {
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);

  const selectedStudent = students.find(student => student.uid === selectedStudentUid);
  const selectedStudentDisplayValue = selectedStudent?.displayName || selectedStudent?.email || "Select student...";

  if (isLoading) {
    return (
      <Card variant="outline" className="p-6 border-dashed">
        <div className="flex items-center gap-4">
          <LoadingSpinner size="lg" variant="primary" />
          <div>
            <p className="subtitle text-neutral-700 dark:text-neutral-300">
              Loading students...
            </p>
            <p className="body-text text-neutral-500 dark:text-neutral-400 text-sm">
              Fetching available students from the system
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card variant="outline" className="p-6 border-warning-200 bg-gradient-to-r from-warning-50 to-warning-25 dark:border-warning-700 dark:from-warning-950 dark:to-warning-900">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-warning-500 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="heading-3 text-warning-700 dark:text-warning-300 mb-1">
              No students found
            </p>
            <p className="body-text text-warning-600 dark:text-warning-400">
              No students are registered in the system yet
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isComboboxOpen}
            className="w-full justify-between h-14 text-left shadow-sm hover:shadow-md transition-all duration-200"
            disabled={isAssigning}
            size="lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-neutral-200 dark:border-neutral-700">
                {selectedStudent ? (
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                ) : (
                  <User className="w-5 h-5 text-neutral-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "body-text truncate block",
                  selectedStudentUid ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-500 dark:text-neutral-400"
                )}>
                  {selectedStudentDisplayValue}
                </span>
                {!selectedStudent && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    Choose a student to assign this project
                  </span>
                )}
              </div>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" size="lg">
          <Command>
            <CommandInput 
              placeholder="Search students by name or email..." 
              icon={<Search className="w-4 h-4" />}
              className="h-12"
            />
            <CommandList>
              <CommandEmpty>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="subtitle text-neutral-600 dark:text-neutral-400 mb-1">
                    No students found
                  </p>
                  <p className="body-text text-neutral-500 dark:text-neutral-500 text-sm">
                    Try adjusting your search terms
                  </p>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {students.map((student) => (
                  <CommandItem
                    key={student.uid}
                    value={`${student.displayName || ''} ${student.email || ''}`}
                    onSelect={() => {
                      setSelectedStudentUid(student.uid === selectedStudentUid ? undefined : student.uid);
                      setIsComboboxOpen(false);
                    }}
                    className="flex items-center gap-4 p-4 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 text-success-600",
                        selectedStudentUid === student.uid ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-950 dark:to-success-900 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-success-200 dark:border-success-700">
                      <span className="text-sm font-semibold text-success-700 dark:text-success-300">
                        {(student.displayName || student.email || 'S').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-blueberry-500" />
                        <p className="subtitle text-neutral-900 dark:text-neutral-100 truncate">
                          {student.displayName || 'Student'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedStudent && (
        <Card variant="outline" className="p-4 bg-gradient-to-r from-success-50 to-success-25 dark:from-success-950 dark:to-success-900 border-success-200 dark:border-success-800 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg">
                {(selectedStudent.displayName || selectedStudent.email || 'S').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-5 h-5 text-success-600" />
                <p className="heading-3 text-success-900 dark:text-success-100">
                  {selectedStudent.displayName || 'Student'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-success-600" />
                <p className="body-text text-success-700 dark:text-success-300">
                  {selectedStudent.email}
                </p>
              </div>
            </div>
            <Badge variant="success" size="lg" className="font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Selected
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

// Task Timeline Preview Component
const TaskTimelinePreview = ({ tasks, isVisible, onToggle }: { 
  tasks: SavedProjectTask[]; 
  isVisible: boolean;
  onToggle: () => void;
}) => {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
          </div>
          Task Timeline Preview
        </Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="flex items-center gap-2"
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isVisible ? 'Hide' : 'Show'} Timeline
        </Button>
      </div>

      {isVisible && (
        <Card variant="outlined" className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle size="sm">Project Timeline</CardTitle>
              <Badge variant="soft-primary" size="sm">
                {tasks.length} tasks • {tasks.reduce((sum, task) => sum + task.duration, 0)} days total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div 
                    key={task.taskId} 
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-blueberry-25 dark:hover:bg-blueberry-950 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blueberry-600 dark:text-blueberry-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="subtitle text-neutral-900 dark:text-neutral-100 truncate">
                          {task.taskName}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                            {task.startDate} → {task.endDate}
                          </span>
                          {task.hints && task.hints.length > 0 && (
                            <Badge variant="outline" size="sm" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {task.hints.length} hints
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" size="sm">
                      {task.duration} days
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default function AssignProjectDialog({ 
  project, 
  isOpen, 
  onOpenChange, 
  teacherId ,
  type = "projectIdea"
}: AssignProjectDialogProps) {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedStudentUid, setSelectedStudentUid] = useState<string | undefined>(undefined);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showTaskPreview, setShowTaskPreview] = useState(false);
  const { toast } = useToast();

  // State for project start date
  const [projectStartDate, setProjectStartDate] = useState<string>(''); 
  // State for tasks with recalculated dates
  const [processedTasks, setProcessedTasks] = useState<SavedProjectTask[]>([]);

  useEffect(() => {
    if (isOpen && project) {
      setProjectStartDate(project.projectStartDate ? project.projectStartDate : formatDate(new Date(), 'yyyy-MM-dd'));
    }
  }, [isOpen, project]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!isOpen || !firebaseDbService) return;
      setIsLoadingStudents(true);
      try {
        const usersRef = collection(firebaseDbService, 'users');
        const q = query(usersRef, where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        const studentList: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          studentList.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error Fetching Students",
          description: "Could not load the list of students. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen, toast]);

  // Effect to recalculate task dates when project or projectStartDate changes
  useEffect(() => {
    if (project && project.tasks && projectStartDate) {
      const processed = calculateTaskDates(project.tasks, projectStartDate);
      setProcessedTasks(processed);
    } else if (project && project.tasks) {
      setProcessedTasks(project.tasks.map(task => ({
        ...task,
        duration: typeof task.duration === 'number' && task.duration > 0 ? task.duration : 1,
      })));
    } else {
      setProcessedTasks([]);
    }
  }, [project, projectStartDate]);

  const handleAssignProject = async () => {
    if (!project || !selectedStudentUid || !firebaseDbService) {
      toast({
        title: "Assignment Error",
        description: "Project or student not selected, or database service unavailable.",
        variant: "destructive",
      });
      return;
    }

    const selectedStudent = students.find(s => s.uid === selectedStudentUid);
    if (!selectedStudent) {
      toast({ 
        title: "Student not found", 
        description: "Selected student details could not be found.", 
        variant: "destructive" 
      });
      return;
    }

    setIsAssigning(true);
    try {
      let projectId = null;

      if (type === "savedProject") {
          projectId = project.id
      } else {
        // Step 1: Create a new project document in 'projects' collection with an auto-generated ID
        const projectDataForDatabase = {
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          duration: project.duration,
          projectStartDate: projectStartDate,
          tasks: processedTasks,
          teacherId: teacherId,
          createdAt: serverTimestamp(),
        };
        
        const newProjectRef = await addDoc(collection(firebaseDbService, 'projects'), projectDataForDatabase);
        projectId = newProjectRef.id;
      }

      // Step 2: Create assignment in 'assignedProjects' collection
      const studentTasks = processedTasks.map(task => ({
        // Copy from template
        taskId: task.taskId,
        taskName: task.taskName,
        startDate: task.startDate,
        endDate: task.endDate, 
        duration: task.duration,
        hints: task.hints || [],
        
        // Initialize student progress tracking
        status: "pending",
        startedAt: null,
        completedAt: null,
        studentNotes: "",
        blockers: []
      }));

      const assignmentData = {
        projectId: projectId,
        studentUid: selectedStudentUid,
        studentName: selectedStudent.displayName || selectedStudent.email || 'N/A',
        teacherUid: teacherId,
        assignedAt: serverTimestamp(),
        status: 'assigned',
        tasks: studentTasks
      };

      await addDoc(collection(firebaseDbService, 'assignedProjects'), assignmentData);
      
      toast({
        title: "🎉 Project Assigned Successfully!",
        description: `${project.title} has been assigned to ${selectedStudent.displayName || selectedStudent.email}.`,
        variant: "success",
      });
      
      onOpenChange(false);
      setSelectedStudentUid(undefined);
      setShowTaskPreview(false);
    } catch (error) {
      console.error("Error assigning project:", error);
      toast({
        title: "Assignment Failed",
        description: "Could not assign the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!project) return null;

  return (
    <TooltipProvider>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          onOpenChange(open);
          if (!open) {
            setSelectedStudentUid(undefined);
            setShowTaskPreview(false);
          }
        }}
      >
        <DialogContent size="xl" className="max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-2xl flex items-center justify-center shadow-xl">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="heading-2 text-neutral-900 dark:text-neutral-100">
                  Assign Project to Student
                </DialogTitle>
                <DialogDescription className="body-text text-neutral-600 dark:text-neutral-400 text-lg">
                  Configure project details and select a student to begin their learning journey
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" icon={<Target className="w-4 h-4" />}>
                  Project Overview
                </TabsTrigger>
                <TabsTrigger value="student" icon={<Users className="w-4 h-4" />}>
                  Select Student
                </TabsTrigger>
                <TabsTrigger value="timeline" icon={<Calendar className="w-4 h-4" />}>
                  Timeline Setup
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <ProjectSummary project={project} />
            </TabsContent>

            <TabsContent value="student" className="space-y-6">
              <div className="space-y-4">
                <Label className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
                  </div>
                  Select Student
                </Label>
                <StudentSelector
                  students={students}
                  selectedStudentUid={selectedStudentUid}
                  setSelectedStudentUid={setSelectedStudentUid}
                  isLoading={isLoadingStudents}
                  isAssigning={isAssigning}
                />
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              {/* Project Start Date */}
              <div className="space-y-4">
                <Label htmlFor="project-start-date" className="flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
                  </div>
                  Project Start Date
                </Label>
                <Input
                  type="date"
                  id="project-start-date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  disabled={isAssigning}
                  size="lg"
                  description="Task dates will be automatically calculated based on this start date"
                  className="text-lg"
                />
              </div>

              <Separator />

              {/* Task Preview */}
              <TaskTimelinePreview 
                tasks={processedTasks} 
                isVisible={showTaskPreview}
                onToggle={() => setShowTaskPreview(!showTaskPreview)}
              />
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Assignment Summary & Action */}
          <div className="space-y-6">
            <Card variant="feature" className="bg-gradient-to-r from-success-25 via-blueberry-25 to-success-25 dark:from-success-950 dark:via-blueberry-950 dark:to-success-950 border-success-200 dark:border-success-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-3 text-success-900 dark:text-success-100 mb-1">
                      Assignment Summary
                    </h3>
                    <p className="body-text text-success-700 dark:text-success-300">
                      Review the details before finalizing the assignment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card variant="outlined" size="sm" className="bg-white/50 dark:bg-neutral-900/50">
                    <CardContent className="p-4 text-center">
                      <Target className="w-6 h-6 text-blueberry-600 dark:text-blueberry-400 mx-auto mb-2" />
                      <p className="subtitle text-blueberry-900 dark:text-blueberry-100 mb-1">
                        {project.title}
                      </p>
                      <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm">
                        Project to assign
                      </p>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" size="sm" className="bg-white/50 dark:bg-neutral-900/50">
                    <CardContent className="p-4 text-center">
                      {selectedStudentUid ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-success-600 dark:text-success-400 mx-auto mb-2" />
                          <p className="subtitle text-success-900 dark:text-success-100 mb-1">
                            {students.find(s => s.uid === selectedStudentUid)?.displayName || 'Student'}
                          </p>
                          <p className="body-text text-success-700 dark:text-success-300 text-sm">
                            Selected student
                          </p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6 text-warning-600 dark:text-warning-400 mx-auto mb-2" />
                          <p className="subtitle text-warning-900 dark:text-warning-100 mb-1">
                            No student selected
                          </p>
                          <p className="body-text text-warning-700 dark:text-warning-300 text-sm">
                            Please select a student
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card variant="outlined" size="sm" className="bg-white/50 dark:bg-neutral-900/50">
                    <CardContent className="p-4 text-center">
                      <Calendar className="w-6 h-6 text-blueberry-600 dark:text-blueberry-400 mx-auto mb-2" />
                      <p className="subtitle text-blueberry-900 dark:text-blueberry-100 mb-1">
                        {projectStartDate ? formatDate(new Date(projectStartDate), 'MMM dd, yyyy') : 'Not set'}
                      </p>
                      <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm">
                        Start date
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {processedTasks.length > 0 && (
                  <div className="mt-4 p-4 bg-blueberry-50 dark:bg-blueberry-950 rounded-lg border border-blueberry-200 dark:border-blueberry-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400" />
                        <div>
                          <p className="subtitle text-blueberry-900 dark:text-blueberry-100">
                            {processedTasks.length} tasks ready for assignment
                          </p>
                          <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm">
                            Total duration: {processedTasks.reduce((sum, task) => sum + task.duration, 0)} days • 
                            {processedTasks.reduce((total, task) => total + (task.hints?.length || 0), 0)} AI hints included
                          </p>
                        </div>
                      </div>
                      <Badge variant="soft-primary" size="lg">
                        Ready to assign
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onOpenChange(false)}
                disabled={isAssigning}
                className="flex-1"
              >
                Cancel Assignment
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={handleAssignProject}
                      disabled={!selectedStudentUid || isAssigning || isLoadingStudents || students.length === 0}
                      loading={isAssigning}
                      loadingText="Assigning project..."
                      className="flex-1 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 shadow-button hover:shadow-button-hover"
                    >
                      <UserCheck className="w-5 h-5 mr-2" />
                      Assign Project to Student
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create the project assignment and notify the selected student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Assignment Status Messages */}
            {isAssigning && (
              <Card variant="outlined" className="p-4 bg-blueberry-25 dark:bg-blueberry-950 border-blueberry-200 dark:border-blueberry-800">
                <div className="flex items-center gap-3">
                  <LoadingSpinner size="sm" variant="primary" />
                  <div>
                    <p className="subtitle text-blueberry-900 dark:text-blueberry-100">
                      Creating assignment...
                    </p>
                    <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm">
                      Setting up the project timeline and preparing student access
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {!selectedStudentUid && students.length > 0 && (
              <Card variant="outlined" className="p-4 bg-warning-25 dark:bg-warning-950 border-warning-200 dark:border-warning-800">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  <div>
                    <p className="subtitle text-warning-900 dark:text-warning-100">
                      Student selection required
                    </p>
                    <p className="body-text text-warning-700 dark:text-warning-300 text-sm">
                      Please select a student from the "Select Student" tab to continue
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}