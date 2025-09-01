"use client";

import { useState } from 'react';
import { 
  Edit3, 
  Users,
  Target,
  FileText,
  MessageCircle,
  Play,
  Save,
  BookmarkPlus,
  Loader2,
  Download,
  Share,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';

interface CurriculumViewerProps {
  suggestion: any;
  onBack: () => void;
  onEdit: () => void;
}

export default function CurriculumViewer({ suggestion, onBack, onEdit }: CurriculumViewerProps) {
  const [activeTab, setActiveTab] = useState('structure');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { toast } = useToast();
  const { user } = useAuth(); 

  const handleSavePlan = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      
      // Prepare the data for Firebase
      const curriculumData = {
        ...suggestion,
        metadata: {
          title: suggestion.lessonStructure.title,
          subject: 'Computer Science', // You can make this dynamic
          gradeLevel: 'Medium Class', // You can make this dynamic
          duration: suggestion.lessonStructure.duration,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: '1.0'
        }
      };
      const queryData = {
        userId: user?.uid,
        data: curriculumData,
        createdAt: serverTimestamp(),
      };
      

      await addDoc(collection(firebaseDbService, 'curriculums'), queryData);

      toast({
        title: "Query Saved!",
        description: "Your project idea query has been saved. AI generation coming soon!",
      });
      
      setSaveStatus('saved');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error saving curriculum:', error);
      setSaveStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved Successfully!';
      case 'error':
        return 'Save Failed';
      default:
        return 'Save This Plan';
    }
  };

  const getSaveButtonVariant = () => {
    switch (saveStatus) {
      case 'saved':
        return 'success' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 w-full bg-neutral-50 dark:bg-neutral-900 mx-auto">
      {/* Header */}
      <div className="flex flex-col justify-between">
        <div className="space-y-4">
          <h1 className="heading-2 text-blueberry-700 dark:text-blueberry-300">
            {suggestion.lessonStructure.title}
          </h1>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <div className="w-8 h-8 rounded-lg bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center">
                <Target size={16} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <span className="body-text font-medium">{suggestion.lessonStructure.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <div className="w-8 h-8 rounded-lg bg-success-100 dark:bg-success-900 flex items-center justify-center">
                <Users size={16} className="text-success-600 dark:text-success-400" />
              </div>
              <span className="body-text font-medium">Example Lesson</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-8">
          <Button 
            variant={getSaveButtonVariant()}
            size="lg"
            onClick={handleSavePlan}
            disabled={isSaving || saveStatus === 'saved'}
          >
            {isSaving ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : saveStatus === 'saved' ? (
              <CheckCircle size={18} className="mr-2" />
            ) : saveStatus === 'error' ? (
              <AlertCircle size={18} className="mr-2" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {getSaveButtonText()}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={onEdit} 
            className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-300 dark:hover:bg-blueberry-950"
          >
            <Edit3 size={18} className="mr-2" />
            Edit This Plan
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            disabled
            className="relative"
          >
            <Download size={18} className="mr-2" />
            Export
            <Badge variant="warning" size="sm" className="ml-3">Coming Soon</Badge>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            disabled
            className="relative"
          >
            <Share size={18} className="mr-2" />
            Share
            <Badge variant="warning" size="sm" className="ml-3">Coming Soon</Badge>
          </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills" className="w-full">
        <TabsList className="grid w-full h-auto grid-cols-4 bg-white dark:bg-neutral-800 p-2 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
          <TabsTrigger value="structure" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
            <Target size={16} />
            <span className="hidden sm:inline">Structure</span>
          </TabsTrigger>
          <TabsTrigger value="opening" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Opening</span>
          </TabsTrigger>
          <TabsTrigger value="experiment" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
            <Play size={16} />
            <span className="hidden sm:inline">Experiment</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
            <FileText size={16} />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" variant="card" className="space-y-6">
          <Card variant="feature">
            <CardHeader>
              <CardTitle size="default" className="text-blueberry-700 dark:text-blueberry-300">Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestion.lessonStructure.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-3 p-1 bg-blueberry-25 dark:bg-blueberry-950 rounded-lg">
                    <div className="w-6 h-6 bg-blueberry-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {suggestion.lessonStructure.phases.map((phase, index) => (
            <Card key={index} variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle size="default" className="text-neutral-900 dark:text-neutral-100">{phase.name}</CardTitle>
                  <Badge variant="outline-primary" className="flex-shrink-0">{phase.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phase.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-start gap-3 p-1 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      <div className="w-2 h-2 bg-blueberry-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span className="body-text text-neutral-700 dark:text-neutral-300">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="experiment" variant="card" className="space-y-6">
          <Card variant="feature">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle size="lg" className="text-success-700 dark:text-success-300">{suggestion.experiment.title}</CardTitle>
                  <Badge variant="success" size="default">{suggestion.experiment.duration}</Badge>
                </div>
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center">
                  <Play size={24} className="text-success-600 dark:text-success-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="subtitle text-neutral-900 dark:text-neutral-100">Materials Required:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {suggestion.experiment.materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-3 p-1 bg-success-25 dark:bg-success-950 rounded-lg">
                      <div className="w-2 h-2 bg-success-500 rounded-full flex-shrink-0" />
                      <span className="body-text text-neutral-700 dark:text-neutral-300">{material}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="subtitle text-neutral-900 dark:text-neutral-100">Step-by-Step Procedure:</h4>
                <div className="space-y-2">
                  {suggestion.experiment.procedure.map((step, index) => (
                    <div key={index} className="flex gap-2 p-2 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="w-8 h-8 bg-blueberry-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                        {index + 1}
                      </div>
                      <span className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card variant="gradient" className="border-success-200 dark:border-success-700 pt-2">
                <CardContent>
                  <h4 className="subtitle text-success-800 dark:text-success-200 mb-3">Expected Outcome:</h4>
                  <p className="body-text text-success-700 dark:text-success-300 leading-relaxed">{suggestion.experiment.expectedOutcome}</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opening" variant="card" className="space-y-6">
          <Card variant="feature">
            <CardHeader>
              <CardTitle size="default" className="text-warning-700 dark:text-warning-300">Curiosity Question & Answer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h5 className="subtitle text-neutral-900 dark:text-neutral-100">Question for Students:</h5>
                <Card variant="outlined" className="border-warning-300 dark:border-warning-600">
                  <CardContent>
                    <p className="heading-3 text-warning-800 dark:text-warning-200 italic leading-relaxed">
                      "{suggestion.openingRemarks.curiosityQuestion}"
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-3">
                <h5 className="subtitle text-neutral-900 dark:text-neutral-100">Answer Guide for Teacher:</h5>
                <Card variant="ghost" className="bg-neutral-100 dark:bg-neutral-800">
                  <CardContent size="lg">
                    <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {suggestion.openingRemarks.curiosityAnswer}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="interactive" className="border-warning-200 dark:border-warning-700">
              <CardHeader>
                <CardTitle className="text-warning-700 dark:text-warning-300">Fun Fact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {suggestion.openingRemarks.funFact}
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive" className="border-blueberry-200 dark:border-blueberry-700">
              <CardHeader>
                <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Related Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {suggestion.openingRemarks.relatedStory}
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive" className="border-success-200 dark:border-success-700">
              <CardHeader>
                <CardTitle className="text-success-700 dark:text-success-300">Industry Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {suggestion.openingRemarks.industryConnection}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" variant="card" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-blueberry-600 dark:text-blueberry-400" />
                  </div>
                  <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Reading Materials</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestion.postLectureResources.readingMaterials.map((material, index) => (
                  <Card key={index} variant="ghost" className="p-4 hover:bg-blueberry-25 dark:hover:bg-blueberry-950 transition-colors">
                    <div className="space-y-3">
                      <h4 className="subtitle text-neutral-900 dark:text-neutral-100">{material.title}</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" size="sm">{material.type}</Badge>
                        <Badge variant="secondary" size="sm">{material.difficulty}</Badge>
                      </div>
                      {material.url && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="p-0 h-auto text-blueberry-600 hover:text-blueberry-700 dark:text-blueberry-400 dark:hover:text-blueberry-300"
                          asChild
                        >
                          <a href={material.url} target="_blank" rel="noopener noreferrer">
                            Read Article →
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-error-100 dark:bg-error-900 rounded-lg flex items-center justify-center">
                    <Play size={20} className="text-error-600 dark:text-error-400" />
                  </div>
                  <CardTitle className="text-error-700 dark:text-error-300">Video Resources</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestion.postLectureResources.videoResources.map((video, index) => (
                  <Card key={index} variant="ghost" className="p-4 hover:bg-error-25 dark:hover:bg-error-950 transition-colors">
                    <div className="space-y-3">
                      <h4 className="subtitle text-neutral-900 dark:text-neutral-100">{video.title}</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" size="sm">{video.platform}</Badge>
                        <Badge variant="secondary" size="sm">{video.duration}</Badge>
                      </div>
                      <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{video.description}</p>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="p-0 h-auto text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300"
                        asChild
                      >
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          Watch Video →
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                    <Target size={20} className="text-success-600 dark:text-success-400" />
                  </div>
                  <CardTitle className="text-success-700 dark:text-success-300">Practice Exercises</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestion.postLectureResources.practiceExercises.map((exercise, index) => (
                  <Card key={index} variant="ghost" className="p-4 hover:bg-success-25 dark:hover:bg-success-950 transition-colors">
                    <div className="space-y-3">
                      <h4 className="subtitle text-neutral-900 dark:text-neutral-100">{exercise.title}</h4>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" size="sm">{exercise.type}</Badge>
                        <Badge variant="secondary" size="sm">{exercise.estimatedTime}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="body-bold text-neutral-800 dark:text-neutral-200">Description: </span>
                          <span className="body-text text-neutral-600 dark:text-neutral-400">{exercise.description}</span>
                        </div>
                        <div>
                          <span className="body-bold text-neutral-800 dark:text-neutral-200">Learning Objective: </span>
                          <span className="body-text text-neutral-600 dark:text-neutral-400">{exercise.learningObjective}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}