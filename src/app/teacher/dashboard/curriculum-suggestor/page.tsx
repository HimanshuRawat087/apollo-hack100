"use client";

import { useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import your custom components (these would also need Apollo styling)
import CurriculumSuggestor from './curriculum-suggestor';
import CurriculumEditor from './curriculum-editor';
import CurriculumViewer from './curriculum-viewer';
import CurriculumHomePage from './curriculum-home';
import CurriculumHistory from './curriculum-history';

// Import types and test data
import { 
  getMockCurriculumSuggestion 
} from './test-curriculum-data';

// View modes for the page
type ViewMode = 'home' | 'generator' | 'viewer' | 'editor' | 'history';

export default function CurriculumPage() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [currentSuggestion, setCurrentSuggestion] = useState<any | null>(null);

  // Handle navigation between views
  const handleGenerateNew = () => {
    setCurrentView('generator');
    setCurrentSuggestion(null);
  };

  const handleViewExample = (subject: string) => {
    const mockData = getMockCurriculumSuggestion(subject);
    const parsed = JSON.parse(mockData.curriculumSuggestions);
    setCurrentSuggestion(parsed);
    setCurrentView('viewer');
  };

  const handleEditExample = (subject: string) => {
    const mockData = getMockCurriculumSuggestion(subject);
    const parsed = JSON.parse(mockData.curriculumSuggestions);
    setCurrentSuggestion(parsed);
    setCurrentView('editor');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentSuggestion(null);
  };
  
  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleSaveCurriculum = (data: any) => {
    console.log('Saving curriculum:', data);
    // Here you would save to your backend/database
    // For now, we'll just update the current suggestion
    setCurrentSuggestion(data);
    setCurrentView('viewer');
    
    // Show success message (you can integrate with your toast system)
    alert('Curriculum saved successfully!');
  };

  const handleExportCurriculum = () => {
    console.log('Exporting curriculum...');
    // Here you would implement PDF/Word export
    alert('Export functionality would be implemented here');
  };

  // Render different views based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'generator':
        return (
          <CurriculumSuggestor
            onEdit={(suggestion: any) => {
              setCurrentSuggestion(suggestion);
              setCurrentView('editor');
            }}
            onBack={handleBackToHome}
          />
        );
      
      case 'viewer':
        return currentSuggestion ? (
          <CurriculumViewer 
            suggestion={currentSuggestion}
            onBack={handleBackToHome}
            onEdit={() => setCurrentView('editor')}
          />
        ) : null;
      
      case 'editor':
        return currentSuggestion ? (
          <CurriculumEditor
            initialData={currentSuggestion}
            onSave={handleSaveCurriculum}
            onExport={handleExportCurriculum}
            onBack={() => setCurrentView('viewer')}
          />
        ) : null;

      case 'history':
        return (
          <CurriculumHistory
            onBack={handleBackToHome}
            onViewCurriculum={(curriculum: any) => {
              setCurrentView('viewer');
              setCurrentSuggestion(curriculum);
            }}
            onEditCurriculum={(curriculum: any) => {
              setCurrentView('editor');
              setCurrentSuggestion(curriculum);
            }}
          />
        );
      
      case 'home':
      default:
        return (
          <CurriculumHomePage
            onGenerateNew={handleGenerateNew}
            onViewExample={handleViewExample}
            onEditExample={handleEditExample}
            onViewHistory={handleViewHistory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Navigation Header - only show on non-home views */}
      {currentView !== 'home' && (
        <header className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 w-full shadow-sm">
          <div className="w-full px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-blueberry-600 hover:text-blueberry-700 hover:bg-blueberry-50"
              >
                <ArrowLeft size={16} />
                Back to Home
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center">
                  <BookOpen size={18} className="text-blueberry-600 dark:text-blueberry-400" />
                </div>
                <span className="heading-3 text-blueberry-700 dark:text-blueberry-300">
                  {currentView === 'generator' && 'Curriculum Generator'}
                  {currentView === 'viewer' && 'Lesson Plan Viewer'}
                  {currentView === 'editor' && 'Lesson Plan Editor'}
                  {currentView === 'history' && 'Curriculum History'}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow w-full bg-neutral-50 dark:bg-neutral-900">
        {renderCurrentView()}
      </main>
    </div>
  );
}
