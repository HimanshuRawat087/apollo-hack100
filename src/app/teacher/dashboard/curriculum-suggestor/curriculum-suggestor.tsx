"use client";

import { useState } from 'react';
import { 
  BookOpen, 
  Lightbulb, 
  MessageCircle, 
  Play, 
  FileText, 
  Video, 
  ArrowLeft,
  Clock,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  Download,
  Share,
  Edit3,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCurriculumSuggestionCS } from './test-curriculum-data';
import CurriculumViewer from './curriculum-viewer';

// Use the types from the API library
type LessonSuggestion = any;

export default function CurriculumSuggestor({ onEdit, onBack }: { onEdit: (suggestion: any) => void, onBack: () => void }) {
  const [lessonTopic, setLessonTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [classDuration, setClassDuration] = useState('60');
  const [classSize, setClassSize] = useState('');
  const [availableResources, setAvailableResources] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuggestion, setGeneratedSuggestion] = useState<LessonSuggestion | null>(null);
  const [activeTab, setActiveTab] = useState('structure');

  const FIREBASE_FUNCTION_URL = 'https://us-central1-role-auth-7bc43.cloudfunctions.net/generateCurriculumSuggestionsFn';

  const handleGenerateSuggestions = async () => {
    if (!lessonTopic.trim() || !subject.trim()) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const input: any = {
        lessonTopic: lessonTopic.trim(),
        subject,
        classLevel,
        classDuration,
        classSize,
        availableResources: availableResources.trim() || undefined,
        learningObjectives: learningObjectives.trim() || undefined,
      };

      const requestBody = input;
      const response = await fetch(FIREBASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      const rawResponseText = data?.response?.curriculumSuggestions;

      try {
        const parsedData = JSON.parse(rawResponseText);
        
      // sometimes the parsedData is not an object, instead it's an array of objects.
      if (Array.isArray(parsedData)) {
        setGeneratedSuggestion(parsedData[0]);
      } else {
        setGeneratedSuggestion(parsedData);
      }

      } catch (jsonError: any) {
        console.error("Failed to parse project plan JSON:", jsonError);
        setGeneratedSuggestion(null);
      }
    } catch (error) {
      console.error('Error generating curriculum suggestions:', error);
    } finally {
      setIsGenerating(false);
    }

  };

  if (generatedSuggestion) {
    return (
      <CurriculumViewer 
        suggestion={generatedSuggestion}
        onBack={onBack}
        onEdit={() => onEdit(generatedSuggestion)}
      />
    );
  }

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 mx-auto bg-neutral-50 dark:bg-neutral-900 max-w-4xl">
      {/* Form Card */}
      <Card variant="feature" className="shadow-2xl border-0">
        <CardContent className="space-y-8 pt-6">
          {/* Required Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  required
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Lesson Topic
                </Label>
                <Input 
                  variant="outline"
                  size="lg"
                  placeholder="e.g., Introduction to Machine Learning" 
                  value={lessonTopic}
                  onChange={(e) => setLessonTopic(e.target.value)}
                  className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                />
              </div>
              
              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  required
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Subject
                </Label>
                <Select onValueChange={setSubject}>
                  <SelectTrigger 
                    variant="outline"
                    size="lg"
                    className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                  >
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="business">Business Studies</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Optional Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-blueberry-500 rounded-full flex items-center justify-center">
                <Target size={14} className="text-white" />
              </div>
              <h3 className="subtitle text-neutral-900 dark:text-neutral-100">Class Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  optional
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Class Level
                </Label>
                <Select onValueChange={setClassLevel}>
                  <SelectTrigger 
                    variant="filled"
                    size="lg"
                    className="bg-neutral-50 dark:bg-neutral-800"
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate-1">1st Year UG</SelectItem>
                    <SelectItem value="undergraduate-2">2nd Year UG</SelectItem>
                    <SelectItem value="undergraduate-3">3rd Year UG</SelectItem>
                    <SelectItem value="undergraduate-4">4th Year UG</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  icon={<Clock size={16} />}
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Duration
                </Label>
                <Select onValueChange={setClassDuration} defaultValue="60">
                  <SelectTrigger 
                    variant="filled"
                    size="lg"
                    className="bg-neutral-50 dark:bg-neutral-800"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  icon={<Users size={16} />}
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Class Size
                </Label>
                <Select onValueChange={setClassSize}>
                  <SelectTrigger 
                    variant="filled"
                    size="lg"
                    className="bg-neutral-50 dark:bg-neutral-800"
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-20)</SelectItem>
                    <SelectItem value="medium">Medium (21-50)</SelectItem>
                    <SelectItem value="large">Large (51-100)</SelectItem>
                    <SelectItem value="very-large">Very Large (100+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                <Lightbulb size={14} className="text-white" />
              </div>
              <h3 className="subtitle text-neutral-900 dark:text-neutral-100">Additional Details</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  optional
                  description="List the resources available in your classroom"
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Available Resources
                </Label>
                <Input 
                  variant="filled"
                  size="lg"
                  placeholder="e.g., Projector, Whiteboard, Computer Lab, Basic Lab Equipment" 
                  value={availableResources}
                  onChange={(e) => setAvailableResources(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800"
                />
              </div>

              <div className="space-y-3">
                <Label 
                  variant="default" 
                  size="default"
                  optional
                  description="What should students learn or achieve by the end of this lesson?"
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Learning Objectives
                </Label>
                <Textarea 
                  variant="filled"
                  size="lg"
                  placeholder="Describe the key learning outcomes you want to achieve..."
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-800 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <Button 
              variant="gradient"
              size="xl"
              onClick={handleGenerateSuggestions} 
              className="w-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isGenerating || !lessonTopic.trim() || !subject.trim()}
              loading={isGenerating}
              loadingText="Generating Your Personalized Lesson Plan..."
            >
              {!isGenerating && (
                <>
                  <Sparkles className="mr-3 h-6 w-6" />
                  Generate Lesson Plan
                </>
              )}
            </Button>
            
            {(!lessonTopic.trim() || !subject.trim()) && (
              <p className="body-text text-neutral-500 dark:text-neutral-400 text-center mt-3">
                Please fill in the required fields to generate your lesson plan
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="grid md:grid-cols-4 gap-6 mt-12">
        {[
          {
            icon: Target,
            title: "Structure",
            description: "Lesson phases with timing",
            color: "blueberry"
          },
          {
            icon: Play,
            title: "Experiments",
            description: "Hands-on activities",
            color: "success"
          },
          {
            icon: MessageCircle,
            title: "Engagement",
            description: "Curiosity questions",
            color: "warning"
          },
          {
            icon: FileText,
            title: "Resources",
            description: "Reading & practice",
            color: "error"
          }
        ].map((feature, index) => (
          <Card key={index} variant="interactive" className="text-center group">
            <CardContent className="flex flex-col items-center space-y-3 pt-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                feature.color === 'blueberry' ? 'bg-blueberry-100 dark:bg-blueberry-900' :
                feature.color === 'success' ? 'bg-success-100 dark:bg-success-900' :
                feature.color === 'warning' ? 'bg-warning-100 dark:bg-warning-900' :
                'bg-error-100 dark:bg-error-900'
              }`}>
                <feature.icon size={24} className={`${
                  feature.color === 'blueberry' ? 'text-blueberry-600 dark:text-blueberry-400' :
                  feature.color === 'success' ? 'text-success-600 dark:text-success-400' :
                  feature.color === 'warning' ? 'text-warning-600 dark:text-warning-400' :
                  'text-error-600 dark:text-error-400'
                }`} />
              </div>
              <h3 className="subtitle text-neutral-900 dark:text-neutral-100">{feature.title}</h3>
              <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
