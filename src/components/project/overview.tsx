// components/project/overview.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FileText, Users, ExternalLink, Download, Send, Calendar, TrendingUp, ArrowRight, Eye, Link2, Upload, Github, Globe } from 'lucide-react';
import { ProjectData } from './index';
import { format } from 'date-fns';

// Firebase imports
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/auth-context';

interface ProjectOverviewProps {
  project: ProjectData;
  userRole: 'student' | 'teacher';
  onNavigateToSubmissions?: () => void;
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
  linkType?: string;
  submittedAt: Timestamp;
  status: 'submitted' | 'reviewed' | 'approved' | 'needs-revision';
}

export default function ProjectOverview({ project, userRole, onNavigateToSubmissions }: ProjectOverviewProps) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch submissions using simple query (same pattern as your projects query)
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

  // Get recent submissions (last 3)
  const recentSubmissions = submissions.slice(0, 3);
  const totalSubmissions = submissions.length;

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

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
      return 'Invalid date';
    }
    try {
      return format(timestamp.toDate(), 'MMM d, yyyy');
    } catch (err) {
      return 'Invalid date';
    }
  };

  const getFileCount = (submission: Submission) => {
    return submission.files?.length || 0;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-blueberry-100 dark:bg-blueberry-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText size={24} className="text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">
                {project.tasks?.length || 0}
              </div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Total Tasks</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users size={24} className="text-success-600 dark:text-success-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-success-600 dark:text-success-400">
                {project.resources?.papers?.length || 0}
              </div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Research Papers</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Send size={24} className="text-warning-600 dark:text-warning-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-warning-600 dark:text-warning-400">
                {loading ? '...' : totalSubmissions}
              </div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Submissions</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive" className="text-center group hover:shadow-lg transition-shadow duration-300">
          <CardContent className="flex flex-col items-center space-y-3 pt-6">
            <div className="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} className="text-error-600 dark:text-error-400" />
            </div>
            <div className="space-y-1">
              <div className="heading-2 text-error-600 dark:text-error-400">
                {Math.round(((project.tasks?.filter(t => t.status === 'completed').length || 0) / (project.tasks?.length || 1)) * 100)}%
              </div>
              <div className="body-text text-neutral-600 dark:text-neutral-400 text-sm">Complete</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      {loading ? (
        <Card variant="elevated" className="shadow-xl">
          <CardContent className="flex items-center justify-center py-16">
            <LoadingSpinner 
              size="lg" 
              label="Loading submissions..." 
              showLabel 
            />
          </CardContent>
        </Card>
      ) : error ? (
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
      ) : recentSubmissions.length > 0 ? (
        <Card variant="elevated" className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                  <Send size={20} className="text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <CardTitle className="text-success-700 dark:text-success-300">Recent Submissions</CardTitle>
                  <CardDescription className="body-text text-neutral-600 dark:text-neutral-400">
                    {userRole === 'student' ? 'Your latest project submissions and their status' : 'Latest student submissions'}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNavigateToSubmissions}
                className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
              >
                View All
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentSubmissions.map((submission) => {
                const statusBadge = getStatusBadge(submission.status);
                const fileCount = getFileCount(submission);
                
                // Handle both taskId (single) and taskIds (array) from advanced submission
                const taskIds = submission.taskIds || (submission.taskId ? [submission.taskId] : []);
                const relatedTasks = project.tasks?.filter(task => taskIds.includes(task.taskId)) || [];
                
                return (
                  <Card 
                    key={submission.id} 
                    variant="ghost" 
                    className="border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all duration-200"
                  >
                    <CardContent size="lg">
                      <div className="space-y-4">
                        {/* Header Section */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-blueberry-100 to-blueberry-200 dark:from-blueberry-900 dark:to-blueberry-800 rounded-lg flex items-center justify-center flex-shrink-0">
                              {getSubmissionIcon(submission.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="subtitle text-neutral-900 dark:text-neutral-100 mb-2">
                                {submission.title}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  <span>{formatTimestamp(submission.submittedAt)}</span>
                                </div>
                                {fileCount > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Upload size={12} />
                                    <span>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                                {submission.linkUrl && (
                                  <div className="flex items-center gap-1">
                                    <Link2 size={12} />
                                    <span>Link</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge variant={statusBadge.variant} size="default">
                            {statusBadge.text}
                          </Badge>
                        </div>

                        {/* Description */}
                        {submission.description && (
                          <p className="body-text text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-2">
                            {submission.description}
                          </p>
                        )}

                        {/* Related Tasks */}
                        {relatedTasks.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="overline text-neutral-700 dark:text-neutral-300">Related Tasks</h5>
                            <div className="flex flex-wrap gap-2">
                              {relatedTasks.map((task) => (
                                <Badge key={task.taskId} variant="soft-primary" size="sm">
                                  {task.taskName}
                                </Badge>
                              ))}
                              {taskIds.length > relatedTasks.length && (
                                <Badge variant="outline" size="sm">
                                  +{taskIds.length - relatedTasks.length} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Files Preview */}
                        {submission.files && submission.files.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="overline text-neutral-700 dark:text-neutral-300">Files</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {submission.files.slice(0, 2).map((file, index) => (
                                <Card 
                                  key={index} 
                                  variant="ghost" 
                                  className="border border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all duration-200 group cursor-pointer"
                                >
                                  <CardContent size="lg">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-warning-100 dark:bg-warning-900 rounded flex items-center justify-center flex-shrink-0">
                                        <FileText size={14} className="text-warning-600 dark:text-warning-400" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h6 className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blueberry-700 dark:group-hover:text-blueberry-300 transition-colors">
                                          {file.fileName}
                                        </h6>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                          {formatFileSize(file.fileSize)}
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                        asChild
                                      >
                                        <a href={file.fileUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                                          <Download size={12} />
                                        </a>
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              {submission.files.length > 2 && (
                                <div className="flex items-center justify-center p-2 bg-neutral-100 dark:bg-neutral-700 rounded text-xs text-neutral-500">
                                  +{submission.files.length - 2} more files
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Link Preview */}
                        {submission.linkUrl && (
                          <div className="space-y-2">
                            <h5 className="overline text-neutral-700 dark:text-neutral-300">Link</h5>
                            <Card variant="ghost" className="border border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all duration-200 group">
                              <CardContent size="lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-success-100 dark:bg-success-900 rounded flex items-center justify-center flex-shrink-0">
                                    {getLinkIcon(submission.linkType)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h6 className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                                        {submission.linkType === 'github' ? 'GitHub Repository' :
                                         submission.linkType === 'docs' ? 'Document Link' :
                                         submission.linkType === 'website' ? 'Website/Demo' : 'External Link'}
                                      </h6>
                                      <Badge variant="soft-primary" size="sm" className="capitalize text-xs">
                                        {submission.linkType}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                      {submission.linkUrl}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950 h-6 px-2"
                                    asChild
                                  >
                                    <a href={submission.linkUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink size={10} className="mr-1" />
                                      Open
                                    </a>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            ID: {submission.id.slice(-8)} • Type: {submission.type.toUpperCase()}
                          </div>
                          <div className="flex items-center gap-2">
                            {submission.files && submission.files.length > 1 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-warning-300 text-warning-700 hover:bg-warning-50 dark:border-warning-600 dark:text-warning-400 dark:hover:bg-warning-950 h-6 px-2 text-xs"
                              >
                                <Download size={10} className="mr-1" />
                                All ({submission.files.length})
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2 text-xs text-blueberry-600 hover:bg-blueberry-50 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                              onClick={onNavigateToSubmissions}
                            >
                              <Eye size={10} className="mr-1" />
                              View Full
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* View All Button */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={onNavigateToSubmissions}
                  className="w-full border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                >
                  <Send size={16} className="mr-2" />
                  View All Submissions ({totalSubmissions})
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // No submissions state
        <Card variant="elevated" className="shadow-xl">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={32} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="heading-3 text-neutral-900 dark:text-neutral-100 mb-2">No Submissions Yet</h3>
            <p className="body-text text-neutral-500 dark:text-neutral-400 mb-4">
              {userRole === 'student' 
                ? "Start working on your project tasks and submit your progress to see it here."
                : "Once the student starts submitting work, you'll see their progress here."
              }
            </p>
            {userRole === 'student' && onNavigateToSubmissions && (
              <Button 
                variant="outline"
                onClick={onNavigateToSubmissions}
                className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
              >
                Go to Submissions
                <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Research Papers Section - Only show if papers exist */}
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
                  <CardContent size="lg">
                    <div className="space-y-4 pt-6">
                      {/* Paper Header */}
                      <div className="space-y-3">
                        <h4 className="subtitle text-neutral-900 dark:text-neutral-100 leading-tight">
                          {paper.title}
                        </h4>
                        
                        {/* Authors */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Users size={14} className="text-neutral-500 dark:text-neutral-400" />
                          <span className="body-text text-neutral-600 dark:text-neutral-400 text-sm">
                            {paper.authors.join(', ')}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2">
                          {paper.categories.map((category, idx) => (
                            <Badge key={idx} variant="outline" size="sm">
                              {category}
                            </Badge>
                          ))}
                          {paper.comments && (
                            <Badge variant="secondary" size="sm">
                              {paper.comments}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Abstract */}
                      <div className="space-y-2">
                        <h5 className="overline text-neutral-700 dark:text-neutral-300">Abstract</h5>
                        <p className="body-text text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg line-clamp-3">
                          {paper.abstract}
                        </p>
                      </div>

                      {/* Subjects */}
                      {paper.subjects && paper.subjects.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="overline text-neutral-700 dark:text-neutral-300">Research Areas</h5>
                          <div className="flex flex-wrap gap-2">
                            {paper.subjects.slice(0, 3).map((subject, idx) => (
                              <Badge key={idx} variant="soft-primary" size="sm">
                                {subject}
                              </Badge>
                            ))}
                            {paper.subjects.length > 3 && (
                              <Badge variant="outline" size="sm">
                                +{paper.subjects.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                        >
                          <a href={paper.arxivUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-2" />
                            View on ArXiv
                          </a>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                        >
                          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download size={14} className="mr-2" />
                            Download PDF
                          </a>
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
    </div>
  );
}