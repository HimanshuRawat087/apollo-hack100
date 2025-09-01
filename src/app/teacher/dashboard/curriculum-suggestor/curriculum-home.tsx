"use client";

import { useState } from 'react';
import { 
  BookOpen, 
  Edit3, 
  Eye, 
  Sparkles,
  Users,
  Target,
  History
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CurriculumHomePageProps {
  onGenerateNew: () => void;
  onViewExample: (subject: string) => void;
  onEditExample: (subject: string) => void;
  onViewHistory: () => void;
}

export default function CurriculumHomePage({ 
  onGenerateNew, 
  onViewExample, 
  onEditExample,
  onViewHistory
}: CurriculumHomePageProps) {
  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 flex items-center justify-center shadow-lg">
            <BookOpen size={48} className="text-blueberry-600 dark:text-blueberry-400" />
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blueberry-400 to-blueberry-600 flex items-center justify-center animate-pulse">
            <Sparkles size={24} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="heading-2 bg-gradient-to-r from-blueberry-600 to-blueberry-700 bg-clip-text text-transparent dark:from-blueberry-400 dark:to-blueberry-500">
            AI-Powered Curriculum Designer
          </h1>
          <p className="heading-4 text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto font-normal leading-relaxed">
            Transform your teaching with engaging lesson plans designed specifically for Indian higher education. 
            Create interactive experiences that make students excited about learning.
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Generate New Curriculum */}
        <Card variant="feature" className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader compact={false}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <CardTitle gradient>Generate New Lesson Plan</CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400 mt-2">
                  Create a custom curriculum suggestion using AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="body-text text-neutral-700 dark:text-neutral-300">
                Enter your lesson topic, subject, and class details to get personalized suggestions for:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Engaging structure',
                  'Opening experiments', 
                  'Curiosity questions',
                  'Learning resources'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blueberry-25 dark:bg-blueberry-950 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-blueberry-500 flex items-center justify-center">
                      <Target size={14} className="text-white" />
                    </div>
                    <span className="body-text text-neutral-700 dark:text-neutral-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={onGenerateNew} 
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating
                </Button>
                <Button 
                  onClick={onViewHistory}
                  variant="outline" 
                  size="lg"
                  className="w-full border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-300 dark:hover:bg-blueberry-950"
                >
                  <History className="mr-2 h-5 w-5" />
                  View History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Examples */}
        <Card variant="elevated" className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader compact={false}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Eye className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-success-700 dark:text-success-400">Explore Example Lessons</CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400 mt-2">
                  See pre-built curriculum suggestions in action
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="body-text text-neutral-700 dark:text-neutral-300">
                Browse through example lesson plans to see the quality and depth of AI-generated suggestions:
              </p>
              
              <div className="space-y-4">
                {/* Physics Example */}
                <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="subtitle text-neutral-900 dark:text-neutral-100">Physics: Momentum & Impact</h4>
                      <p className="body-text text-neutral-600 dark:text-neutral-400">45 min • Egg drop experiment</p>
                    </div>
                    <Badge variant="soft-primary" className="text-xs">Physics</Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewExample('physics')}
                      className="flex-1 border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                    >
                      <Eye size={14} className="mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditExample('physics')}
                      className="flex-1 border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                    >
                      <Edit3 size={14} className="mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Computer Science Example */}
                <div className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="subtitle text-neutral-900 dark:text-neutral-100">CS: Algorithm Introduction</h4>
                      <p className="body-text text-neutral-600 dark:text-neutral-400">60 min • Human sorting game</p>
                    </div>
                    <Badge variant="soft-primary" className="text-xs">Computer Science</Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewExample('computer science')}
                      className="flex-1 border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                    >
                      <Eye size={14} className="mr-2" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditExample('computer science')}
                      className="flex-1 border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                    >
                      <Edit3 size={14} className="mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <Card variant="interactive" className="text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Target className="text-blueberry-600 dark:text-blueberry-400" size={40} />
            </div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-3">Indian Context</h3>
            <p className="body-text text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Designed specifically for State Public Universities with Indian examples, companies, and cultural context.
            </p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900 dark:to-success-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Users className="text-success-600 dark:text-success-400" size={40} />
            </div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-3">Engagement Focus</h3>
            <p className="body-text text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Transform boring lectures into interactive experiences with hands-on experiments and curiosity-driven content.
            </p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <div className="w-20 h-20 bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900 dark:to-warning-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Edit3 className="text-warning-600 dark:text-warning-400" size={40} />
            </div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-3">Fully Editable</h3>
            <p className="body-text text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Customize every aspect of your lesson plan with our WYSIWYG editor. Save, export, and reuse your content.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card variant="gradient" className="mt-12">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="heading-1 text-blueberry-600 dark:text-blueberry-400">4</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400">Core Components</div>
            </div>
            <div className="space-y-2">
              <div className="heading-1 text-blueberry-600 dark:text-blueberry-400">100%</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400">Customizable</div>
            </div>
            <div className="space-y-2">
              <div className="heading-1 text-blueberry-600 dark:text-blueberry-400">10+</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400">Subject Areas</div>
            </div>
            <div className="space-y-2">
              <div className="heading-1 text-blueberry-600 dark:text-blueberry-400">∞</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400">Possibilities</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
