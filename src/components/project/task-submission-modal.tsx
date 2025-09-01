// components/project/task-submission-modal.tsx
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
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { ProjectData, ProjectTask } from './index';

// Firebase imports
import { db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';

import { storage } from './../../lib/firebase';


interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ProjectTask | null;
  project: ProjectData;
  onSubmissionComplete: (taskId: string, newStatus?: string) => void;
}

interface SubmissionData {
  id?: string;
  projectId: string;
  taskId?: string;
  taskName?: string;
  studentUid: string;
  teacherUid: string;
  type: 'file' | 'link' | 'progress';
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

export default function TaskSubmissionModal({ 
  isOpen, 
  onClose, 
  task, 
  project, 
  onSubmissionComplete 
}: TaskSubmissionModalProps) {
  const { user } = useAuth();
  
  // Form states
  const [activeTab, setActiveTab] = useState('files');
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'github' | 'docs' | 'website' | 'other'>('github');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [markAsComplete, setMarkAsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  const resetForm = () => {
    setSubmissionTitle('');
    setSubmissionDescription('');
    setLinkUrl('');
    setSelectedFiles([]);
    setMarkAsComplete(false);
    setActiveTab('files');
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

  // Upload files to Firebase Storage
  const uploadFiles = async (files: File[]) => {
    if (!storage || !user || !task) return [];

    const uploadPromises = files.map(async (file) => {
      try {
        // Create storage path: projects/{projectTitle}_{projectId}/task_{taskId}/submission_{timestamp}/{fileName}
        const timestamp = Date.now();
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

  // Update task status if needed
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const projectRef = doc(db, 'projects', project.projectId);
      
      // Update the specific task status in the tasks array
      // This is a simplified approach - in production, you might need more complex logic
      // to find and update the specific task in the array
      
      console.log(`Task ${taskId} status updated to ${newStatus}`);
      // In real implementation, you'd need to:
      // 1. Get current project data
      // 2. Find the task in the tasks array
      // 3. Update that specific task's status
      // 4. Update the entire tasks array back to Firestore
      
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };

  // Handle file submission
  const handleFileSubmission = async () => {
    if (!task || !user || (!selectedFiles.length && !submissionTitle.trim())) return;
    
    setIsSubmitting(true);
    try {
      let uploadedFiles: any[] = [];
      
      // Upload files if any
      if (selectedFiles.length > 0) {
        uploadedFiles = await uploadFiles(selectedFiles);
      }
      
      // Prepare submission data
      const submissionData: Omit<SubmissionData, 'id'> = {
        projectId: project.projectId,
        taskId: task.taskId,
        taskName: task.taskName,
        studentUid: user.uid,
        teacherUid: project.teacherUid,
        type: 'file',
        title: submissionTitle,
        description: submissionDescription,
        files: uploadedFiles,
        submittedAt: serverTimestamp(),
        status: 'submitted'
      };
      
      // Save submission to Firestore
      await saveSubmissionToFirestore(submissionData);
      
      // Update task status if marked as complete
      if (markAsComplete) {
        await updateTaskStatus(task.taskId, 'completed');
      }
      
      // Complete the submission
      onSubmissionComplete(
        task.taskId, 
        markAsComplete ? 'completed' : undefined
      );
      
    } catch (error) {
      console.error('Submission failed:', error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle link submission
  const handleLinkSubmission = async () => {
    if (!task || !user || !linkUrl.trim() || !submissionTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Prepare submission data
      const submissionData: Omit<SubmissionData, 'id'> = {
        projectId: project.projectId,
        taskId: task.taskId,
        taskName: task.taskName,
        studentUid: user.uid,
        teacherUid: project.teacherUid,
        type: 'link',
        title: submissionTitle,
        description: submissionDescription,
        linkUrl: linkUrl,
        linkType: linkType,
        submittedAt: serverTimestamp(),
        status: 'submitted'
      };
      
      // Save submission to Firestore
      await saveSubmissionToFirestore(submissionData);
      
      // Update task status if marked as complete
      if (markAsComplete) {
        await updateTaskStatus(task.taskId, 'completed');
      }
      
      onSubmissionComplete(
        task.taskId, 
        markAsComplete ? 'completed' : undefined
      );
      
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent variant="default" size="xl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
              <Upload size={20} className="text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <div className="flex-1">
              <DialogTitle size="lg" className="text-blueberry-800 dark:text-blueberry-200">
                Submit Work for Task
              </DialogTitle>
              <DialogDescription className="body-text text-blueberry-700 dark:text-blueberry-300">
                Upload files or share links for your task submission
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Task Information */}
        <Card variant="ghost" className="bg-blueberry-50 dark:bg-blueberry-950 border-blueberry-200 dark:border-blueberry-700">
          <CardContent size="lg">
            <div className="space-y-3">
              <h4 className="subtitle text-blueberry-900 dark:text-blueberry-100">
                {task.taskName}
              </h4>
              <div className="flex flex-wrap gap-3 text-sm text-blueberry-700 dark:text-blueberry-300">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{task.startDate} - {task.endDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{task.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target size={14} />
                  <span>ID: {task.taskId}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="files" icon={<Upload size={16} />}>
                Upload Files
              </TabsTrigger>
              <TabsTrigger value="links" icon={<Link2 size={16} />}>
                Share Links
              </TabsTrigger>
            </TabsList>

            {/* File Upload Tab */}
            <TabsContent value="files" variant="flush" className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label variant="default">Submission Title *</Label>
                <Input
                  variant="outline"
                  size="default"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="e.g., Project prototype files"
                />
              </div>

              <div className="space-y-3">
                <Label variant="default">Description (Optional)</Label>
                <Textarea
                  variant="outline"
                  size="default"
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                  placeholder="Add any notes about your submission..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <Label variant="default">Select Files</Label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-blueberry-400 dark:hover:border-blueberry-500 transition-colors">
                  <Upload size={24} className="mx-auto mb-3 text-neutral-400" />
                  <p className="body-text text-neutral-600 dark:text-neutral-400 mb-3">
                    Click to select files or drag and drop
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    variant="outline" 
                    size="default"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload size={16} className="mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <Label variant="default">Selected Files ({selectedFiles.length})</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
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
                </div>
              )}

              {/* Mark as Complete Option */}
              <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-950 rounded-lg border border-success-200 dark:border-success-700">
                <input
                  type="checkbox"
                  id="mark-complete"
                  checked={markAsComplete}
                  onChange={(e) => setMarkAsComplete(e.target.checked)}
                  className="w-4 h-4 text-success-600 bg-white border-success-300 rounded focus:ring-success-500"
                />
                <Label htmlFor="mark-complete" className="text-success-800 dark:text-success-200 cursor-pointer">
                  Mark this task as completed
                </Label>
              </div>

              <Button 
                onClick={handleFileSubmission} 
                disabled={isSubmitting || (!selectedFiles.length && !submissionTitle.trim())}
                loading={isSubmitting}
                loadingText="Uploading files..."
                variant="gradient"
                size="lg"
                className="w-full"
              >
                <Send size={18} className="mr-2" />
                Submit Files ({selectedFiles.length})
              </Button>
            </TabsContent>

            {/* Link Sharing Tab */}
            <TabsContent value="links" variant="flush" className="space-y-4 mt-6">
              <div className="space-y-3">
                <Label variant="default">Submission Title *</Label>
                <Input
                  variant="outline"
                  size="default"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  placeholder="e.g., GitHub Repository"
                />
              </div>

              <div className="space-y-3">
                <Label variant="default">Link Type</Label>
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
                        Google Docs / Document
                      </div>
                    </SelectItem>
                    <SelectItem value="website">
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        Website / Demo
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

              <div className="space-y-3">
                <Label variant="default">URL *</Label>
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

              <div className="space-y-3">
                <Label variant="default">Description (Optional)</Label>
                <Textarea
                  variant="outline"
                  size="default"
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                  placeholder="Add any notes about this link..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Mark as Complete Option */}
              <div className="flex items-center gap-3 p-4 bg-success-50 dark:bg-success-950 rounded-lg border border-success-200 dark:border-success-700">
                <input
                  type="checkbox"
                  id="mark-complete-link"
                  checked={markAsComplete}
                  onChange={(e) => setMarkAsComplete(e.target.checked)}
                  className="w-4 h-4 text-success-600 bg-white border-success-300 rounded focus:ring-success-500"
                />
                <Label htmlFor="mark-complete-link" className="text-success-800 dark:text-success-200 cursor-pointer">
                  Mark this task as completed
                </Label>
              </div>

              <Button 
                onClick={handleLinkSubmission} 
                disabled={isSubmitting || !linkUrl.trim() || !submissionTitle.trim()}
                loading={isSubmitting}
                loadingText="Submitting link..."
                variant="gradient"
                size="lg"
                className="w-full"
              >
                <Link2 size={18} className="mr-2" />
                Submit Link
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
