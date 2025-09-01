// components/project/project-submissions.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Send, 
  FileText, 
  Upload, 
  Link2, 
  CheckSquare, 
  Calendar, 
  Search, 
  Eye, 
  ExternalLink, 
  Download,
  TrendingUp,
  Users,
  Clock,
  Plus,
  BarChart3,
  Github,
  Globe
} from 'lucide-react';
import { ProjectData } from './index';
import { format } from 'date-fns';
import AdvancedSubmissionModal from './advanced-submission-modal';
import React from 'react';

// Firebase imports
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';

interface ProjectSubmissionsProps {
  project: ProjectData;
  userRole: 'student' | 'teacher';
}

// Real submission interface matching Firebase structure
interface Submission {
  id: string;
  projectId: string;
  taskId?: string;           // Single task (legacy/simple submissions)
  taskIds?: string[];        // Multiple tasks (from advanced submission modal)
  taskName?: string;         // Legacy field
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
  linkType?: 'github' | 'docs' | 'website' | 'other';
  submittedAt: Timestamp;
  status: 'submitted' | 'reviewed' | 'approved' | 'needs-revision';
}

export default function ProjectSubmissions({ project, userRole }: ProjectSubmissionsProps) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all-submissions');
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // Fetch submissions using simple query (same pattern as overview)
  const fetchSubmissions = useCallback(async () => {
    if (!project.projectId || !user || !db) return;

    setLoading(true);
    setError(null);
    
    try {
      // Simple query - only WHERE clause (no ORDER BY to avoid index requirement)
      const submissionsRef = collection(db, 'submissions');
      const submissionQuery = query(submissionsRef, where('projectId', '==', project.projectId));
      const submissionSnapshot = await getDocs(submissionQuery);

      if (submissionSnapshot.empty) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      // Get submission data
      const submissionData = submissionSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Submission[];
      
      // Sort by submission date in JavaScript (newest first) 
      submissionData.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setSubmissions(submissionData);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [project.projectId, user, db]);

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Handle new submission
  const handleNewSubmission = () => {
    setIsAdvancedModalOpen(true);
  };

  const handleAdvancedSubmissionComplete = (submissionData: any) => {
    setIsAdvancedModalOpen(false);
    // Refresh submissions after new submission
    fetchSubmissions();
  };

  // Filter submissions based on search and filters
  const handleFilterChange = () => {
    let filtered = submissions.filter(submission => {
      const matchesSearch = submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           submission.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           submission.taskName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
      const matchesType = typeFilter === 'all' || submission.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredSubmissions(filtered);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    handleFilterChange();
  }, [searchQuery, statusFilter, typeFilter, submissions]);

  // Helper functions
  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <Upload className="h-4 w-4" />;
      case 'link':
        return <Link2 className="h-4 w-4" />;
      case 'mixed':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getLinkIcon = (linkType?: string) => {
    switch (linkType) {
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

  const getStatusBadge = (status: string) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
      return 'Invalid date';
    }
    try {
      return format(timestamp.toDate(), 'MMM d, yyyy \'at\' h:mm a');
    } catch (err) {
      return 'Invalid date';
    }
  };

  const getTotalFileSize = (files?: {fileName: string; fileUrl: string; fileSize: number}[]) => {
    if (!files || files.length === 0) return 0;
    return files.reduce((total, file) => total + file.fileSize, 0);
  };

  // Statistics
  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'approved').length,
    pending: submissions.filter(s => s.status === 'submitted').length,
    needsRevision: submissions.filter(s => s.status === 'needs-revision').length,
    files: submissions.filter(s => s.type === 'file' || s.type === 'mixed').length,
    links: submissions.filter(s => s.type === 'link' || s.type === 'mixed').length
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Card variant="elevated" className="shadow-xl">
          <CardContent className="flex items-center justify-center py-16">
            <LoadingSpinner 
              size="lg" 
              label="Loading submissions..." 
              showLabel 
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <Card variant="elevated" className="shadow-xl border-error-200 dark:border-error-700">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-error-100 dark:bg-error-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-error-600 dark:text-error-400" />
            </div>
            <h3 className="heading-3 text-error-800 dark:text-error-200 mb-2">Error Loading Submissions</h3>
            <p className="body-text text-error-700 dark:text-error-300 mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="default"
              onClick={() => {
                setError(null);
                fetchSubmissions();
              }}
              className="border-error-300 text-error-700 hover:bg-error-50 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-950"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Submissions Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Send size={24} className="text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">{stats.total}</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Total Submissions</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckSquare size={24} className="text-success-600 dark:text-success-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-success-600 dark:text-success-400">{stats.approved}</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Approved</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Clock size={24} className="text-warning-600 dark:text-warning-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-warning-600 dark:text-warning-400">{stats.pending}</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Pending Review</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText size={24} className="text-error-600 dark:text-error-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-error-600 dark:text-error-400">{stats.needsRevision}</div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Needs Revision</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Submissions Interface */}
      <Card variant="elevated" className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-blueberry-600 dark:text-blueberry-400" />
              </div>
              <div>
                <CardTitle className="text-blueberry-700 dark:text-blueberry-300">
                  {userRole === 'student' ? 'My Submissions' : 'Student Submissions'}
                </CardTitle>
                <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                  {userRole === 'student' 
                    ? 'Manage and track all your project submissions'
                    : 'Review and provide feedback on student submissions'
                  }
                </CardDescription>
              </div>
            </div>
            {userRole === 'student' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNewSubmission}
                className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
              >
                <Plus size={16} className="mr-2" />
                New Submission
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all-submissions" icon={<Send size={16} />}>
                All Submissions ({submissions.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" icon={<BarChart3 size={16} />}>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="advanced-form" icon={<Plus size={16} />}>
                {userRole === 'student' ? 'Advanced Submit' : 'Bulk Actions'}
              </TabsTrigger>
            </TabsList>

            {/* All Submissions Tab */}
            <TabsContent value="all-submissions" variant="flush" className="space-y-6 mt-6">
              {/* Search and Filter Controls */}
              <Card variant="ghost" className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                <CardContent size="lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Search</label>
                      <Input
                        variant="outline"
                        size="default"
                        placeholder="Search submissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search size={16} />}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger variant="outline" size="default">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="needs-revision">Needs Revision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Type</label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger variant="outline" size="default">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="file">File Uploads</SelectItem>
                          <SelectItem value="link">Link Submissions</SelectItem>
                          <SelectItem value="mixed">Files + Links</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="body-text font-medium text-neutral-700 dark:text-neutral-300">Results</label>
                      <div className="h-10 flex items-center">
                        <Badge variant="outline" size="default">
                          {filteredSubmissions.length} of {submissions.length} submissions
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submissions List */}
              <div className="space-y-6">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => {
                    const statusBadge = getStatusBadge(submission.status);
                    const fileCount = submission.files?.length || 0;
                    const totalFileSize = getTotalFileSize(submission.files);
                    
                    // Handle both taskId (single) and taskIds (array) from advanced submission
                    const taskIds = submission.taskIds || (submission.taskId ? [submission.taskId] : []);
                    const relatedTasks = project.tasks?.filter(task => taskIds.includes(task.taskId)) || [];
                    
                    return (
                      <Card 
                        key={submission.id} 
                        variant="default" 
                        className="border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200"
                      >
                        <CardContent size="lg" className='pt-6'>
                          <div className="space-y-6">
                            {/* Header Section */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                  {getSubmissionIcon(submission.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-2">
                                    {submission.title}
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                    <div className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      <span>{formatTimestamp(submission.submittedAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users size={14} />
                                      <span>
                                        {userRole === 'student' ? 'My Submission' : project.studentName}
                                      </span>
                                    </div>
                                  </div>
                                  {submission.description && (
                                    <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                      {submission.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge variant={statusBadge.variant} size="lg" className="flex-shrink-0">
                                {statusBadge.text}
                              </Badge>
                            </div>

                            {/* Task Information */}
                            {relatedTasks.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="overline text-neutral-700 dark:text-neutral-300">Related Tasks</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {relatedTasks.map((task) => (
                                    <Card key={task.taskId} variant="ghost" className="bg-blueberry-50 dark:bg-blueberry-950 border-blueberry-200 dark:border-blueberry-700">
                                      <CardContent size="lg">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-blueberry-200 dark:bg-blueberry-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckSquare size={16} className="text-blueberry-600 dark:text-blueberry-400" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5 className="body-text font-semibold text-blueberry-900 dark:text-blueberry-100 truncate">
                                              {task.taskName}
                                            </h5>
                                            <div className="flex items-center gap-3 text-xs text-blueberry-600 dark:text-blueberry-400 mt-1">
                                              <span>ID: {task.taskId}</span>
                                              <span>{task.duration}</span>
                                              <span>{task.startDate} - {task.endDate}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Files Section */}
                            {submission.files && submission.files.length > 0 && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="overline text-neutral-700 dark:text-neutral-300">Uploaded Files</h4>
                                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <Upload size={14} />
                                    <span>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
                                    <span className="text-neutral-400">•</span>
                                    <span>{formatFileSize(totalFileSize)}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {submission.files.map((file, index) => (
                                    <Card 
                                      key={index} 
                                      variant="ghost" 
                                      className="border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                    >
                                      <CardContent size="lg">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <FileText size={18} className="text-warning-600 dark:text-warning-400" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5 className="body-text font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blueberry-700 dark:group-hover:text-blueberry-300 transition-colors">
                                              {file.fileName}
                                            </h5>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                              {formatFileSize(file.fileSize)}
                                            </p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                            asChild
                                          >
                                            <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                                              <Download size={14} />
                                            </a>
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Links Section */}
                            {submission.linkUrl && (
                              <div className="space-y-4">
                                <h4 className="overline text-neutral-700 dark:text-neutral-300">Shared Links</h4>
                                <Card variant="ghost" className="border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-200 group">
                                  <CardContent size="lg">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                        {getLinkIcon(submission.linkType)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h5 className="body-text font-medium text-neutral-900 dark:text-neutral-100">
                                            {submission.linkType === 'github' ? 'GitHub Repository' :
                                             submission.linkType === 'docs' ? 'Document Link' :
                                             submission.linkType === 'website' ? 'Website/Demo' : 'External Link'}
                                          </h5>
                                          <Badge variant="soft-primary" size="sm" className="capitalize">
                                            {submission.linkType}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                                          {submission.linkUrl}
                                        </p>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                                        asChild
                                      >
                                        <a href={submission.linkUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink size={14} className="mr-2" />
                                          Open Link
                                        </a>
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}

                            {/* Actions Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                <span>Submission ID: {submission.id.slice(-8)}</span>
                                <span>•</span>
                                <span>Type: {submission.type.toUpperCase()}</span>
                                {submission.taskIds && submission.taskIds.length > 1 && (
                                  <>
                                    <span>•</span>
                                    <span>Multi-task submission</span>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {userRole === 'teacher' && submission.status === 'submitted' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                                  >
                                    <CheckSquare size={14} className="mr-2" />
                                    Review & Grade
                                  </Button>
                                )}
                                {userRole === 'student' && submission.status === 'needs-revision' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-warning-300 text-warning-700 hover:bg-warning-50 dark:border-warning-600 dark:text-warning-400 dark:hover:bg-warning-950"
                                  >
                                    <Upload size={14} className="mr-2" />
                                    Resubmit
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <Card variant="ghost" className="text-center py-16">
                    <CardContent>
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Send size={32} className="text-neutral-400 dark:text-neutral-500" />
                      </div>
                      <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-2">No Submissions Found</h3>
                      <p className="body-text text-neutral-500 dark:text-neutral-400">
                        {submissions.length === 0 
                          ? "No submissions have been made for this project yet."
                          : "No submissions match your current filters. Try adjusting your search criteria."
                        }
                      </p>
                      {userRole === 'student' && submissions.length === 0 && (
                        <Button 
                          variant="outline"
                          onClick={handleNewSubmission}
                          className="mt-4 border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                        >
                          <Plus size={16} className="mr-2" />
                          Create First Submission
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" variant="flush" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Submission Types Chart */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle size="sm">Submission Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Upload size={16} className="text-blueberry-600" />
                          <span className="text-sm">Files Only</span>
                        </div>
                        <Badge variant="outline">
                          {submissions.filter(s => s.type === 'file').length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Link2 size={16} className="text-success-600" />
                          <span className="text-sm">Links Only</span>
                        </div>
                        <Badge variant="outline">
                          {submissions.filter(s => s.type === 'link').length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-warning-600" />
                          <span className="text-sm">Mixed</span>
                        </div>
                        <Badge variant="outline">
                          {submissions.filter(s => s.type === 'mixed').length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle size="sm">Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approved</span>
                        <Badge variant="success">{stats.approved}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending</span>
                        <Badge variant="secondary">{stats.pending}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Needs Revision</span>
                        <Badge variant="warning">{stats.needsRevision}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reviewed</span>
                        <Badge variant="soft-primary">
                          {submissions.filter(s => s.status === 'reviewed').length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle size="sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {submissions.slice(0, 3).map((submission) => (
                        <div key={submission.id} className="flex items-center gap-2 text-sm">
                          {getSubmissionIcon(submission.type)}
                          <span className="truncate flex-1">{submission.title}</span>
                          <span className="text-xs text-neutral-500">
                            {formatTimestamp(submission.submittedAt).split(' at')[0]}
                          </span>
                        </div>
                      ))}
                      {submissions.length === 0 && (
                        <p className="text-sm text-neutral-500">No activity yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* File Statistics */}
                {stats.files > 0 && (
                  <Card variant="default">
                    <CardHeader>
                      <CardTitle size="sm">File Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Files</span>
                          <Badge variant="outline">
                            {submissions.reduce((total, s) => total + (s.files?.length || 0), 0)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Size</span>
                          <Badge variant="outline">
                            {formatFileSize(
                              submissions.reduce((total, s) => total + getTotalFileSize(s.files), 0)
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg per Submission</span>
                          <Badge variant="outline">
                            {stats.files > 0 
                              ? Math.round(submissions.reduce((total, s) => total + (s.files?.length || 0), 0) / stats.files)
                              : 0
                            } files
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Task Coverage */}
                {project.tasks && project.tasks.length > 0 && (
                  <Card variant="default">
                    <CardHeader>
                      <CardTitle size="sm">Task Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tasks with Submissions</span>
                          <Badge variant="outline">
                            {new Set(submissions.filter(s => s.taskId).map(s => s.taskId)).size} / {project.tasks.length}
                          </Badge>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-blueberry-500 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.round((new Set(submissions.filter(s => s.taskId).map(s => s.taskId)).size / project.tasks.length) * 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-neutral-500">
                          {Math.round((new Set(submissions.filter(s => s.taskId).map(s => s.taskId)).size / project.tasks.length) * 100)}% of tasks have submissions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Monthly Trend */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle size="sm">Submission Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['This Week', 'Last Week', 'This Month'].map((period, index) => {
                        const count = index === 0 ? 
                          submissions.filter(s => {
                            const date = s.submittedAt?.toDate();
                            if (!date) return false;
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return date >= weekAgo;
                          }).length : 
                          index === 1 ?
                          submissions.filter(s => {
                            const date = s.submittedAt?.toDate();
                            if (!date) return false;
                            const twoWeeksAgo = new Date();
                            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return date >= twoWeeksAgo && date < weekAgo;
                          }).length :
                          submissions.filter(s => {
                            const date = s.submittedAt?.toDate();
                            if (!date) return false;
                            const monthAgo = new Date();
                            monthAgo.setMonth(monthAgo.getMonth() - 1);
                            return date >= monthAgo;
                          }).length;

                        return (
                          <div key={period} className="flex items-center justify-between">
                            <span className="text-sm">{period}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Advanced Form Tab */}
            <TabsContent value="advanced-form" variant="flush" className="space-y-6 mt-6">
              <Card variant="ghost" className="text-center py-16">
                <CardContent>
                  <div className="w-16 h-16 bg-blueberry-100 dark:bg-blueberry-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Plus size={32} className="text-blueberry-600 dark:text-blueberry-400" />
                  </div>
                  <h3 className="heading-3 text-blueberry-800 dark:text-blueberry-200 mb-2">
                    {userRole === 'student' ? 'Advanced Submission' : 'Bulk Actions'}
                  </h3>
                  <p className="body-text text-blueberry-700 dark:text-blueberry-300 mb-4">
                    {userRole === 'student' 
                      ? 'Use the "New Submission" button above to create comprehensive submissions with multiple files and task assignments.'
                      : 'Bulk review and grading tools for managing multiple submissions efficiently.'
                    }
                  </p>
                  {userRole === 'student' && (
                    <Button 
                      variant="outline"
                      onClick={handleNewSubmission}
                      className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                    >
                      <Plus size={16} className="mr-2" />
                      Create Advanced Submission
                    </Button>
                  )}
                  {userRole === 'teacher' && submissions.length > 0 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          size="default"
                          className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                        >
                          <CheckSquare size={16} className="mr-2" />
                          Bulk Approve ({stats.pending})
                        </Button>
                        <Button 
                          variant="outline"
                          size="default"
                          className="border-warning-300 text-warning-700 hover:bg-warning-50 dark:border-warning-600 dark:text-warning-400 dark:hover:bg-warning-950"
                        >
                          <Clock size={16} className="mr-2" />
                          Review All ({stats.pending})
                        </Button>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                      >
                        <Download size={14} className="mr-2" />
                        Download All Files
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Advanced Submission Modal */}
      <AdvancedSubmissionModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        project={project}
        onSubmissionComplete={handleAdvancedSubmissionComplete}
      />
    </div>
  );
}