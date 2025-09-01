"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Hourglass, Clock, Calendar, User, Target, AlertCircle, Send, TrendingUp, FileText, ExternalLink, Download, Users, Upload, Link2, CheckSquare, File, Github, Globe, FileImage, Archive, Trash2, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock data types (replace with your actual types)
interface ProjectTask {
  taskId: string;
  taskName: string;
  duration: string;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  arxivUrl: string;
  pdfUrl: string;
  categories: string[];
  subjects: string[];
  comments?: string;
  submittedDate: string;
}

interface ProjectSubmission {
  id: string;
  type: 'progress' | 'file' | 'link' | 'task';
  title: string;
  description?: string;
  submittedAt: Date;
  status: 'submitted' | 'reviewed' | 'approved' | 'needs-revision';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  linkUrl?: string;
  taskId?: string;
  feedback?: string;
}

export interface ProjectResources {
  papers?: ResearchPaper[];
}

interface StudentAssignedProjectDetailProps {
  project: {
    assignedProjectId: string;
    projectId: string;
    studentUid: string;
    studentName: string;
    teacherUid: string;
    assignedAt: Date;
    status: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    tasks?: ProjectTask[];
    resources?: ProjectResources;
    submissions?: ProjectSubmission[];
  };
  onBack: () => void;
}

