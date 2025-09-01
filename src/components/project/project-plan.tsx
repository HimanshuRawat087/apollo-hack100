// components/project/project-plan.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, Plus, MoreHorizontal, Edit, Trash2, User, Upload, Send, Eye, Lightbulb } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectData } from './index';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { doc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Import modals
import TaskSubmissionModal from './task-submission-modal';
import { useAuth } from '@/context/auth-context';
import TaskViewModal from './task-view-modal';

interface ProjectPlanProps {
  project: ProjectData;
  userRole: 'student' | 'teacher';
}

export default function ProjectPlan({ project, userRole }: ProjectPlanProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [localTasks, setLocalTasks] = useState(project.tasks || []);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { user } = useAuth();

  // Helper function to get task status badge
  const getTaskStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Completed', color: 'text-success-600 dark:text-success-400' };
      case 'in-progress':
        return { variant: 'warning' as const, icon: PlayCircle, text: 'In Progress', color: 'text-warning-600 dark:text-warning-400' };
      case 'pending':
      default:
        return { variant: 'secondary' as const, icon: AlertCircle, text: 'Pending', color: 'text-neutral-600 dark:text-neutral-400' };
    }
  };

  // Calculate progress percentage using local tasks
  const totalTasks = localTasks.length || 0;
  const completedTasks = localTasks.filter(task => task.status === 'completed').length || 0;
  const inProgressTasks = localTasks.filter(task => task.status === 'in-progress').length || 0;
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Kanban columns configuration using local tasks
  const kanbanColumns = [
    {
      id: 'pending',
      title: 'To Do',
      subtitle: 'Tasks waiting to be started',
      tasks: localTasks.filter(task => !task.status || task.status === 'pending') || [],
      color: 'bg-neutral-50 dark:bg-neutral-900',
      borderColor: 'border-neutral-200 dark:border-neutral-700',
      headerColor: 'bg-neutral-100 dark:bg-neutral-800',
      icon: AlertCircle,
      iconColor: 'text-neutral-600 dark:text-neutral-400'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      subtitle: 'Tasks currently being worked on',
      tasks: localTasks.filter(task => task.status === 'in-progress') || [],
      color: 'bg-warning-50 dark:bg-warning-950',
      borderColor: 'border-warning-200 dark:border-warning-700',
      headerColor: 'bg-warning-100 dark:bg-warning-900',
      icon: PlayCircle,
      iconColor: 'text-warning-600 dark:text-warning-400'
    },
    {
      id: 'completed',
      title: 'Done',
      subtitle: 'Completed tasks',
      tasks: localTasks.filter(task => task.status === 'completed') || [],
      color: 'bg-success-50 dark:bg-success-950',
      borderColor: 'border-success-200 dark:border-success-700',
      headerColor: 'bg-success-100 dark:bg-success-900',
      icon: CheckCircle,
      iconColor: 'text-success-600 dark:text-success-400'
    }
  ];

  // Update local tasks when project tasks change
  React.useEffect(() => {
    setLocalTasks(project.tasks || []);
  }, [project.tasks]);

  // Drag and drop handlers with actual functionality
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: string) => {
    if (!draggedTask) return;
  
    // Map column IDs to task statuses
    const statusMap = {
      'pending': 'pending' as const,
      'in-progress': 'in-progress' as const,
      'completed': 'completed' as const
    };
  
    const newStatus = statusMap[columnId as keyof typeof statusMap];
    if (!newStatus) return;
  
    // Update the task status locally first for immediate UI feedback
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task.taskId === draggedTask 
          ? { ...task, status: newStatus }
          : task
      )
    );
  
    try {
      console.log("project", project);
      // Update the specific task status in the tasks array
      const updatedTasks = (project.tasks || []).map((task: any) => 
        task.taskId === draggedTask 
          ? { ...task, status: newStatus }
          : task
      );
  
      console.log("new status", newStatus);
      console.log("updated tasks", updatedTasks)

      // Update the assignment document with the new tasks array
      const assignmentDocRef = doc(db, 'assignedProjects', project.assignedProjectId);
      await updateDoc(assignmentDocRef, {
        tasks: updatedTasks,
        // Optionally update overall project status based on task completion
        status: calculateOverallStatus(updatedTasks),
        // Update timestamp
        lastUpdated: serverTimestamp()
      });
  
      console.log(`Task ${draggedTask} moved to ${newStatus} and updated in Firebase`);
      
    } catch (error) {
      console.error("Error updating task status:", error);
      
      // Revert local state if Firebase update fails
      setLocalTasks(prevTasks => 
        prevTasks.map(task => 
          task.taskId === draggedTask 
            ? { ...task, status: task.status } // Revert to original status
            : task
        )
      );
    } finally {
      setDraggedTask(null);
    }
  };
  
  // Helper function to calculate overall project status based on tasks
  const calculateOverallStatus = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 'assigned';
    
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    
    if (completedTasks === tasks.length) {
      return 'completed';
    } else if (inProgressTasks > 0 || completedTasks > 0) {
      return 'in-progress';
    } else {
      return 'assigned';
    }
  };

  // Handle task view modal
  const handleTaskView = (task: any) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  // Handle task submission modal
  const handleTaskSubmission = (task: any) => {
    setSelectedTask(task);
    setIsSubmissionModalOpen(true);
  };

  const handleSubmissionComplete = (taskId: string, newStatus?: string) => {
    // Update task status if provided
    if (newStatus) {
      setLocalTasks(prevTasks => 
        prevTasks.map(task => 
          task.taskId === taskId 
            ? { ...task, status: newStatus as any }
            : task
        )
      );
    }
    
    // Close modal
    setIsSubmissionModalOpen(false);
    setSelectedTask(null);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-8">
      {/* Project Progress Overview */}
      <Card variant="feature" className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target size={24} className="text-white" />
              </div>
              <div>
                <CardTitle className="text-blueberry-800 dark:text-blueberry-200">Project Progress</CardTitle>
                <CardDescription className="body-text text-blueberry-700 dark:text-blueberry-300">
                  Overall completion status and task breakdown
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">{progressPercentage}%</div>
              <div className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blueberry-500 to-blueberry-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Task Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="heading-3 text-neutral-900 dark:text-neutral-100">{totalTasks}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="heading-3 text-neutral-600 dark:text-neutral-400">{pendingTasks}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">To Do</div>
              </div>
              <div className="text-center">
                <div className="heading-3 text-warning-600 dark:text-warning-400">{inProgressTasks}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">In Progress</div>
              </div>
              <div className="text-center">
                <div className="heading-3 text-success-600 dark:text-success-400">{completedTasks}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <Card variant="elevated" className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div>
                <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Task Board</CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                  Click on tasks to view details, drag between columns to update status
                </CardDescription>
              </div>
            </div>
            {userRole === 'teacher' && (
              <Button variant="outline" size="sm" className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950">
                <Plus size={16} className="mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {localTasks && localTasks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {kanbanColumns.map((column) => {
                const ColumnIcon = column.icon;
                
                return (
                  <div 
                    key={column.id} 
                    className={cn(
                      "rounded-lg border-2 transition-all duration-200",
                      column.borderColor,
                      column.color
                    )}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(column.id)}
                  >
                    {/* Column Header */}
                    <div className={cn("p-4 rounded-t-lg", column.headerColor)}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ColumnIcon size={18} className={column.iconColor} />
                          <h3 className="subtitle text-neutral-900 dark:text-neutral-100">{column.title}</h3>
                        </div>
                        <Badge variant="outline" size="sm" className="bg-white dark:bg-neutral-800">
                          {column.tasks.length}
                        </Badge>
                      </div>
                      <p className="body-text text-neutral-600 dark:text-neutral-400 text-xs">
                        {column.subtitle}
                      </p>
                    </div>

                    {/* Tasks Container */}
                    <ScrollArea className="h-[600px]">
                      <div className="p-4 space-y-3">
                        {column.tasks.length > 0 ? (
                          column.tasks.map((task) => {
                            const statusBadge = getTaskStatusBadge(task.status);
                            const StatusIcon = statusBadge.icon;
                            
                            return (
                              <Card 
                                key={task.taskId}
                                variant="default"
                                className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-blueberry-300 dark:hover:border-blueberry-600"
                                draggable={user?.role === "student"}
                                onDragStart={ () => handleDragStart(task.taskId)}
                                onClick={() => handleTaskView(task)}
                              >
                                <CardContent>
                                  <div className="space-y-4">
                                    {/* Task Header */}
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="body-text font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-blueberry-700 dark:group-hover:text-blueberry-300 transition-colors">
                                        {task.taskName}
                                      </h4>
                                      <div className="flex items-center gap-1">
                                        {task.hints && task.hints.length > 0 && (
                                          <div className="w-6 h-6 bg-blueberry-100 dark:bg-blueberry-900 rounded-full flex items-center justify-center">
                                            <Lightbulb size={12} className="text-blueberry-600 dark:text-blueberry-400" />
                                          </div>
                                        )}
                                        {userRole === 'teacher' && (
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <MoreHorizontal size={14} />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Task Details */}
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                        <Calendar size={12} className="flex-shrink-0" />
                                        <span className="truncate">{task.startDate} → {task.endDate}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                                        <Clock size={12} className="flex-shrink-0" />
                                        <span>{task.duration}</span>
                                      </div>
                                    </div>

                                    {/* Task Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                                      <Badge variant={statusBadge.variant} size="sm">
                                        <StatusIcon size={12} className="mr-1" />
                                        {statusBadge.text}
                                      </Badge>
                                      <div className="flex items-center gap-2">
                                        {task.hints && task.hints.length > 0 && (
                                          <Badge variant="soft-primary" size="sm">
                                            <Lightbulb size={10} className="mr-1" />
                                            {task.hints.length}
                                          </Badge>
                                        )}
                                        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                                          #{task.taskId}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Quick Actions */}
                                    {userRole === 'student' && (
                                      <div className="flex gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleTaskView(task);
                                          }}
                                          className="flex-1 text-xs border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-900"
                                        >
                                          <Eye size={12} className="mr-1" />
                                          View Details
                                        </Button>
                                        {
                                          user?.role === "student" && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTaskSubmission(task);
                                              }}
                                              className="flex-1 text-xs border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                                            >
                                              <Upload size={12} className="mr-1" />
                                              Submit Work
                                            </Button>
                                          )
                                        }
                                        {task.status !== 'completed' && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setLocalTasks(prevTasks => 
                                                prevTasks.map(t => 
                                                  t.taskId === task.taskId 
                                                    ? { ...t, status: 'completed' as any }
                                                    : t
                                                )
                                              );
                                            }}
                                            className="px-2 text-xs text-success-700 hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-950"
                                          >
                                            <CheckCircle size={12} />
                                          </Button>
                                        )}
                                      </div>
                                    )}

                                    {/* Assignee Info (if teacher view) */}
                                    {userRole === 'teacher' && (
                                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                                        <User size={12} className="text-neutral-500" />
                                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                          {project.studentName}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })
                        ) : (
                          // Empty State for Column
                          <Card variant="ghost" className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800">
                            <CardContent className="text-center py-12">
                              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <ColumnIcon size={24} className="text-neutral-400 dark:text-neutral-500" />
                              </div>
                              <p className="body-text text-neutral-500 dark:text-neutral-400 text-sm">
                                No {column.title.toLowerCase()} tasks
                              </p>
                              {userRole === 'teacher' && column.id === 'pending' && (
                                <Button variant="ghost" size="sm" className="mt-3 text-blueberry-600 hover:text-blueberry-700">
                                  <Plus size={14} className="mr-1" />
                                  Add Task
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          ) : (
            // No Tasks State
            <Card variant="ghost" className="text-center py-16">
              <CardContent>
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target size={48} className="text-neutral-400 dark:text-neutral-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="heading-3 text-neutral-900 dark:text-neutral-100">No Tasks Available</h3>
                  <p className="body-text text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                    {userRole === 'teacher' 
                      ? "No tasks have been created for this project yet. Add tasks to help guide the student's progress."
                      : "No tasks have been assigned for this project yet. Check back later or contact your instructor."
                    }
                  </p>
                  {userRole === 'teacher' && (
                    <Button variant="outline" className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950">
                      <Plus size={16} className="mr-2" />
                      Create First Task
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Instructions for Students */}
      {userRole === 'student' && localTasks && localTasks.length > 0 && (
        <Card variant="gradient" className="bg-gradient-to-br from-blueberry-50 to-white dark:from-blueberry-950 dark:to-neutral-900 border-blueberry-200 dark:border-blueberry-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-900 rounded-xl flex items-center justify-center">
                <Target size={24} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div className="flex-1">
                <h3 className="subtitle text-blueberry-800 dark:text-blueberry-200 mb-2">How to Use the Task Board</h3>
                <div className="grid md:grid-cols-3 gap-4 body-text text-blueberry-700 dark:text-blueberry-300">
                  <div className="space-y-1">
                    <p className="overline text-blueberry-900 dark:text-blueberry-100">View Details</p>
                    <p>Click on any task card to view detailed information and available hints</p>
                  </div>
                  <div className="space-y-1">
                    <p className="overline text-blueberry-900 dark:text-blueberry-100">Update Progress</p>
                    <p>Drag tasks between columns to update their status as you work on them</p>
                  </div>
                  <div className="space-y-1">
                    <p className="overline text-blueberry-900 dark:text-blueberry-100">Submit Work</p>
                    <p>Use the Submit Work button to upload files and mark tasks as complete</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task View Modal */}
      <TaskViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        task={selectedTask}
        project={project}
        userRole={userRole}
        onSubmit={(task) => {
          handleViewModalClose();
          handleTaskSubmission(task);
        }}
      />

      {/* Task Submission Modal */}
      <TaskSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        task={selectedTask}
        project={project}
        onSubmissionComplete={handleSubmissionComplete}
      />
    </div>
  );
}