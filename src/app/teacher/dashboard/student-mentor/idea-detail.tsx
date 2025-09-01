"use client";

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { 
  Lightbulb, 
  UserPlus, 
  ArrowLeft, 
  Trash2, 
  Plus,
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Save,
  Edit3,
  Settings,
  BookOpen,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

// Apollo Design System Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

import { addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import AssignProjectDialog from '@/components/teacher/assign-project-dialog';
import { useAuth } from '@/context/auth-context';
import TaskHints from './task-hints';

const FIREBASE_FUNCTION_URL_HINTS = 'https://us-central1-role-auth-7bc43.cloudfunctions.net/suggestTaskHintsFn';

// Task interfaces
interface DisplayTask {
  TaskID: number;
  TaskName: string;
  StartDate?: string;
  EndDate?: string;
  Duration: number;
  PercentageComplete: number;
  Dependencies: string;
  Milestone: boolean;
  hints?: string[];
}

export interface SavedProjectTask {
  taskId: number;
  taskName: string;
  startDate: string;
  endDate: string;
  duration: number;
  hints?: string[];
}

export interface ProjectIdea {
  id?: string;
  projectStartDate?: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  icon?: React.ComponentType<{ size: number; className: string }>;
  tasks?: SavedProjectTask[];
}

// Enhanced Project Header Component
const ProjectHeader = ({ 
  idea, 
  editableDescription, 
  setEditableDescription,
  calculatedOverallDuration,
  onBack,
  isEditing,
  setIsEditing
}: {
  idea: ProjectIdea;
  editableDescription: string;
  setEditableDescription: (desc: string) => void;
  calculatedOverallDuration: string;
  onBack: () => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}) => {
  const IconComponent = idea.icon || Lightbulb;
  
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': 
        return { 
          variant: 'success' as const, 
          icon: '🟢', 
          bg: 'from-success-100 to-success-200',
          text: 'text-success-700',
          description: 'Perfect for beginners'
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
          description: 'Standard level'
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(idea.difficulty);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        onClick={onBack} 
        variant="outline" 
        size="lg" 
        className="shadow-sm hover:shadow-md transition-all duration-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> 
        Back to Ideas
      </Button>

      {/* Project Overview Card */}
      <Card variant="feature" className="overflow-hidden shadow-2xl">
        <CardHeader className="pb-8 bg-gradient-to-br from-blueberry-25 to-white dark:from-blueberry-950 dark:to-neutral-900">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <IconComponent size={40} className="text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="heading-1 text-neutral-900 dark:text-neutral-100 mb-3 leading-tight">
                    {idea.title}
                  </h1>
                  <div className="flex flex-wrap gap-4">
                    <Badge 
                      variant={difficultyConfig.variant} 
                      size="xl" 
                      className="font-semibold text-base px-4 py-2"
                    >
                      {difficultyConfig.icon} {idea.difficulty}
                    </Badge>
                    <Badge variant="outline" size="xl" className="text-base px-4 py-2">
                      <Clock className="w-5 h-5 mr-2" />
                      {calculatedOverallDuration}
                    </Badge>
                  </div>
                  <p className="body-text text-neutral-600 dark:text-neutral-400 mt-2">
                    {difficultyConfig.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="lg"
                onClick={() => setIsEditing(!isEditing)}
                className="self-start shadow-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Project"}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Project Description */}
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
              </div>
              Project Description
            </Label>
            {isEditing ? (
              <Textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                placeholder="Enter detailed project description..."
                className="min-h-40 text-base leading-relaxed"
                autoResize
                size="lg"
              />
            ) : (
              <Card variant="outlined" className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-750">
                <CardContent className="p-6">
                  <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg">
                    {editableDescription}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

// Enhanced Project Timeline Component
const ProjectTimeline = ({
  projectStartDateState,
  setProjectStartDateState,
  projectPlan,
  handleTaskNameChange,
  handleTaskDurationChange,
  handleAddTask,
  handleRemoveTask,
  loadingPlan,
  setSelectedTask,
  handleRegenerateTaskHints,
  fetchProjectPlan
}: {
  projectStartDateState: Date;
  setProjectStartDateState: (date: Date) => void;
  projectPlan: DisplayTask[];
  handleTaskNameChange: (taskId: number, newName: string) => void;
  handleTaskDurationChange: (taskId: number, newDuration: string) => void;
  handleAddTask: () => void;
  handleRemoveTask: (taskId: number) => void;
  loadingPlan: boolean;
  setSelectedTask: (task: DisplayTask) => void;
  handleRegenerateTaskHints: (taskId: number, taskName: string) => void;
  fetchProjectPlan: () => void;
}) => {
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const totalHints = projectPlan.reduce((total, task) => 
    total + (task.hints && task.hints[0] !== "Generating hints..." && task.hints[0] !== "Failed to generate hints" ? task.hints.length : 0), 0
  );

  return (
    <Card variant="elevated" className="shadow-2xl">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle size="xl">Project Timeline & Tasks</CardTitle>
              <p className="body-text text-neutral-600 dark:text-neutral-400 text-lg">
                Detailed breakdown with AI-generated hints for each task
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={fetchProjectPlan}
              disabled={loadingPlan}
              size="lg"
              className="shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Plan
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Configuration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label htmlFor="projectStartDate" className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blueberry-100 dark:bg-blueberry-950 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blueberry-600 dark:text-blueberry-400" />
              </div>
              Project Start Date
            </Label>
            <Input
              type="date"
              id="projectStartDate"
              value={formatDateForInput(projectStartDateState)}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                if (!isNaN(newDate.getTime())) {
                  setProjectStartDateState(newDate);
                }
              }}
              size="lg"
              description="All task dates will be automatically recalculated based on this date"
              className="text-lg"
            />
          </div>
          
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-success-100 dark:bg-success-950 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success-600 dark:text-success-400" />
              </div>
              Project Statistics
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <Card variant="outlined" size="sm" className="text-center bg-gradient-to-br from-blueberry-25 to-blueberry-50 dark:from-blueberry-950 dark:to-blueberry-900 border-blueberry-200 dark:border-blueberry-700">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-blueberry-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <p className="heading-2 text-blueberry-600 dark:text-blueberry-400">
                    {projectPlan.length}
                  </p>
                  <p className="body-text text-blueberry-600 dark:text-blueberry-400 text-sm font-medium">
                    Total Tasks
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" size="sm" className="text-center bg-gradient-to-br from-success-25 to-success-50 dark:from-success-950 dark:to-success-900 border-success-200 dark:border-success-700">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <p className="heading-2 text-success-600 dark:text-success-400">
                    {totalHints}
                  </p>
                  <p className="body-text text-success-600 dark:text-success-400 text-sm font-medium">
                    AI Hints
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="outlined" size="sm" className="text-center bg-gradient-to-br from-warning-25 to-warning-50 dark:from-warning-950 dark:to-warning-900 border-warning-200 dark:border-warning-700">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-warning-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <p className="heading-2 text-warning-600 dark:text-warning-400">
                    {projectPlan.reduce((sum, task) => sum + task.Duration, 0)}
                  </p>
                  <p className="body-text text-warning-600 dark:text-warning-400 text-sm font-medium">
                    Total Days
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Separator />

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="heading-2 text-neutral-900 dark:text-neutral-100 mb-2">
                Task Breakdown
              </h3>
              <p className="body-text text-neutral-600 dark:text-neutral-400">
                Detailed timeline with AI-powered guidance for each task
              </p>
            </div>
            <Button
              variant="default"
              size="lg"
              onClick={handleAddTask}
              className="flex items-center gap-2 shadow-button"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          {loadingPlan ? (
            <Card variant="outlined" className="p-12 text-center">
              <LoadingSpinner 
                size="2xl" 
                variant="primary"
                showLabel 
                label="Generating Project Plan..."
                description="Our AI is creating a detailed timeline with task hints and dependencies"
              />
              <div className="mt-8 flex items-center justify-center gap-6 text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blueberry-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Analyzing project scope</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse animation-delay-200"></div>
                  <span className="text-sm">Creating task breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full animate-pulse animation-delay-400"></div>
                  <span className="text-sm">Generating hints</span>
                </div>
              </div>
            </Card>
          ) : projectPlan.length > 0 ? (
            <Card variant="outlined" className="overflow-hidden">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white dark:bg-neutral-900">
                    <TableRow className="border-b-2 border-neutral-200 dark:border-neutral-700">
                      <TableHead className="w-[140px] font-semibold">Task Hints</TableHead>
                      <TableHead className="w-[300px] font-semibold">Task Name</TableHead>
                      <TableHead className="w-[120px] font-semibold">Duration</TableHead>
                      <TableHead className="w-[140px] font-semibold">Start Date</TableHead>
                      <TableHead className="w-[140px] font-semibold">End Date</TableHead>
                      <TableHead className="w-[100px] text-center font-semibold">Progress</TableHead>
                      <TableHead className="w-[80px] text-center font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectPlan.map((task, index) => (
                      <TableRow 
                        key={task.TaskID} 
                        className={cn(
                          "hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200",
                          task.Milestone && "bg-blueberry-25 dark:bg-blueberry-950 border-l-4 border-blueberry-500",
                          index % 2 === 0 && "bg-neutral-25 dark:bg-neutral-900"
                        )}
                      >
                        <TableCell className="py-4">
                          {task.hints && task.hints[0] === "Generating hints..." ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" />
                              <span className="text-xs text-neutral-500">Generating...</span>
                            </div>
                          ) : task.hints && task.hints.length > 0 && task.hints[0] !== "Failed to generate hints" ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedTask(task)}
                                    className="text-xs bg-gradient-to-r from-blueberry-50 to-blueberry-100 hover:from-blueberry-100 hover:to-blueberry-200 border-blueberry-200"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {task.hints.length} hints
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View AI-generated hints for this task</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRegenerateTaskHints(task.TaskID, task.TaskName)}
                              className="text-xs text-neutral-500 hover:text-blueberry-600"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Generate
                            </Button>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Input
                            value={task.TaskName}
                            onChange={(e) => handleTaskNameChange(task.TaskID, e.target.value)}
                            className="border-none shadow-none focus:border-blueberry-500 p-2 font-medium"
                            size="sm"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={task.Duration}
                              onChange={(e) => handleTaskDurationChange(task.TaskID, e.target.value)}
                              className="w-20 border-none shadow-none focus:border-blueberry-500 p-2 text-center font-medium"
                              min="1"
                              size="sm"
                            />
                            <span className="text-sm text-neutral-500 font-medium">days</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-mono text-sm font-medium">
                          {task.StartDate}
                        </TableCell>
                        
                        <TableCell className="font-mono text-sm font-medium">
                          {task.EndDate}
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <Badge 
                            variant={task.PercentageComplete > 0 ? "success" : "secondary"} 
                            size="sm"
                            className="font-semibold"
                          >
                            {task.PercentageComplete}%
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleRemoveTask(task.TaskID)}
                                  className="text-error-500 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove this task</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          ) : (
            <Card variant="outlined" className="p-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-3xl flex items-center justify-center mx-auto">
                  <Target className="w-12 h-12 text-neutral-400" />
                </div>
                <div>
                  <h3 className="heading-3 text-neutral-600 dark:text-neutral-400 mb-3">
                    No project plan generated yet
                  </h3>
                  <p className="body-text text-neutral-500 dark:text-neutral-500 max-w-md mx-auto">
                    Click "Regenerate Plan" above to create a detailed timeline with tasks and AI-generated hints
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={fetchProjectPlan}
                  className="shadow-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Project Plan
                </Button>
              </div>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main IdeaDetail Component
export default memo(function IdeaDetail({
  idea,
  goBack,
  handleAssign
}: {
  idea: ProjectIdea;
  goBack: () => void;
  handleAssign: () => void;
}) {
  const { user } = useAuth();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editableDescription, setEditableDescription] = useState(idea.description);
  const [calculatedOverallDuration, setCalculatedOverallDuration] = useState<string>(idea.duration);
  const [projectStartDateState, setProjectStartDateState] = useState<Date>(
    idea.projectStartDate ? new Date(idea.projectStartDate) : new Date()
  );
  const [isEditing, setIsEditing] = useState(false);

  const [projectPlan, setProjectPlan] = useState<DisplayTask[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DisplayTask | null>(null);

  const FIREBASE_FUNCTION_URL = 'https://us-central1-role-auth-7bc43.cloudfunctions.net/generateProjectPlanFn';

  // Helper function for retrying fetches
  const retryFetch = async (url: string, options: RequestInit, retries: number = 5, delay: number = 1000, timeout: number = 20000) => {
    for (let i = 0; i < retries; i++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
          console.warn(`Fetch attempt ${i + 1} for ${url} timed out after ${timeout / 1000} seconds.`);
        } else {
          console.error(`Fetch attempt ${i + 1} failed for ${url}:`, error);
        }
        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
        }
      }
    }
    throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
  };

  const fetchProjectPlan = useCallback(async () => {
    setLoadingPlan(true);
    setProjectPlan([]);
    
    try {
      let parsedData: DisplayTask[];

      const requestBody = { projectIdea: editableDescription };
      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      const rawResponseText = data.response;

      try {
        parsedData = JSON.parse(rawResponseText.projectPlan);
      } catch (jsonError: any) {
        console.error("Failed to parse project plan JSON:", jsonError);
        setProjectPlan([]);
        setLoadingPlan(false);
        return;
      }

      let currentDate = new Date(projectStartDateState);

      const tasksForDisplayPromises = parsedData.map(async (item) => {
        let durationInDays = 1;

        if (typeof (item.Duration as any) === 'string') {
          const durationStr = (item.Duration as any).toLowerCase();
          const weekMatch = durationStr.match(/(\d+)\s*week(s)?/);
          const dayMatch = durationStr.match(/(\d+)\s*day(s)?/);

          if (weekMatch && weekMatch[1]) {
            durationInDays = parseInt(weekMatch[1], 10) * 7;
          } else if (dayMatch && dayMatch[1]) {
            durationInDays = parseInt(dayMatch[1], 10);
          } else {
            const genericMatch = durationStr.match(/(\d+)/);
            if (genericMatch && genericMatch[1]) {
              durationInDays = parseInt(genericMatch[1], 10);
            }
          }
        } else if (typeof item.Duration === 'number') {
          durationInDays = item.Duration;
        }

        const validDuration = Math.max(1, Math.floor(isNaN(durationInDays) ? 1 : durationInDays));
        const itemStartDate = new Date(currentDate);
        const itemEndDate = addDays(itemStartDate, validDuration - 1);
        currentDate = addDays(itemEndDate, 1);

        return {
          ...item,
          StartDate: itemStartDate.toISOString().slice(0, 10),
          EndDate: itemEndDate.toISOString().slice(0, 10),
          Duration: validDuration,
          hints: ["Generating hints..."],
        };
      });

      const initialTasksForDisplay = await Promise.all(tasksForDisplayPromises);
      setProjectPlan(initialTasksForDisplay);
      setLoadingPlan(false);

      // Generate hints in batches
      const BATCH_SIZE = 5;
      const processTasksInBatches = async (tasks: DisplayTask[]) => {
        for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
          const batch = tasks.slice(i, i + BATCH_SIZE);
          await Promise.all(batch.map(async (taskToUpdate) => {
            let hints: string[] = [];
            try {
              const hintRequestBody = {
                taskDescription: taskToUpdate.TaskName,
                projectGoal: editableDescription,
                relevantMilestones: "",
              };

              const hintData = await retryFetch(
                FIREBASE_FUNCTION_URL_HINTS,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(hintRequestBody),
                },
                5, 2000, 20000
              );
              hints = hintData?.response?.hints || [];
            } catch (hintError) {
              console.error("Error generating hints for task:", taskToUpdate.TaskName, hintError);
              hints = ["Failed to load hints."];
            }

            setProjectPlan(prevPlan =>
              prevPlan.map(pTask =>
                pTask.TaskID === taskToUpdate.TaskID ? { ...pTask, hints: hints } : pTask
              )
            );
          }));
        }
      };

      processTasksInBatches(initialTasksForDisplay);

    } catch (error: any) {
      console.error("Error during project plan generation:", error);
      setProjectPlan([]);
      setLoadingPlan(false);
    }
  }, [editableDescription, projectStartDateState]);

  // Task management functions
  const handleTaskNameChange = (taskId: number, newName: string) => {
    setProjectPlan(prevPlan =>
      prevPlan.map(task =>
        task.TaskID === taskId ? { ...task, TaskName: newName } : task
      )
    );
  };

  const recalculateTaskDates = (tasks: DisplayTask[], projectStartDate: Date): DisplayTask[] => {
    let currentDate = new Date(projectStartDate);
    return tasks.map(task => {
      const duration = Math.max(1, Number(task.Duration));
      const startDate = new Date(currentDate);
      const endDate = addDays(startDate, duration - 1);
      currentDate = addDays(endDate, 1);

      return {
        ...task,
        StartDate: startDate.toISOString().slice(0, 10),
        EndDate: endDate.toISOString().slice(0, 10),
        Duration: duration,
      };
    });
  };

  const handleTaskDurationChange = (taskId: number, newDurationStr: string) => {
    const newDuration = parseInt(newDurationStr, 10);
    if (isNaN(newDuration) || newDuration < 1) return;

    const updatedOncePlan = projectPlan.map(task =>
      task.TaskID === taskId ? { ...task, Duration: newDuration } : task
    );

    const recalculatedPlan = recalculateTaskDates(updatedOncePlan, new Date(projectStartDateState));
    setProjectPlan(recalculatedPlan);
  };

  const handleAddTask = () => {
    const newTask: DisplayTask = {
      TaskID: Math.max(0, ...projectPlan.map(t => t.TaskID)) + 1,
      TaskName: "New Task - Edit Me",
      Duration: 1,
      StartDate: "", 
      EndDate: "",
      PercentageComplete: 0, 
      Dependencies: "", 
      Milestone: false,
      hints: [],
    };
    const updatedPlan = [...projectPlan, newTask];
    const recalculatedPlan = recalculateTaskDates(updatedPlan, new Date(projectStartDateState));
    setProjectPlan(recalculatedPlan);
  };

  const handleRemoveTask = (taskIdToRemove: number) => {
    const updatedPlan = projectPlan.filter(task => task.TaskID !== taskIdToRemove);
    const recalculatedPlan = recalculateTaskDates(updatedPlan, new Date(projectStartDateState));
    setProjectPlan(recalculatedPlan);
  };

  const handleSaveTaskHints = useCallback((taskId: number, newHints: string[]) => {
    setProjectPlan(prevPlan =>
      prevPlan.map(task =>
        task.TaskID === taskId 
          ? { ...task, hints: newHints }
          : task
      )
    );
  }, []);

  const handleRegenerateTaskHints = useCallback(async (taskId: number, taskName: string) => {
    setProjectPlan(prevPlan =>
      prevPlan.map(task =>
        task.TaskID === taskId 
          ? { ...task, hints: ["Generating hints..."] }
          : task
      )
    );

    try {
      const hintRequestBody = {
        taskDescription: taskName,
        projectGoal: editableDescription,
        relevantMilestones: "",
      };

      const hintData = await retryFetch(
        FIREBASE_FUNCTION_URL_HINTS,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hintRequestBody),
        },
        5, 2000, 20000
      );

      const newHints = hintData?.response?.hints || ["Failed to generate hints"];
      
      setProjectPlan(prevPlan =>
        prevPlan.map(task =>
          task.TaskID === taskId 
            ? { ...task, hints: newHints }
            : task
        )
      );
    } catch (error) {
      console.error("Error regenerating hints:", error);
      setProjectPlan(prevPlan =>
        prevPlan.map(task =>
          task.TaskID === taskId 
            ? { ...task, hints: ["Failed to generate hints"] }
            : task
        )
      );
    }
  }, [editableDescription]);

  // Effects
  useEffect(() => {
    if (idea) {
      fetchProjectPlan();
      setEditableDescription(idea.description);
    }
  }, [idea.description, idea.title]);

  useEffect(() => {
    if (projectPlan.length > 0) {
      const recalculatedPlan = recalculateTaskDates([...projectPlan], new Date(projectStartDateState));
      setProjectPlan(recalculatedPlan);
    }
  }, [projectStartDateState]);

  useEffect(() => {
    if (projectPlan && projectPlan.length > 0) {
      const totalDays = projectPlan.reduce((sum, task) => sum + Math.max(1, task.Duration), 0);
      setCalculatedOverallDuration(`${totalDays} day${totalDays !== 1 ? 's' : ''}`);
    } else {
      setCalculatedOverallDuration("0 days");
    }
  }, [projectPlan]);

  // Prepare data for assignment
  const tasksForFirestore: SavedProjectTask[] = projectPlan.map(task => ({
    taskId: task.TaskID,
    taskName: task.TaskName,
    startDate: task.StartDate || '',
    endDate: task.EndDate || '',
    duration: Math.max(1, Math.floor(task.Duration)),
    hints: task.hints || [],
  }));

  const areHintsStillGenerating = projectPlan.some(task => 
    task.hints && task.hints.length > 0 && task.hints[0] === "Generating hints..."
  );

  const projectIdeaWithTasks: ProjectIdea = {
    ...idea,
    description: editableDescription,
    duration: calculatedOverallDuration,
    projectStartDate: projectStartDateState.toISOString().slice(0,10), 
    tasks: tasksForFirestore,
  };

  return (
    <div className="flex-grow flex flex-col space-y-8 mx-auto w-full max-w-7xl p-6">
      <ProjectHeader
        idea={idea}
        editableDescription={editableDescription}
        setEditableDescription={setEditableDescription}
        calculatedOverallDuration={calculatedOverallDuration}
        onBack={goBack}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <ProjectTimeline
        projectStartDateState={projectStartDateState}
        setProjectStartDateState={setProjectStartDateState}
        projectPlan={projectPlan}
        handleTaskNameChange={handleTaskNameChange}
        handleTaskDurationChange={handleTaskDurationChange}
        handleAddTask={handleAddTask}
        handleRemoveTask={handleRemoveTask}
        loadingPlan={loadingPlan}
        setSelectedTask={setSelectedTask}
        handleRegenerateTaskHints={handleRegenerateTaskHints}
        fetchProjectPlan={fetchProjectPlan}
      />

      {/* Assignment Section */}
      <Card variant="feature" className="border-success-200 bg-gradient-to-br from-success-25 via-white to-blueberry-25 dark:from-success-950 dark:via-neutral-900 dark:to-blueberry-950 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="heading-2 text-success-900 dark:text-success-100 mb-2">
                  Ready to Assign Project
                </h3>
                <p className="body-text text-success-700 dark:text-success-300 text-lg">
                  Project plan is complete with {projectPlan.length} tasks and AI-generated hints
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="success" size="lg" className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {projectPlan.length} Tasks Created
                  </Badge>
                  <Badge variant="soft-primary" size="lg" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {projectPlan.reduce((total, task) => 
                      total + (task.hints && task.hints[0] !== "Generating hints..." && task.hints[0] !== "Failed to generate hints" ? task.hints.length : 0), 0
                    )} Hints Ready
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              size="xl"
              variant="default"
              onClick={() => setIsAssignDialogOpen(true)}
              disabled={loadingPlan || projectPlan.length === 0 || areHintsStillGenerating}
              className="bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <UserPlus className="mr-3 h-6 w-6" />
              Assign to Student
            </Button>
          </div>
          
          {areHintsStillGenerating && (
            <div className="mt-6 p-4 bg-warning-100 dark:bg-warning-950 rounded-xl border border-warning-200 dark:border-warning-800">
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" />
                <div>
                  <p className="subtitle text-warning-800 dark:text-warning-200">
                    Still generating hints...
                  </p>
                  <p className="body-text text-warning-700 dark:text-warning-300 text-sm">
                    Assignment will be available once all task hints are generated
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Dialog */}
      {projectIdeaWithTasks && user && (
        <AssignProjectDialog
          project={projectIdeaWithTasks}
          isOpen={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          teacherId={user.uid}
        />
      )}

      {/* Task Hints Dialog */}
      {selectedTask && (
        <TaskHints
          task={selectedTask.TaskName}
          idea={editableDescription}
          initialHints={selectedTask.hints}
          onClose={() => setSelectedTask(null)}
          onSaveHints={(hints) => {
            handleSaveTaskHints(selectedTask.TaskID, hints);
            setSelectedTask(null);
          }}
          onRegenerateHints={() => {
            handleRegenerateTaskHints(selectedTask.TaskID, selectedTask.TaskName);
          }}
          isGenerating={selectedTask.hints?.[0] === "Generating hints..."}
        />
      )}
    </div>
  );
});
