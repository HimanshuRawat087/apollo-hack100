"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { 
  Lightbulb, 
  Zap, 
  BookOpen, 
  Rocket, 
  UserPlus, 
  Info, 
  ArrowLeft,
  Sparkles,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';

// Apollo Design System Components
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useToast } from '@/hooks/use-toast';
import AssignProjectDialog from '@/components/teacher/assign-project-dialog';
import IdeaDetail from './idea-detail';

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  icon?: React.ElementType;
}

// Enhanced Header Component with Stats
const StudentMentorHeader = ({ totalIdeasGenerated = 0 }: { totalIdeasGenerated?: number }) => (
  <div className="space-y-6">
    <Card variant="gradient" className="overflow-hidden">
      <CardHeader className="text-center pb-8 pt-8">
        <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <CardTitle size="xl" gradient className="mb-3">
          AI Project Idea Generator
        </CardTitle>
        <p className="body-text text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto text-lg">
          Transform education through personalized, AI-powered project ideas that inspire creativity and build real-world skills
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-blueberry-200 dark:border-blueberry-800">
          <div className="text-center">
            <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-950 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <p className="heading-3 text-blueberry-800 dark:text-blueberry-200">{totalIdeasGenerated}</p>
            <p className="body-text text-blueberry-600 dark:text-blueberry-400 text-sm">Ideas Generated</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-950 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <p className="heading-3 text-success-700 dark:text-success-300">AI-Powered</p>
            <p className="body-text text-success-600 dark:text-success-400 text-sm">Personalized</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-950 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Rocket className="w-6 h-6 text-warning-600 dark:text-warning-400" />
            </div>
            <p className="heading-3 text-warning-700 dark:text-warning-300">Engaging</p>
            <p className="body-text text-warning-600 dark:text-warning-400 text-sm">Educational</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  </div>
);

