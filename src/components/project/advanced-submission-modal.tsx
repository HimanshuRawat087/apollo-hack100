// components/project/advanced-submission-modal.tsx
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  Link2, 
  File, 
  FileText, 
  FileImage, 
  Archive, 
  Trash2, 
  Send, 
  CheckCircle, 
  Github, 
  Globe,
  X,
  Plus,
  CheckSquare
} from 'lucide-react';
import { ProjectData } from './index';

// Firebase imports
import { db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';
import { storage } from './../../lib/firebase';


interface AdvancedSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectData;
  onSubmissionComplete: (submissionData: any) => void;
}

interface SubmissionData {
  id?: string;
  projectId: string;
  taskIds?: string[];
  studentUid: string;
  teacherUid: string;
  type: 'file' | 'link' | 'mixed';
  title: string;
  description?: string;
  files?: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }[];
  linkUrl?: string;
  linkType?: string;
  submittedAt: any;
  status: 'submitted' | 'reviewed' | 'approved' | 'needs-revision';
}

export default function AdvancedSubmissionModal({ 
  isOpen, 
  onClose, 
  project, 
  onSubmissionComplete 
}: AdvancedSubmissionModalProps) {
  const { user } = useAuth();
  
  // Form states
  const [activeTab, setActiveTab] = useState('general');
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'github' | 'docs' | 'website' | 'other'>('github');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  const resetForm = () => {
    setSubmissionTitle('');
    setSubmissionDescription('');
    setSelectedTaskIds([]);
    setLinkUrl('');
    setSelectedFiles([]);
    setActiveTab('general');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // File handling
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-error-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-4 w-4 text-warning-600" />;
      case 'zip':
      case 'rar':
        return <Archive className="h-4 w-4 text-neutral-600" />;
      default:
        return <File className="h-4 w-4 text-blueberry-600" />;
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'docs':
        return <FileText className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      default:
        return <Link2 className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle task selection
  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Upload files to Firebase Storage
  const uploadFiles = async (files: File[]) => {
    if (!storage || !user) return [];

    const uploadPromises = files.map(async (file) => {
      try {
        const storagePath = `projects/${project.title}_${project.projectId}/${file.name}`;
        const storageRef = ref(storage, storagePath);
        
        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
          fileName: file.name,
          fileUrl: downloadURL,
          fileSize: file.size,
        };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  // Save submission to Firestore
  const saveSubmissionToFirestore = async (submissionData: Omit<SubmissionData, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'submissions'), submissionData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving submission to Firestore:', error);
      throw error;
    }
  };

  // Submission handler
  const handleSubmit = async () => {
    if (!submissionTitle.trim() || !user) return;
    
    setIsSubmitting(true);
    try {
      let uploadedFiles: any[] = [];
      
      // Upload files if any
      if (selectedFiles.length > 0) {
        uploadedFiles = await uploadFiles(selectedFiles);
      }
      
      // Determine submission type
      let submissionType: 'file' | 'link' | 'mixed' = 'file';
      if (uploadedFiles.length > 0 && linkUrl.trim()) {
        submissionType = 'mixed';
      } else if (linkUrl.trim()) {
        submissionType = 'link';
      }
      
      // Prepare submission data
      const submissionData: Omit<SubmissionData, 'id'> = {
        projectId: project.projectId,
        taskIds: selectedTaskIds.length > 0 ? selectedTaskIds : [],
        studentUid: user.uid,
        teacherUid: project.teacherUid,
        type: submissionType,
        title: submissionTitle,
        description: submissionDescription,
        files: uploadedFiles.length > 0 ? uploadedFiles : [],
        linkUrl: linkUrl.trim() || "",
        linkType: linkUrl.trim() ? linkType : "",
        submittedAt: serverTimestamp(),
        status: 'submitted'
      };
      
      // Save submission to Firestore
      const submissionId = await saveSubmissionToFirestore(submissionData);
      
      // Call completion callback
      onSubmissionComplete({
        ...submissionData,
        id: submissionId
      });
      
    } catch (error) {
      console.error('Submission failed:', error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = submissionTitle.trim() && (selectedFiles.length > 0 || linkUrl.trim()) && selectedTaskIds.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="xl" className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plus size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle size="lg" className="text-blueberry-800 dark:text-blueberry-200">
                Advanced Project Submission
              </DialogTitle>
              <DialogDescription className="body-text text-blueberry-700 dark:text-blueberry-300">
                Submit comprehensive work for multiple tasks with detailed documentation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Submission Form */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" icon={<FileText size={16} />}>
                General Info
              </TabsTrigger>
              <TabsTrigger value="files" icon={<Upload size={16} />}>
                Files & Links
              </TabsTrigger>
              <TabsTrigger value="tasks" icon={<CheckSquare size={16} />}>
                Task Assignment
              </TabsTrigger>
            </TabsList>

            {/* General Information Tab */}
            <TabsContent value="general" variant="flush" className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label variant="default">Submission Title *</Label>
                <Input
                  variant="outline"
                  size="lg"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="e.g., Final Project Deliverables"
                />
              </div>

              <div className="space-y-3">
                <Label variant="default">Detailed Description</Label>
                <Textarea
                  variant="outline"
                  size="lg"
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                  placeholder="Provide a comprehensive description of your submission, including what you've accomplished, challenges faced, and next steps..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Project Context */}
              <Card variant="ghost" className="bg-blueberry-50 dark:bg-blueberry-950 border-blueberry-200 dark:border-blueberry-700">
                <CardContent size="lg">
                  <div className="space-y-2">
                    <h4 className="subtitle text-blueberry-900 dark:text-blueberry-100">
                      Project: {project.title}
                    </h4>
                    <p className="body-text text-blueberry-700 dark:text-blueberry-300 text-sm line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Badge variant="outline" size="sm">{project.difficulty}</Badge>
                      <Badge variant="outline" size="sm">{project.duration}</Badge>
                      <Badge variant="outline" size="sm">{project.tasks?.length || 0} tasks</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Files & Links Tab */}
            <TabsContent value="files" variant="flush" className="space-y-6 mt-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label variant="default">File Uploads</Label>
                  <Badge variant="outline" size="sm">
                    {selectedFiles.length} files selected
                  </Badge>
                </div>
                
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center hover:border-blueberry-400 dark:hover:border-blueberry-500 transition-colors">
                  <Upload size={32} className="mx-auto mb-4 text-neutral-400" />
                  <p className="body-text text-neutral-600 dark:text-neutral-400 mb-4">
                    Drop files here or click to select multiple files
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="advanced-file-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="default"
                    onClick={() => document.getElementById('advanced-file-upload')?.click()}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose Files
                  </Button>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                          <p className="body-text font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950 h-8 w-8 p-0"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Link Section */}
              <div className="space-y-4">
                <Label variant="default">Related Link (Optional)</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="body-text font-medium text-neutral-700 dark:text-neutral-300 text-sm">Link Type</label>
                    <Select value={linkType} onValueChange={setLinkType}>
                      <SelectTrigger variant="outline" size="default">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="github">
                          <div className="flex items-center gap-2">
                            <Github size={16} />
                            GitHub Repository
                          </div>
                        </SelectItem>
                        <SelectItem value="docs">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            Google Docs
                          </div>
                        </SelectItem>
                        <SelectItem value="website">
                          <div className="flex items-center gap-2">
                            <Globe size={16} />
                            Website/Demo
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <Link2 size={16} />
                            Other Link
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-2">
                    <label className="body-text font-medium text-neutral-700 dark:text-neutral-300 text-sm">URL</label>
                    <Input
                      variant="outline"
                      size="default"
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      leftIcon={getLinkIcon(linkType)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Task Assignment Tab */}
            <TabsContent value="tasks" variant="flush" className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label variant="default">Related Tasks (Optional)</Label>
                <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm">
                  Select which project tasks this submission relates to
                </p>
              </div>

              {project.tasks && project.tasks.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {project.tasks.map((task) => (
                    <Card 
                      key={task.taskId}
                      variant="ghost" 
                      className={`border cursor-pointer transition-all duration-200 ${
                        selectedTaskIds.includes(task.taskId)
                          ? 'border-blueberry-300 bg-blueberry-50 dark:border-blueberry-600 dark:bg-blueberry-950'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                      onClick={() => toggleTaskSelection(task.taskId)}
                    >
                      <CardContent size="lg">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              selectedTaskIds.includes(task.taskId)
                                ? 'border-blueberry-500 bg-blueberry-500'
                                : 'border-neutral-300 dark:border-neutral-600'
                            }`}>
                              {selectedTaskIds.includes(task.taskId) && (
                                <CheckCircle size={12} className="text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-1">
                              {task.taskName}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                              <span>ID: {task.taskId}</span>
                              <span>Duration: {task.duration}</span>
                              <span>{task.startDate} - {task.endDate}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="ghost" className="text-center py-12">
                  <CardContent>
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckSquare size={24} className="text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <p className="body-text text-neutral-500 dark:text-neutral-400">
                      No tasks available for this project.
                    </p>
                  </CardContent>
                </Card>
              )}

              {selectedTaskIds.length > 0 && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2">
                    <Badge variant="soft-primary" size="default">
                      {selectedTaskIds.length} task{selectedTaskIds.length !== 1 ? 's' : ''} selected
                    </Badge>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {!canSubmit && "Please add a title and at least one file or link to submit"}
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!canSubmit || isSubmitting}
                loading={isSubmitting}
                loadingText="Uploading and saving..."
                variant="gradient"
                size="lg"
              >
                <Send size={18} className="mr-2" />
                Submit Advanced Submission
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
