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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  Target, 
  CheckCircle, 
  BookOpen,
  Copy,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Zap,
  Save,
  X
} from "lucide-react";

interface TaskHintsProps {
  task: string;
  idea: string;
  onClose: () => void;
  initialHints?: string[];
  onSaveHints?: (hints: string[]) => void;
  onRegenerateHints?: () => void;
  isGenerating?: boolean;
}

export default function TaskHints({
  task,
  idea,
  onClose,
  initialHints,
  onSaveHints,
  onRegenerateHints,
  isGenerating = false
}: TaskHintsProps) {
  const [taskHints, setTaskHints] = useState<string[]>([]);
  const [loadingHints, setLoadingHints] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialHints && initialHints.length > 0) {
      setTaskHints(initialHints);
      setLoadingHints(false);
    } else {
      setTaskHints([]);
      setLoadingHints(false);
    }
  }, [initialHints]);

  const handleCopyHint = async (hint: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hint);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy hint:', err);
    }
  };

  const handleSaveHints = () => {
    if (onSaveHints) {
      onSaveHints(taskHints);
    }
    onClose();
  };

  const categorizeHints = (hints: string[]) => {
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

  const categories = categorizeHints(taskHints);

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
              const globalIndex = taskHints.indexOf(hint);
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
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent variant="feature" size="xl" className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blueberry-500 to-blueberry-600 flex items-center justify-center shadow-xl">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle size="xl" gradient className="mb-2">
                Task Guidance & Hints
              </DialogTitle>
              <DialogDescription className="text-base">
                AI-powered suggestions to help students succeed with this specific task
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {task && (
          <div className="space-y-6">
            {/* Task Context */}
            <Card variant="ghost" className="bg-gradient-to-r from-blueberry-25 to-blueberry-50 dark:from-blueberry-950/20 dark:to-blueberry-900/20 border border-blueberry-200 dark:border-blueberry-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blueberry-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="subtitle text-blueberry-800 dark:text-blueberry-200 mb-2">
                      Current Task Focus
                    </p>
                    <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-lg leading-relaxed">
                      {task}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
              {loadingHints || isGenerating ? (
                <Card variant="outlined" className="h-80">
                  <CardContent className="h-full flex flex-col items-center justify-center p-8">
                    <LoadingSpinner 
                      size="xl" 
                      variant="primary"
                      showLabel 
                      label="Generating personalized hints..."
                      description="Our AI is analyzing the task to create targeted guidance that will help students succeed"
                    />
                    <div className="mt-6 flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blueberry-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Analyzing task complexity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse animation-delay-200"></div>
                        <span className="text-sm">Generating strategies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse animation-delay-400"></div>
                        <span className="text-sm">Creating tips</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : taskHints.length > 0 ? (
                <ScrollArea className="h-96">
                  <div className="space-y-4 pr-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
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
                </ScrollArea>
              ) : (
                <Card variant="outlined" className="h-80">
                  <CardContent className="h-full flex flex-col items-center justify-center p-8">
                    <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
                      <Lightbulb className="h-10 w-10 text-neutral-400" />
                    </div>
                    <p className="heading-3 text-neutral-600 dark:text-neutral-400 mb-3">
                      No hints available
                    </p>
                    <p className="body-text text-neutral-500 dark:text-neutral-500 text-center max-w-md">
                      Generate AI-powered hints to provide students with targeted guidance for completing this task successfully
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {taskHints.length > 0 && (
                  <Badge variant="outline-primary" className="flex items-center gap-2 text-base px-4 py-2">
                    <CheckCircle className="h-4 w-4" />
                    {taskHints.length} hints generated
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {onRegenerateHints && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={onRegenerateHints}
                    disabled={isGenerating}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    Regenerate
                  </Button>
                )}
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={onClose}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Cancel
                </Button>
                
                {taskHints.length > 0 && onSaveHints && (
                  <Button 
                    variant="default" 
                    size="lg"
                    onClick={handleSaveHints}
                    leftIcon={<Save className="h-4 w-4" />}
                    className="shadow-button hover:shadow-button-hover"
                  >
                    Save Hints
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}