// Enhanced Search Form Component
const ProjectSearchForm = ({ 
  projectKeywords, 
  setProjectKeywords,
  difficulty,
  setDifficulty,
  duration,
  setDuration,
  onGenerate,
  isLoading
}: {
  projectKeywords: string;
  setProjectKeywords: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}) => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <Card variant="elevated" className="shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-950 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400" />
          </div>
          <div>
            <CardTitle size="lg">Configure Project Generation</CardTitle>
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              Fine-tune AI parameters to create the perfect educational experience
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="pills" className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" icon={<Lightbulb className="w-4 h-4" />}>
              Basic Settings
            </TabsTrigger>
            <TabsTrigger value="advanced" icon={<Zap className="w-4 h-4" />}>
              Advanced Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" variant="padded">
            <div className="space-y-6">
              {/* Keywords Input */}
              <div className="space-y-3">
                <Label htmlFor="project-keywords" required>
                  Project Keywords & Topics
                </Label>
                <Input 
                  id="project-keywords" 
                  type="text"
                  placeholder="e.g., Python, Web Development, Machine Learning, Data Science"
                  value={projectKeywords}
                  onChange={(e) => setProjectKeywords(e.target.value)}
                  disabled={isLoading}
                  leftIcon={<Lightbulb className="w-4 h-4" />}
                  description="Enter topics, technologies, or subject areas to generate relevant project ideas"
                  className="text-lg"
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <Label htmlFor="difficulty-level">
                    Difficulty Level
                  </Label>
                  <Select 
                    onValueChange={(value: 'Easy' | 'Medium' | 'Difficult') => setDifficulty(value)} 
                    defaultValue={difficulty}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="difficulty-level" size="lg">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Easy - Beginner Friendly</p>
                            <p className="text-xs text-neutral-500">Perfect for students new to the subject</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Medium - Intermediate Level</p>
                            <p className="text-xs text-neutral-500">Challenging but achievable projects</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Difficult">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Difficult - Advanced Challenge</p>
                            <p className="text-xs text-neutral-500">For experienced students seeking mastery</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label htmlFor="duration-level">
                    Project Duration
                  </Label>
                  <Select 
                    onValueChange={(value: '1 Week' | '3 Weeks' | '5+ Weeks') => setDuration(value)} 
                    defaultValue={duration}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="duration-level" leftIcon={<Clock className="w-4 h-4" />} size="lg">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Week">
                        <div>
                          <p className="font-medium">1 Week - Quick Sprint</p>
                          <p className="text-xs text-neutral-500">Fast-paced, focused learning</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="3 Weeks">
                        <div>
                          <p className="font-medium">3 Weeks - Standard Project</p>
                          <p className="text-xs text-neutral-500">Balanced depth and timeline</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="5+ Weeks">
                        <div>
                          <p className="font-medium">5+ Weeks - Comprehensive Study</p>
                          <p className="text-xs text-neutral-500">Deep dive with multiple phases</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" variant="padded">
            <div className="space-y-6">
              <Card variant="outlined" className="p-4 bg-blueberry-25 dark:bg-blueberry-950/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blueberry-600 dark:text-blueberry-400 mt-1" />
                  <div>
                    <p className="subtitle text-blueberry-800 dark:text-blueberry-200 mb-1">
                      Advanced AI Features
                    </p>
                    <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm">
                      Premium customization options coming soon! These will include industry focus, 
                      skill level targeting, and collaborative project options.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        {/* Enhanced Generate Button */}
        <div className="space-y-4">
          <Button 
            onClick={onGenerate} 
            variant="gradient"
            size="xl"
            className="w-full shadow-button hover:shadow-button-hover transform hover:scale-[1.02] transition-all duration-200"
            disabled={isLoading || !projectKeywords.trim()}
            loading={isLoading}
            loadingText="AI is generating personalized ideas..."
          >
            <Sparkles className="w-5 h-5 mr-3" />
            Generate AI Project Ideas
            <Rocket className="w-5 h-5 ml-3" />
          </Button>
          
          {projectKeywords.trim() && (
            <p className="body-text text-neutral-600 dark:text-neutral-400 text-center text-sm">
              Ready to generate ideas for: <strong>"{projectKeywords}"</strong>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Project Card Component
const ProjectIdeaCard = ({ 
  idea, 
  onViewDetails 
}: { 
  idea: ProjectIdea; 
  onViewDetails: (idea: ProjectIdea) => void;
}) => {
  const IconComponent = idea.icon || Lightbulb;
  
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': 
        return { variant: 'success' as const, color: 'text-success-600', bg: 'bg-success-100' };
      case 'medium': 
        return { variant: 'warning' as const, color: 'text-warning-600', bg: 'bg-warning-100' };
      case 'difficult': 
        return { variant: 'destructive' as const, color: 'text-error-600', bg: 'bg-error-100' };
      default: 
        return { variant: 'secondary' as const, color: 'text-neutral-600', bg: 'bg-neutral-100' };
    }
  };

  const getDurationVariant = (duration: string) => {
    if (duration.includes('1 Week')) return 'success';
    if (duration.includes('3 Weeks')) return 'default';
    return 'secondary';
  };

  const difficultyConfig = getDifficultyConfig(idea.difficulty);

  return (
    <Card 
      variant="interactive"
      className="group h-full flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 hover:border-blueberry-300 dark:hover:border-blueberry-600"
      onClick={() => onViewDetails(idea)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <CardTitle className="heading-3 text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-blueberry-600 dark:group-hover:text-blueberry-400 transition-colors flex-1">
            {idea.title}
          </CardTitle>
          <div className="w-14 h-14 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-950 dark:to-blueberry-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-blueberry-500 group-hover:to-blueberry-600 transition-all duration-300 shadow-lg">
            <IconComponent className="w-7 h-7 text-blueberry-600 dark:text-blueberry-400 group-hover:text-white transition-colors" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={difficultyConfig.variant} 
            size="default"
            className="font-semibold"
          >
            <div className={`w-2 h-2 rounded-full ${difficultyConfig.bg} mr-2`}></div>
            {idea.difficulty}
          </Badge>
          <Badge variant={getDurationVariant(idea.duration)} size="default">
            <Clock className="w-3 h-3 mr-1" />
            {idea.duration}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <p className="body-text text-neutral-600 dark:text-neutral-400 line-clamp-4 mb-6 flex-1 leading-relaxed">
          {idea.description}
        </p>
        
        <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full group-hover:border-blueberry-400 group-hover:text-blueberry-600 group-hover:bg-blueberry-50 dark:group-hover:bg-blueberry-950 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(idea);
            }}
          >
            <Info className="w-4 h-4 mr-2" />
            View Details & Create Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Empty State Component
const EmptyState = ({ hasSearched, isLoading }: { hasSearched: boolean; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <Card variant="outlined" className="text-center py-16">
        <CardContent>
          <LoadingSpinner 
            size="2xl" 
            variant="primary" 
            showLabel={true}
            label="Generating Personalized Ideas"
            description="Our AI is analyzing your requirements and crafting unique project concepts..."
          />
          <div className="mt-8 flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blueberry-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Analyzing keywords</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse animation-delay-200"></div>
              <span className="text-sm">Matching difficulty</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse animation-delay-400"></div>
              <span className="text-sm">Creating timeline</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="ghost" className="text-center py-16">
      <CardContent>
        <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-3xl flex items-center justify-center shadow-lg">
          <Lightbulb className="w-12 h-12 text-neutral-400" />
        </div>
        <CardTitle size="lg" className="mb-3">
          {hasSearched ? 'No ideas generated yet' : 'Ready to inspire your students?'}
        </CardTitle>
        <p className="body-text text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
          {hasSearched 
            ? 'Try adjusting your search parameters or keywords to generate new project ideas that match your curriculum needs.'
            : 'Enter your project keywords and preferences above to generate personalized, AI-powered project ideas that will engage and challenge your students.'
          }
        </p>
        {!hasSearched && (
          <div className="flex items-center justify-center gap-6 text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blueberry-500" />
              <span className="subtitle">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-success-500" />
              <span className="subtitle">Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-warning-500" />
              <span className="subtitle">Educational</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function StudentMentorPage() {
  const { user, loading: authLoading } = useAuth(); 
  const [projectKeywords, setProjectKeywords] = useState('');
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [duration, setDuration] = useState<string>('3 Weeks');
  const [isSavingQuery, setIsSavingQuery] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const [loadingProjectIdeas, setLoadingProjectIdeas] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const [selectedProjectToAssign, setSelectedProjectToAssign] = useState<ProjectIdea | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<ProjectIdea | null>(null);

  const FIREBASE_FUNCTION_URL = 'https://us-central1-role-auth-7bc43.cloudfunctions.net/generateProjectIdeasFn';

  const handleOpenAssignDialog = (project: ProjectIdea) => {
    setSelectedProjectToAssign(project);
    setIsAssignDialogOpen(true);
  };

  const handleViewDetails = (project: ProjectIdea) => {
    setIsAssignDialogOpen(false);
    setSelectedProjectForDetail(project);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedProjectForDetail(null);
    setViewMode('list');
  };

  if (authLoading || !user) { 
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner 
          size="2xl" 
          variant="primary" 
          showLabel={true}
          label="Loading Mentor Tools"
          description="Preparing your AI-powered project generation workspace..."
        />
      </div>
    );
  }

  const handleGenProjectIdeas = async () => {
    if (!projectKeywords.trim()) {
      toast({
        title: "Missing Keywords",
        description: "Please enter some project keywords to generate ideas.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.uid || !user.email) {
      toast({
        title: "Authentication Error",
        description: "Could not identify the user. Please try signing out and in again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoadingProjectIdeas(true);
      setHasSearched(true);
      setGeneratedIdeas([]); // Clear previous results

      const requestBody = {
        topic: projectKeywords,
        difficulty: difficulty,
        duration: duration
      };

      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawResponseText = data.response;
      const ideas = rawResponseText.ideas || [];

      setGeneratedIdeas(ideas); 
      
      if (ideas.length > 0) {
        toast({
          title: "Ideas Generated Successfully!",
          description: `Generated ${ideas.length} personalized project ideas for your students.`,
          variant: "success",
        });
      } else {
        toast({
          title: "No Ideas Generated",
          description: "Try adjusting your keywords or parameters for better results.",
          variant: "warning",
        });
      }
    } catch (error: any) {
      console.error("Error in AI generation:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate project ideas. Please try again later.",
        variant: "destructive",
      });
      setGeneratedIdeas([]);
    } finally {
      setLoadingProjectIdeas(false); 
    }

    // Save query to Firestore
    if (firebaseDbService) {
      setIsSavingQuery(true);
      try {
        const queryData = {
          userId: user.uid,
          userEmail: user.email,
          keywords: projectKeywords.trim(),
          difficulty: difficulty,
          duration: duration,
          success: generatedIdeas.length > 0,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(firebaseDbService, "projectIdeaQueries"), queryData);
      } catch (error) {
        console.error("Error saving project idea query:", error);
      } finally {
        setIsSavingQuery(false);
      }
    }
  };

  if (viewMode === 'detail' && selectedProjectForDetail) {
    return (
      <IdeaDetail
        idea={selectedProjectForDetail}
        goBack={handleBackToList}
        handleAssign={() => handleOpenAssignDialog(selectedProjectForDetail)}
      />
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <StudentMentorHeader totalIdeasGenerated={generatedIdeas.length} />

      <ProjectSearchForm
        projectKeywords={projectKeywords}
        setProjectKeywords={setProjectKeywords}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        duration={duration}
        setDuration={setDuration}
        onGenerate={handleGenProjectIdeas}
        isLoading={loadingProjectIdeas || isSavingQuery}
      />

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-2 text-neutral-900 dark:text-neutral-100 mb-2">
              Generated Project Ideas
            </h2>
            <p className="body-text text-neutral-600 dark:text-neutral-400">
              AI-powered suggestions tailored to your educational goals
            </p>
          </div>
          {generatedIdeas.length > 0 && (
            <Badge variant="soft-primary" size="lg" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {generatedIdeas.length} Ideas Generated
            </Badge>
          )}
        </div>

        {loadingProjectIdeas ? (
          <EmptyState hasSearched={hasSearched} isLoading={true} />
        ) : generatedIdeas.length === 0 ? (
          <EmptyState hasSearched={hasSearched} isLoading={false} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {generatedIdeas.map((idea) => (
              <ProjectIdeaCard
                key={idea.id}
                idea={idea}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProjectToAssign && user && (
        <AssignProjectDialog
          project={selectedProjectToAssign}
          isOpen={isAssignDialogOpen}
          onOpenChange={setIsAssignDialogOpen}
          teacherId={user.uid}
        />
      )}
    </div>
  );
}