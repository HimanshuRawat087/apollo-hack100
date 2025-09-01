// components/project/task-view-modal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  Target, 
  CheckCircle, 
  BookOpen,
  Copy,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  Upload,
  X,
  Eye,
  AlertCircle,
  PlayCircle,
  User
} from "lucide-react";

interface TaskViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  project: any;
  userRole: 'student' | 'teacher';
  onSubmit?: (task: any) => void;
}

export default function TaskViewModal({
  isOpen,
  onClose,
  task,
  project,
  userRole,
  onSubmit
}: TaskViewModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!task) return null;

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

  const statusBadge = getTaskStatusBadge(task.status);
  const StatusIcon = statusBadge.icon;

  const handleCopyHint = async (hint: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hint);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy hint:', err);
    }
  };

  const categorizeHints = (hints: string[]) => {
    if (!hints || hints.length === 0) return { approach: [], resources: [], tips: [], general: [] };
    
    const categories = {
      approach: hints.filter(hint => 
        hint.toLowerCase().includes('approach') || 
        hint.toLowerCase().includes('method') ||
        hint.toLowerCase().includes('strategy') ||
        hint.toLowerCase().includes('start by') ||
        hint.toLowerCase().includes('begin with')
      ),
      resources: hints.filter(hint => 
        hint.toLowerCase().includes('resource') || 
        hint.toLowerCase().includes('tool') ||
        hint.toLowerCase().includes('library') ||
        hint.toLowerCase().includes('documentation') ||
        hint.toLowerCase().includes('framework')
      ),
      tips: hints.filter(hint => 
        hint.toLowerCase().includes('tip') || 
        hint.toLowerCase().includes('remember') ||
        hint.toLowerCase().includes('consider') ||
        hint.toLowerCase().includes('ensure') ||
        hint.toLowerCase().includes('make sure')
      ),
      general: hints.filter(hint => 
        !hint.toLowerCase().includes('approach') && 
        !hint.toLowerCase().includes('method') &&
        !hint.toLowerCase().includes('strategy') &&
        !hint.toLowerCase().includes('start by') &&
        !hint.toLowerCase().includes('begin with') &&
        !hint.toLowerCase().includes('resource') && 
        !hint.toLowerCase().includes('tool') &&
        !hint.toLowerCase().includes('library') &&
        !hint.toLowerCase().includes('documentation') &&
        !hint.toLowerCase().includes('framework') &&
        !hint.toLowerCase().includes('tip') && 
        !hint.toLowerCase().includes('remember') &&
        !hint.toLowerCase().includes('consider') &&
        !hint.toLowerCase().includes('ensure') &&
        !hint.toLowerCase().includes('make sure')
      )
    };
    
    return categories;
  };

  const categories = categorizeHints(task.hints || []);
  const totalHints = (task.hints || []).length;

  const renderHintCategory = (title: string, hints: string[], icon: React.ReactNode, colorClass: string) => {
    if (hints.length === 0) return null;

    return (
      <Card variant="outlined" className="mb-4">
        <CardHeader compact>
          <CardTitle size="sm" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center text-white shadow-lg`}>
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{title}</span>
                <Badge variant="soft-primary" size="sm">{hints.length}</Badge>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">
                AI-generated guidance for this category
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent compact>
          <div className="space-y-3">
            {hints.map((hint, index) => {
              const globalIndex = (task.hints || []).indexOf(hint);
              return (
                <div 
                  key={globalIndex} 
                  className="group p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-750 hover:from-blueberry-25 hover:to-neutral-50 dark:hover:from-blueberry-950 dark:hover:to-neutral-800 transition-all duration-200 border border-neutral-200 dark:border-neutral-700 hover:border-blueberry-200 dark:hover:border-blueberry-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="body-text text-neutral-700 dark:text-neutral-300 flex-1 leading-relaxed">
                      {hint}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopyHint(hint, globalIndex)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blueberry-100 dark:hover:bg-blueberry-900"
                    >
                      {copiedIndex === globalIndex ? (
                        <CheckCircle className="h-4 w-4 text-success-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent variant="default" size="xl" className="max-h-[90vh] bg-white dark:bg-neutral-900 flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blueberry-500 to-blueberry-600 flex items-center justify-center shadow-xl">
              <Target className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle size="xl" gradient className="mb-2">
                Task Details
              </DialogTitle>
              <DialogDescription className="text-base">
                Complete task information, timeline, and helpful guidance
              </DialogDescription>
            </div>
            <Badge variant={statusBadge.variant} size="lg">
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusBadge.text}
            </Badge>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-scroll">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-6">
              {/* Task Information */}
              <Card variant="ghost" className="bg-gradient-to-r from-blueberry-25 to-blueberry-50 dark:from-blueberry-950/20 dark:to-blueberry-900/20 border border-blueberry-200 dark:border-blueberry-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Task Name */}
                    <div>
                      <h3 className="heading-3 text-blueberry-800 dark:text-blueberry-200 mb-2">
                        {task.taskName}
                      </h3>
                      <p className="body-text text-blueberry-700 dark:text-blueberry-300">
                        Task ID: #{task.taskId}
                      </p>
                    </div>

                    {/* Task Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-neutral-900/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400" />
                        <div>
                          <p className="text-sm font-medium text-blueberry-800 dark:text-blueberry-200">Start Date</p>
                          <p className="text-sm text-blueberry-700 dark:text-blueberry-300">{task.startDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-neutral-900/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400" />
                        <div>
                          <p className="text-sm font-medium text-blueberry-800 dark:text-blueberry-200">End Date</p>
                          <p className="text-sm text-blueberry-700 dark:text-blueberry-300">{task.endDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-neutral-900/50 rounded-lg">
                        <Clock className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400" />
                        <div>
                          <p className="text-sm font-medium text-blueberry-800 dark:text-blueberry-200">Duration</p>
                          <p className="text-sm text-blueberry-700 dark:text-blueberry-300">{task.duration}</p>
                        </div>
                      </div>
                    </div>

                    {/* Project Context */}
                    {userRole === 'teacher' && (
                      <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-neutral-900/50 rounded-lg">
                        <User className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400" />
                        <div>
                          <p className="text-sm font-medium text-blueberry-800 dark:text-blueberry-200">Assigned To</p>
                          <p className="text-sm text-blueberry-700 dark:text-blueberry-300">{project.studentName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Hints Section */}
              {totalHints > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="heading-3 text-neutral-900 dark:text-neutral-100">Helpful Hints</h3>
                      <p className="body-text text-neutral-600 dark:text-neutral-400">
                        AI-generated guidance to help you complete this task successfully
                      </p>
                    </div>
                    <Badge variant="soft-primary" size="lg" className="ml-auto">
                      {totalHints} hints available
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-3">
                      <Card variant="outlined" size="sm" className="text-center">
                        <CardContent className="p-3">
                          <TrendingUp className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blueberry-600 dark:text-blueberry-400">{categories.approach.length}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Strategies</p>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" size="sm" className="text-center">
                        <CardContent className="p-3">
                          <BookOpen className="w-5 h-5 text-success-600 dark:text-success-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-success-600 dark:text-success-400">{categories.resources.length}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Resources</p>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" size="sm" className="text-center">
                        <CardContent className="p-3">
                          <Sparkles className="w-5 h-5 text-warning-600 dark:text-warning-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-warning-600 dark:text-warning-400">{categories.tips.length}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">Pro Tips</p>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" size="sm" className="text-center">
                        <CardContent className="p-3">
                          <Lightbulb className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mx-auto mb-1" />
                          <p className="text-lg font-bold text-neutral-600 dark:text-neutral-400">{categories.general.length}</p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">General</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Categorized Hints */}
                    {renderHintCategory(
                      "Approach & Strategy", 
                      categories.approach, 
                      <TrendingUp className="h-5 w-5" />, 
                      "bg-blueberry-500"
                    )}
                    {renderHintCategory(
                      "Resources & Tools", 
                      categories.resources, 
                      <BookOpen className="h-5 w-5" />, 
                      "bg-success-500"
                    )}
                    {renderHintCategory(
                      "Pro Tips & Best Practices", 
                      categories.tips, 
                      <Sparkles className="h-5 w-5" />, 
                      "bg-warning-500"
                    )}
                    {renderHintCategory(
                      "General Guidance", 
                      categories.general, 
                      <Lightbulb className="h-5 w-5" />, 
                      "bg-neutral-500"
                    )}
                  </div>
                </div>
              ) : (
                <Card variant="outlined" className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="h-8 w-8 text-neutral-400" />
                    </div>
                    <h3 className="heading-3 text-neutral-600 dark:text-neutral-400 mb-2">
                      No hints available
                    </h3>
                    <p className="body-text text-neutral-500 dark:text-neutral-500 max-w-md mx-auto">
                      No AI-generated hints are available for this task. You can proceed with your own approach or contact your instructor for guidance.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline-primary" className="flex items-center gap-2 text-base px-4 py-2">
                <Eye className="h-4 w-4" />
                Task Details
              </Badge>
              {totalHints > 0 && (
                <Badge variant="soft-primary" className="flex items-center gap-2 text-base px-4 py-2">
                  <Lightbulb className="h-4 w-4" />
                  {totalHints} hints available
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={onClose}
                leftIcon={<X className="h-4 w-4" />}
              >
                Close
              </Button>
              
              {userRole === 'student' && onSubmit && (
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => onSubmit(task)}
                  leftIcon={<Upload className="h-4 w-4" />}
                  className="shadow-button hover:shadow-button-hover"
                >
                  Submit Work
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}