export default function StudentAssignedProjectDetail({ project, onBack }: StudentAssignedProjectDetailProps) {
  // Form states
  const [progressText, setProgressText] = useState('');
  const [projectStatus, setProjectStatus] = useState<'on-track' | 'off-track' | ''>('');
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'github' | 'docs' | 'website' | 'other'>('github');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('progress');
  const [latestReport, setLatestReport] = useState<any>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Mock submissions data (replace with actual Firebase data)
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([
    {
      id: '1',
      type: 'progress',
      title: 'Week 2 Progress Update',
      description: 'Completed initial research and started on the prototype',
      submittedAt: new Date('2024-01-15'),
      status: 'reviewed'
    },
    {
      id: '2',
      type: 'file',
      title: 'Project Proposal Document',
      fileName: 'project_proposal.pdf',
      fileSize: 2048576,
      submittedAt: new Date('2024-01-10'),
      status: 'approved'
    },
    {
      id: '3',
      type: 'link',
      title: 'GitHub Repository',
      linkUrl: 'https://github.com/student/project-repo',
      submittedAt: new Date('2024-01-12'),
      status: 'submitted'
    }
  ]);

  // Helper functions
  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { variant: 'success' as const, icon: CheckCircle };
      case 'assigned':
        return { variant: 'soft-primary' as const, icon: BookOpen };
      case 'in-progress':
        return { variant: 'warning' as const, icon: Clock };
      default:
        return { variant: 'secondary' as const, icon: AlertCircle };
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success' as const;
      case 'medium':
        return 'warning' as const;
      case 'hard':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getSubmissionStatusBadge = (status: ProjectSubmission['status']) => {
    switch (status) {
      case 'approved':
        return { variant: 'success' as const, text: 'Approved' };
      case 'reviewed':
        return { variant: 'soft-primary' as const, text: 'Reviewed' };
      case 'needs-revision':
        return { variant: 'warning' as const, text: 'Needs Revision' };
      default:
        return { variant: 'secondary' as const, text: 'Submitted' };
    }
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

  // Submission handlers
  const handleProgressSubmit = async () => {
    if (!progressText.trim() || !projectStatus) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSubmission: ProjectSubmission = {
        id: Date.now().toString(),
        type: 'progress',
        title: `Progress Update - ${new Date().toLocaleDateString()}`,
        description: progressText,
        submittedAt: new Date(),
        status: 'submitted'
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      setProgressText('');
      setProjectStatus('');
      
      // Show success message (you can use your toast hook here)
      console.log('Progress report submitted successfully!');
    } catch (error) {
      console.error('Error submitting progress:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSubmit = async () => {
    if (selectedFiles.length === 0 || !submissionTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      for (const file of selectedFiles) {
        const newSubmission: ProjectSubmission = {
          id: Date.now().toString() + Math.random(),
          type: 'file',
          title: submissionTitle,
          description: submissionDescription,
          fileName: file.name,
          fileSize: file.size,
          submittedAt: new Date(),
          status: 'submitted'
        };
        
        setSubmissions(prev => [newSubmission, ...prev]);
      }
      
      setSelectedFiles([]);
      setSubmissionTitle('');
      setSubmissionDescription('');
      
      console.log('Files submitted successfully!');
    } catch (error) {
      console.error('Error submitting files:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkSubmit = async () => {
    if (!linkUrl.trim() || !submissionTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSubmission: ProjectSubmission = {
        id: Date.now().toString(),
        type: 'link',
        title: submissionTitle,
        description: submissionDescription,
        linkUrl: linkUrl,
        submittedAt: new Date(),
        status: 'submitted'
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      setLinkUrl('');
      setSubmissionTitle('');
      setSubmissionDescription('');
      
      console.log('Link submitted successfully!');
    } catch (error) {
      console.error('Error submitting link:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskCompletion = async () => {
    if (!selectedTaskId) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const task = project.tasks?.find(t => t.taskId === selectedTaskId);
      if (task) {
        const newSubmission: ProjectSubmission = {
          id: Date.now().toString(),
          type: 'task',
          title: `Task Completed: ${task.taskName}`,
          taskId: selectedTaskId,
          submittedAt: new Date(),
          status: 'submitted'
        };
        
        setSubmissions(prev => [newSubmission, ...prev]);
        setSelectedTaskId('');
        
        console.log('Task completion submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting task completion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const statusProps = getStatusBadgeProps(project.status);
  const StatusIcon = statusProps.icon;

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 max-w-6xl mx-auto bg-neutral-50 dark:bg-neutral-900">
      {/* Header Navigation */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={onBack} 
          variant="ghost" 
          size="default"
          className="text-blueberry-600 hover:text-blueberry-700 hover:bg-blueberry-50 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to My Projects
        </Button>
        <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-600" />
        <Badge variant="outline-primary" size="default">
          <User size={14} className="mr-1" />
          Project Details
        </Badge>
      </div>

      {/* Project Overview Card */}
      <Card variant="feature" className="shadow-2xl">
        <CardHeader size="lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <CardTitle size="xl" className="text-neutral-900 dark:text-neutral-100 mb-3">
                {project.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} className="text-neutral-500 dark:text-neutral-400" />
                <span className="body-text text-neutral-600 dark:text-neutral-400">
                  Assigned on: <span className="font-semibold text-blueberry-700 dark:text-blueberry-300">
                    {/* {project.assignedAt.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} */}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant={getDifficultyBadgeVariant(project.difficulty)} size="default">
                  <Target size={14} className="mr-1" />
                  {project.difficulty}
                </Badge>
                <Badge variant="outline" size="default">
                  <Clock size={14} className="mr-1" />
                  {project.duration}
                </Badge>
                <Badge variant={statusProps.variant} size="default">
                  <StatusIcon size={14} className="mr-1" />
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="subtitle text-neutral-900 dark:text-neutral-100 mb-3">Project Description</h3>
              <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                {project.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Papers Section */}
      {project.resources?.papers && project.resources.papers.length > 0 && (
        <Card variant="elevated" className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <CardTitle className="text-warning-700 dark:text-warning-300">Research Papers</CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                  Relevant research papers and resources for this project
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {project.resources.papers.map((paper, index) => (
                <Card key={paper.id || index} variant="ghost" className="border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-300">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="subtitle text-neutral-900 dark:text-neutral-100 leading-tight">
                          {paper.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Users size={14} className="text-neutral-500 dark:text-neutral-400" />
                          <span className="body-text text-neutral-600 dark:text-neutral-400 text-sm">
                            {paper.authors.join(', ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {paper.categories.map((category, idx) => (
                            <Badge key={idx} variant="outline" size="sm">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="overline text-neutral-700 dark:text-neutral-300">Abstract</h5>
                        <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                          {paper.abstract}
                        </p>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                        >
                          <ExternalLink size={14} className="mr-2" />
                          View on ArXiv
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                        >
                          <Download size={14} className="mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Plan Section */}
      <Card variant="elevated" className="shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <div>
              <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Project Plan</CardTitle>
              <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                Detailed task breakdown and timeline
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {project.tasks && project.tasks.length > 0 ? (
            <Card variant="ghost" className="border border-neutral-200 dark:border-neutral-700">
              <CardContent noPadding>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 dark:bg-neutral-800">
                        <TableHead className="subtitle text-neutral-900 dark:text-neutral-100">Task Name</TableHead>
                        <TableHead className="subtitle text-neutral-900 dark:text-neutral-100">Task ID</TableHead>
                        <TableHead className="subtitle text-neutral-900 dark:text-neutral-100">Duration</TableHead>
                        <TableHead className="subtitle text-neutral-900 dark:text-neutral-100">Start Date</TableHead>
                        <TableHead className="subtitle text-neutral-900 dark:text-neutral-100 text-right">End Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.tasks.map((task, index) => (
                        <TableRow key={task.taskId || index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                          <TableCell className="body-text text-neutral-800 dark:text-neutral-200 font-medium">{task.taskName}</TableCell>
                          <TableCell className="body-text text-neutral-600 dark:text-neutral-400">{task.taskId}</TableCell>
                          <TableCell className="body-text text-neutral-600 dark:text-neutral-400">{task.duration}</TableCell>
                          <TableCell className="body-text text-neutral-600 dark:text-neutral-400">{task.startDate}</TableCell>
                          <TableCell className="body-text text-neutral-600 dark:text-neutral-400 text-right">{task.endDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card variant="ghost" className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target size={32} className="text-neutral-400 dark:text-neutral-500" />
                </div>
                <p className="body-text text-neutral-500 dark:text-neutral-400">
                  No detailed plan available for this project.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Project Updates & Submissions Section */}
      <Card variant="feature" className="shadow-2xl border-blueberry-200 dark:border-blueberry-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blueberry-500 to-blueberry-600 rounded-xl flex items-center justify-center shadow-lg">
              <Send size={24} className="text-white" />
            </div>
            <div>
              <CardTitle size="lg" className="text-blueberry-800 dark:text-blueberry-200">Project Updates & Submissions</CardTitle>
              <CardDescription className="body-text text-blueberry-700 dark:text-blueberry-300">
                Submit progress updates, files, links, and mark tasks as completed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="pills">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress" icon={<TrendingUp size={16} />}>
                Progress Report
              </TabsTrigger>
              <TabsTrigger value="files" icon={<Upload size={16} />}>
                File Upload
              </TabsTrigger>
              <TabsTrigger value="links" icon={<Link2 size={16} />}>
                Link Submission
              </TabsTrigger>
              <TabsTrigger value="tasks" icon={<CheckSquare size={16} />}>
                Task Completion
              </TabsTrigger>
            </TabsList>

            {/* Progress Report Tab */}
            <TabsContent value="progress" variant="padded">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Describe your progress and any challenges:
                  </Label>
                  <Textarea
                    variant="outline"
                    size="lg"
                    value={progressText}
                    onChange={(e) => setProgressText(e.target.value)}
                    placeholder="Enter your status update, challenges faced, accomplishments, and next steps..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Project Status:
                  </Label>
                  <Select value={projectStatus} onValueChange={setProjectStatus}>
                    <SelectTrigger variant="outline" size="lg">
                      <SelectValue placeholder="Select your current project status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-track">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-success-500 rounded-full" />
                          On Track - Meeting deadlines and objectives
                        </div>
                      </SelectItem>
                      <SelectItem value="off-track">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-error-500 rounded-full" />
                          Off Track - Facing challenges or delays
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleProgressSubmit} 
                  disabled={isSubmitting || !progressText.trim() || !projectStatus}
                  loading={isSubmitting}
                  loadingText="Submitting progress report..."
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  <Send size={18} className="mr-2" />
                  Submit Progress Report
                </Button>
              </div>
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="files" variant="padded">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Submission Title:
                  </Label>
                  <Input
                    variant="outline"
                    size="lg"
                    value={submissionTitle}
                    onChange={(e) => setSubmissionTitle(e.target.value)}
                    placeholder="Enter a title for your submission..."
                  />
                </div>

                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Description (Optional):
                  </Label>
                  <Textarea
                    variant="outline"
                    size="default"
                    value={submissionDescription}
                    onChange={(e) => setSubmissionDescription(e.target.value)}
                    placeholder="Add any additional context or notes..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Select Files:
                  </Label>
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center hover:border-blueberry-400 dark:hover:border-blueberry-500 transition-colors">
                    <Upload size={32} className="mx-auto mb-4 text-neutral-400" />
                    <p className="body-text text-neutral-600 dark:text-neutral-400 mb-4">
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

                {/* Selected Files Display */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <Label variant="default" size="default">
                      Selected Files ({selectedFiles.length}):
                    </Label>
                    <div className="space-y-2">
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
                            className="text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleFileSubmit} 
                  disabled={isSubmitting || selectedFiles.length === 0 || !submissionTitle.trim()}
                  loading={isSubmitting}
                  loadingText="Uploading files..."
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  <Upload size={18} className="mr-2" />
                  Upload Files ({selectedFiles.length})
                </Button>
              </div>
            </TabsContent>

            {/* Link Submission Tab */}
            <TabsContent value="links" variant="padded">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Submission Title:
                  </Label>
                  <Input
                    variant="outline"
                    size="lg"
                    value={submissionTitle}
                    onChange={(e) => setSubmissionTitle(e.target.value)}
                    placeholder="Enter a title for your submission..."
                  />
                </div>

                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Link Type:
                  </Label>
                  <Select value={linkType} onValueChange={setLinkType}>
                    <SelectTrigger variant="outline" size="lg">
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
                  <Label variant="default" size="default">
                    URL:
                  </Label>
                  <Input
                    variant="outline"
                    size="lg"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    leftIcon={getLinkIcon(linkType)}
                  />
                </div>

                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Description (Optional):
                  </Label>
                  <Textarea
                    variant="outline"
                    size="default"
                    value={submissionDescription}
                    onChange={(e) => setSubmissionDescription(e.target.value)}
                    placeholder="Add any additional context or notes about this link..."
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  onClick={handleLinkSubmit} 
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
              </div>
            </TabsContent>

            {/* Task Completion Tab */}
            <TabsContent value="tasks" variant="padded">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label variant="default" size="default">
                    Select Completed Task:
                  </Label>
                  <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                    <SelectTrigger variant="outline" size="lg">
                      <SelectValue placeholder="Choose a task to mark as completed" />
                    </SelectTrigger>
                    <SelectContent>
                      {project.tasks?.map((task) => (
                        <SelectItem key={task.taskId} value={task.taskId}>
                          <div className="flex items-center gap-2">
                            <CheckSquare size={16} />
                            <div>
                              <p className="font-medium">{task.taskName}</p>
                              <p className="text-xs text-neutral-500">
                                {task.startDate} - {task.endDate}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTaskId && (
                  <Card variant="ghost" className="bg-blueberry-50 dark:bg-blueberry-950 border-blueberry-200 dark:border-blueberry-700">
                    <CardContent>
                      {(() => {
                        const task = project.tasks?.find(t => t.taskId === selectedTaskId);
                        return task ? (
                          <div className="space-y-2">
                            <h4 className="subtitle text-blueberry-800 dark:text-blueberry-200">
                              {task.taskName}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-blueberry-700 dark:text-blueberry-300">
                              <span>Duration: {task.duration}</span>
                              <span>•</span>
                              <span>ID: {task.taskId}</span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>
                )}

                <Button 
                  onClick={handleTaskCompletion} 
                  disabled={isSubmitting || !selectedTaskId}
                  loading={isSubmitting}
                  loadingText="Marking task complete..."
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Mark Task as Completed
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submission History Section */}
      <Card variant="elevated" className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                <CalendarIcon size={20} className="text-success-600 dark:text-success-400" />
              </div>
              <div>
                <CardTitle className="text-success-700 dark:text-success-300">Submission History</CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                  Your previous submissions and their status
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" size="default">
              {submissions.length} submissions
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const statusBadge = getSubmissionStatusBadge(submission.status);
                return (
                  <Card key={submission.id} variant="ghost" className="border border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all duration-200">
                    <CardContent>
                      <div className="flex items-start gap-4">
                        {/* Submission Type Icon */}
                        <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          {submission.type === 'progress' && <TrendingUp size={20} className="text-blueberry-600 dark:text-blueberry-400" />}
                          {submission.type === 'file' && <FileText size={20} className="text-warning-600 dark:text-warning-400" />}
                          {submission.type === 'link' && <Link2 size={20} className="text-success-600 dark:text-success-400" />}
                          {submission.type === 'task' && <CheckSquare size={20} className="text-error-600 dark:text-error-400" />}
                        </div>

                        {/* Submission Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="subtitle text-neutral-900 dark:text-neutral-100 truncate">
                              {submission.title}
                            </h4>
                            <Badge variant={statusBadge.variant} size="sm">
                              {statusBadge.text}
                            </Badge>
                          </div>

                          {submission.description && (
                            <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">
                              {submission.description}
                            </p>
                          )}

                          {/* Submission-specific details */}
                          {submission.type === 'file' && submission.fileName && (
                            <div className="flex items-center gap-2 mb-3">
                              {getFileIcon(submission.fileName)}
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {submission.fileName}
                                {submission.fileSize && ` (${formatFileSize(submission.fileSize)})`}
                              </span>
                            </div>
                          )}

                          {submission.type === 'link' && submission.linkUrl && (
                            <div className="flex items-center gap-2 mb-3">
                              <Link2 size={14} className="text-neutral-500" />
                              <a 
                                href={submission.linkUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blueberry-600 dark:text-blueberry-400 hover:underline truncate"
                              >
                                {submission.linkUrl}
                              </a>
                            </div>
                          )}

                          {submission.type === 'task' && submission.taskId && (
                            <div className="flex items-center gap-2 mb-3">
                              <CheckSquare size={14} className="text-neutral-500" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                Task ID: {submission.taskId}
                              </span>
                            </div>
                          )}

                          {/* Submission footer */}
                          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                            <span>
                              Submitted on {submission.submittedAt.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <div className="flex items-center gap-2">
                              {submission.type === 'file' && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <Eye size={12} className="mr-1" />
                                  View
                                </Button>
                              )}
                              {submission.type === 'link' && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <ExternalLink size={12} className="mr-1" />
                                  Open
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Feedback section */}
                          {submission.feedback && (
                            <div className="mt-3 p-3 bg-blueberry-50 dark:bg-blueberry-950 rounded-lg border border-blueberry-200 dark:border-blueberry-700">
                              <h5 className="overline text-blueberry-700 dark:text-blueberry-300 mb-1">
                                Teacher Feedback:
                              </h5>
                              <p className="text-sm text-blueberry-800 dark:text-blueberry-200">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="ghost" className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon size={32} className="text-neutral-400 dark:text-neutral-500" />
                </div>
                <p className="body-text text-neutral-500 dark:text-neutral-400">
                  No submissions yet. Submit your first update above!
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <Card variant="ghost" className="border-none">
        <CardContent className="flex justify-center">
          <Button 
            onClick={onBack} 
            variant="outline" 
            size="lg"
            className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to My Projects
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}