"use client";

import { useState, useCallback } from 'react';
import { 
  BookOpen, 
  Save, 
  Download, 
  Share,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Users,
  Target,
  Play,
  MessageCircle,
  FileText,
  Edit,
  Check,
  X,
  Lightbulb,
  BookmarkPlus,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CurriculumEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onExport?: () => void;
  onBack?: () => void;
}

export default function CurriculumEditor({ 
  initialData,
  onSave, 
  onExport, 
  onBack 
}: CurriculumEditorProps) {
  const [curriculumData, setCurriculumData] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleSave = () => {
    if (onSave) {
      onSave(curriculumData);
    }
    setHasChanges(false);
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const updateField = useCallback((path: string[], value: any) => {
    setCurriculumData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      setHasChanges(true);
      return newData;
    });
  }, []);

  const addArrayItem = useCallback((path: string[], defaultItem: any) => {
    setCurriculumData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current = newData;
      
      for (const key of path) {
        current = current[key];
      }
      current.push(defaultItem);
      
      setHasChanges(true);
      return newData;
    });
  }, []);

  const removeArrayItem = useCallback((path: string[], index: number) => {
    setCurriculumData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      let current = newData;
      
      for (const key of path) {
        current = current[key];
      }
      current.splice(index, 1);
      
      setHasChanges(true);
      return newData;
    });
  }, []);

  const startEditing = (fieldId: string, currentValue: string) => {
    setEditingField(fieldId);
    setTempValue(currentValue || '');
  };

  const saveEdit = (path: string[]) => {
    updateField(path, tempValue);
    setEditingField(null);
    setTempValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const EditableField = ({ 
    fieldId, 
    value, 
    path, 
    placeholder, 
    multiline = false, 
    className = "" 
  }: {
    fieldId: string;
    value: string;
    path: string[];
    placeholder: string;
    multiline?: boolean;
    className?: string;
  }) => {
    const isEditing = editingField === fieldId;

    if (isEditing) {
      return (
        <div className="flex items-start gap-3">
          {multiline ? (
            <Textarea
              variant="outline"
              size="default"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              className={`bg-blueberry-25 dark:bg-blueberry-950 border-blueberry-300 dark:border-blueberry-600 min-h-[80px] flex-grow ${className}`}
              autoFocus
            />
          ) : (
            <Input
              variant="outline"
              size="default"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              className={`bg-blueberry-25 dark:bg-blueberry-950 border-blueberry-300 dark:border-blueberry-600 flex-grow ${className}`}
              autoFocus
            />
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => saveEdit(path)}
              className="text-success-600 hover:text-success-700 hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-950 h-8 w-8 p-0"
            >
              <Check size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelEdit}
              className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950 h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="group flex items-start gap-3 cursor-pointer" onClick={() => startEditing(fieldId, value)}>
        <div className={`flex-grow p-3 rounded-lg border-2 border-transparent hover:border-blueberry-300 hover:bg-blueberry-25 dark:hover:border-blueberry-600 dark:hover:bg-blueberry-950 transition-all duration-200 ${className}`}>
          {value ? (
            <span className="body-text text-neutral-900 dark:text-neutral-100">{value}</span>
          ) : (
            <span className="body-text text-neutral-400 dark:text-neutral-500 italic">{placeholder}</span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-blueberry-600 hover:text-blueberry-700 hover:bg-blueberry-50 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
        >
          <Edit size={16} />
        </Button>
      </div>
    );
  };

  const EditableList = ({ 
    items, 
    pathPrefix, 
    placeholder,
    fieldIdPrefix 
  }: { 
    items: string[];
    pathPrefix: string[];
    placeholder: string;
    fieldIdPrefix: string;
  }) => {
    const handleAddItem = () => {
      addArrayItem(pathPrefix, "");
    };

    const handleRemoveItem = (index: number) => {
      removeArrayItem(pathPrefix, index);
    };

    return (
      <div className="space-y-4">
        {(items || []).map((item: string, index: number) => (
          <div key={`${fieldIdPrefix}-${index}`} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blueberry-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
            <div className="flex-grow">
              <EditableField
                fieldId={`${fieldIdPrefix}-${index}`}
                value={item}
                path={[...pathPrefix, index.toString()]}
                placeholder={placeholder}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(index)}
              className="text-error-500 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950 h-8 w-8 p-0 mt-1"
              type="button"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
          type="button"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full p-6 space-y-8">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="default"
              variant="ghost"
              onClick={onBack}
              className="text-blueberry-600 hover:text-blueberry-700 hover:bg-blueberry-50 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Viewer
            </Button>
            {hasChanges && (
              <Badge variant="warning" size="default" className="animate-pulse">
                <AlertCircle size={14} className="mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              size="default"
              variant="success"
              onClick={handleSave}
              disabled={!hasChanges}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Lesson Overview */}
        <Card variant="feature" className="shadow-lg">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <CardTitle size="xl" className="mb-4">
                  <EditableField
                    fieldId="lesson-title"
                    value={curriculumData?.lessonStructure?.title || ''}
                    path={['lessonStructure', 'title']}
                    placeholder="Enter lesson title..."
                    className="text-xl font-bold"
                  />
                </CardTitle>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blueberry-100 dark:bg-blueberry-900 flex items-center justify-center">
                      <Clock size={16} className="text-blueberry-600 dark:text-blueberry-400" />
                    </div>
                    <EditableField
                      fieldId="lesson-duration"
                      value={curriculumData.lessonStructure.duration}
                      path={['lessonStructure', 'duration']}
                      placeholder="Duration..."
                      className="body-text"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success-100 dark:bg-success-900 flex items-center justify-center">
                      <Users size={16} className="text-success-600 dark:text-success-400" />
                    </div>
                    <span className="body-text text-neutral-600 dark:text-neutral-400">Medium Class</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
                      <Target size={16} className="text-warning-600 dark:text-warning-400" />
                    </div>
                    <span className="body-text text-neutral-600 dark:text-neutral-400">Computer Science</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabbed Content */}
        <div className="w-full">
          <Tabs defaultValue="structure" variant="pills" className="w-full">
            <TabsList className="grid w-full h-auto grid-cols-4 bg-white dark:bg-neutral-800 p-2 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
              <TabsTrigger value="structure" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
                <Target size={16} />
                <span className="hidden sm:inline">Structure</span>
              </TabsTrigger>
              <TabsTrigger value="experiment" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
                <Play size={16} />
                <span className="hidden sm:inline">Experiment</span>
              </TabsTrigger>
              <TabsTrigger value="opening" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Opening</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2 data-[state=active]:bg-blueberry-600 data-[state=active]:text-white">
                <FileText size={16} />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structure" variant="card" className="space-y-8">
              {/* Learning Objectives */}
              <Card variant="elevated" className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                      <Target size={20} className="text-blueberry-600 dark:text-blueberry-400" />
                    </div>
                    <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Learning Objectives</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <EditableList
                    items={curriculumData.lessonStructure.objectives}
                    pathPrefix={['lessonStructure', 'objectives']}
                    placeholder="Enter learning objective..."
                    fieldIdPrefix="objective"
                  />
                </CardContent>
              </Card>

              {/* Lesson Phases */}
              {curriculumData.lessonStructure.phases.map((phase, phaseIndex) => (
                <Card key={phaseIndex} variant="interactive" className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle size="lg" className="flex-grow text-neutral-900 dark:text-neutral-100">
                        <EditableField
                          fieldId={`phase-name-${phaseIndex}`}
                          value={phase.name}
                          path={['lessonStructure', 'phases', phaseIndex.toString(), 'name']}
                          placeholder="Phase name..."
                        />
                      </CardTitle>
                      <Badge variant="outline-primary" size="default" className="flex-shrink-0">
                        <EditableField
                          fieldId={`phase-duration-${phaseIndex}`}
                          value={phase.duration}
                          path={['lessonStructure', 'phases', phaseIndex.toString(), 'duration']}
                          placeholder="Duration..."
                          className="text-xs"
                        />
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EditableList
                      items={phase.activities}
                      pathPrefix={['lessonStructure', 'phases', phaseIndex.toString(), 'activities']}
                      placeholder="Enter activity..."
                      fieldIdPrefix={`phase-${phaseIndex}-activity`}
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="experiment" variant="card" className="space-y-8">
              <Card variant="feature">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Play size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle size="lg" className="text-success-700 dark:text-success-300 mb-3">
                        <EditableField
                          fieldId="experiment-title"
                          value={curriculumData.experiment.title}
                          path={['experiment', 'title']}
                          placeholder="Experiment title..."
                          className="text-lg font-semibold"
                        />
                      </CardTitle>
                      <Badge variant="success" size="default">
                        <EditableField
                          fieldId="experiment-duration"
                          value={curriculumData.experiment.duration}
                          path={['experiment', 'duration']}
                          placeholder="Duration..."
                          className="text-xs"
                        />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-4">Materials Needed:</h4>
                    <EditableList
                      items={curriculumData.experiment.materials}
                      pathPrefix={['experiment', 'materials']}
                      placeholder="Enter material..."
                      fieldIdPrefix="material"
                    />
                  </div>

                  <div>
                    <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-4">Procedure:</h4>
                    <EditableList
                      items={curriculumData.experiment.procedure}
                      pathPrefix={['experiment', 'procedure']}
                      placeholder="Enter procedure step..."
                      fieldIdPrefix="procedure"
                    />
                  </div>

                  <Card variant="gradient" className="border-success-200 dark:border-success-700">
                    <CardContent size="lg">
                      <h4 className="subtitle text-success-800 dark:text-success-200 mb-3">Expected Outcome:</h4>
                      <EditableField
                        fieldId="experiment-outcome"
                        value={curriculumData.experiment.expectedOutcome}
                        path={['experiment', 'expectedOutcome']}
                        placeholder="Describe the expected learning outcome..."
                        multiline={true}
                        className="body-text"
                      />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="opening" variant="card" className="space-y-8">
              <Card variant="feature">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
                      <Lightbulb size={20} className="text-warning-600 dark:text-warning-400" />
                    </div>
                    <CardTitle size="lg" className="text-warning-700 dark:text-warning-300">Curiosity Question & Answer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-3">Question for Students:</h4>
                    <EditableField
                      fieldId="curiosity-question"
                      value={curriculumData.openingRemarks.curiosityQuestion}
                      path={['openingRemarks', 'curiosityQuestion']}
                      placeholder="Enter curiosity question..."
                      multiline={true}
                      className="italic bg-warning-25 dark:bg-warning-950 p-4 rounded-lg border-l-4 border-warning-500"
                    />
                  </div>
                  <div>
                    <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-3">Answer Guide for Teacher:</h4>
                    <EditableField
                      fieldId="curiosity-answer"
                      value={curriculumData.openingRemarks.curiosityAnswer}
                      path={['openingRemarks', 'curiosityAnswer']}
                      placeholder="Enter answer explanation..."
                      multiline={true}
                      className="body-text bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card variant="interactive" className="border-warning-200 dark:border-warning-700">
                  <CardHeader>
                    <CardTitle className="text-warning-700 dark:text-warning-300">Fun Fact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditableField
                      fieldId="fun-fact"
                      value={curriculumData.openingRemarks.funFact}
                      path={['openingRemarks', 'funFact']}
                      placeholder="Enter interesting fun fact..."
                      multiline={true}
                      className="body-text"
                    />
                  </CardContent>
                </Card>

                <Card variant="interactive" className="border-blueberry-200 dark:border-blueberry-700">
                  <CardHeader>
                    <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Related Story</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditableField
                      fieldId="related-story"
                      value={curriculumData.openingRemarks.relatedStory}
                      path={['openingRemarks', 'relatedStory']}
                      placeholder="Enter related story..."
                      multiline={true}
                      className="body-text"
                    />
                  </CardContent>
                </Card>

                <Card variant="interactive" className="border-success-200 dark:border-success-700">
                  <CardHeader>
                    <CardTitle className="text-success-700 dark:text-success-300">Industry Connection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditableField
                      fieldId="industry-connection"
                      value={curriculumData.openingRemarks.industryConnection}
                      path={['openingRemarks', 'industryConnection']}
                      placeholder="Enter industry connection..."
                      multiline={true}
                      className="body-text"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="resources" variant="card" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Reading Materials */}
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
                    {curriculumData.postLectureResources.readingMaterials.map((material, index) => (
                      <Card key={index} variant="ghost" className="p-4 hover:bg-blueberry-25 dark:hover:bg-blueberry-950 transition-colors">
                        <div className="space-y-3">
                          <EditableField
                            fieldId={`reading-material-title-${index}`}
                            value={material.title}
                            path={['postLectureResources', 'readingMaterials', index.toString(), 'title']}
                            placeholder="Resource title..."
                            className="subtitle"
                          />
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" size="sm">{material.type}</Badge>
                            <Badge variant="secondary" size="sm">{material.difficulty}</Badge>
                          </div>
                          <EditableField
                            fieldId={`reading-material-url-${index}`}
                            value={material.url || ''}
                            path={['postLectureResources', 'readingMaterials', index.toString(), 'url']}
                            placeholder="URL (optional)..."
                            className="body-text text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Video Resources */}
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
                    {curriculumData.postLectureResources.videoResources.map((video, index) => (
                      <Card key={index} variant="ghost" className="p-4 hover:bg-error-25 dark:hover:bg-error-950 transition-colors">
                        <div className="space-y-3">
                          <EditableField
                            fieldId={`video-title-${index}`}
                            value={video.title}
                            path={['postLectureResources', 'videoResources', index.toString(), 'title']}
                            placeholder="Video title..."
                            className="subtitle"
                          />
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" size="sm">{video.platform}</Badge>
                            <Badge variant="secondary" size="sm">{video.duration}</Badge>
                          </div>
                          <EditableField
                            fieldId={`video-description-${index}`}
                            value={video.description}
                            path={['postLectureResources', 'videoResources', index.toString(), 'description']}
                            placeholder="Video description..."
                            multiline={true}
                            className="body-text text-sm"
                          />
                          <EditableField
                            fieldId={`video-url-${index}`}
                            value={video.url}
                            path={['postLectureResources', 'videoResources', index.toString(), 'url']}
                            placeholder="Video URL..."
                            className="body-text text-sm"
                          />
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                {/* Practice Exercises */}
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
                    {curriculumData.postLectureResources.practiceExercises.map((exercise, index) => (
                      <Card key={index} variant="ghost" className="p-4 hover:bg-success-25 dark:hover:bg-success-950 transition-colors">
                        <div className="space-y-3">
                          <EditableField
                            fieldId={`exercise-title-${index}`}
                            value={exercise.title}
                            path={['postLectureResources', 'practiceExercises', index.toString(), 'title']}
                            placeholder="Exercise title..."
                            className="subtitle"
                          />
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" size="sm">{exercise.type}</Badge>
                            <Badge variant="secondary" size="sm">{exercise.estimatedTime}</Badge>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="overline text-neutral-700 dark:text-neutral-300 mb-1 block">Description:</label>
                              <EditableField
                                fieldId={`exercise-description-${index}`}
                                value={exercise.description}
                                path={['postLectureResources', 'practiceExercises', index.toString(), 'description']}
                                placeholder="Exercise description..."
                                multiline={true}
                                className="body-text text-sm"
                              />
                            </div>
                            <div>
                              <label className="overline text-neutral-700 dark:text-neutral-300 mb-1 block">Learning Objective:</label>
                              <EditableField
                                fieldId={`exercise-objective-${index}`}
                                value={exercise.learningObjective}
                                path={['postLectureResources', 'practiceExercises', index.toString(), 'learningObjective']}
                                placeholder="Learning objective..."
                                multiline={true}
                                className="body-text text-sm"
                              />
                            </div>
                            <div>
                              <label className="overline text-neutral-700 dark:text-neutral-300 mb-1 block">Expected Outcome:</label>
                              <EditableField
                                fieldId={`exercise-outcome-${index}`}
                                value={exercise.expectedOutcome}
                                path={['postLectureResources', 'practiceExercises', index.toString(), 'expectedOutcome']}
                                placeholder="Expected outcome..."
                                multiline={true}
                                className="body-text text-sm"
                              />
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
      </div>
    </div>
  );
}
