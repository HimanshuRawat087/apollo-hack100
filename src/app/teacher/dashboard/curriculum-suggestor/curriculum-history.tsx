"use client";

import { useState, useEffect } from 'react';
import { 
  History, 
  BookOpen, 
  Eye, 
  Edit3, 
  Trash2,
  ArrowLeft,
  Clock,
  Calendar,
  Filter,
  Search,
  Loader2,
  FileText,
  Target,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';

const fetchCurriculums = async () => {
  const q = query(collection(firebaseDbService, 'curriculums'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteCurriculum = async (id: string) => {
  await deleteDoc(doc(firebaseDbService, 'curriculums', id));
};

interface CurriculumHistoryProps {
  onBack: () => void;
  onViewCurriculum: (curriculum: any) => void;
  onEditCurriculum: (curriculum: any) => void;
}

export default function CurriculumHistory({ 
  onBack, 
  onViewCurriculum, 
  onEditCurriculum 
}: CurriculumHistoryProps) {
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadCurriculums();
  }, []);

  const loadCurriculums = async () => {
    try {
      setLoading(true);
      const data = await fetchCurriculums();
      const curriculums = data.map((item: any) => item.data);
      setCurriculums(curriculums);
    } catch (error) {
      console.error('Error loading curriculums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this curriculum? This action cannot be undone.')) {
      try {
        await deleteCurriculum(id);
        setCurriculums(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting curriculum:', error);
        alert('Failed to delete curriculum. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubjectBadgeVariant = (subject: string) => {
    const variants = {
      'Computer Science': 'soft-primary',
      'Physics': 'outline-primary',
      'Mathematics': 'success',
      'Chemistry': 'warning',
      'Biology': 'outline',
    };
    return variants[subject] || 'secondary';
  };

  // Filter and sort logic
  const filteredCurriculums = curriculums
    .filter(curriculum => {
      const matchesSearch = curriculum.lessonStructure.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSubject = filterSubject === 'all' || 
        curriculum.metadata.subject === filterSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime();
        case 'oldest':
          return new Date(a.metadata.createdAt).getTime() - new Date(b.metadata.createdAt).getTime();
        case 'title':
          return a.lessonStructure.title.localeCompare(b.lessonStructure.title);
        case 'subject':
          return a.metadata.subject.localeCompare(b.metadata.subject);
        default:
          return 0;
      }
    });

  const uniqueSubjects = [...new Set(curriculums.map(c => c.metadata.subject))];

  return (
    <div className="flex-grow flex flex-col p-6 space-y-8 w-full bg-neutral-50 dark:bg-neutral-900 mx-auto max-w-6xl">
      {/* Filters and Search */}
      <Card variant="feature" className="shadow-lg">
        <CardHeader compact>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blueberry-100 dark:bg-blueberry-900 rounded-lg flex items-center justify-center">
              <Filter size={20} className="text-blueberry-600 dark:text-blueberry-400" />
            </div>
            <CardTitle className="text-blueberry-700 dark:text-blueberry-300">Search & Filter</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                variant="outline"
                size="default"
                leftIcon={<Search size={16} />}
                placeholder="Search lesson plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-neutral-800"
              />
            </div>
            
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger 
                variant="outline"
                className="bg-white dark:bg-neutral-800"
                leftIcon={<Target size={16} />}
              >
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {uniqueSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger 
                variant="outline"
                className="bg-white dark:bg-neutral-800"
                leftIcon={<Clock size={16} />}
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="subject">Subject A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {!loading && (
        <div className="flex items-center justify-between">
          <p className="body-text text-neutral-600 dark:text-neutral-400">
            {filteredCurriculums.length === 0 ? 'No results found' : 
             `${filteredCurriculums.length} lesson plan${filteredCurriculums.length !== 1 ? 's' : ''} found`}
          </p>
          {(searchTerm || filterSubject !== 'all') && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('all');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner 
          layout="centered"
          size="xl"
          variant="primary"
          label="Loading curriculum history"
          description="Please wait while we fetch your saved lesson plans..."
          showLabel
        />
      ) : filteredCurriculums.length === 0 ? (
        <Card variant="ghost" className="text-center py-16">
          <CardContent size="xl">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto">
                <FileText size={48} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="heading-3 text-neutral-900 dark:text-neutral-100">
                  {searchTerm || filterSubject !== 'all' ? 'No matching curriculums found' : 'No saved curriculums yet'}
                </h3>
                <p className="body-text text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                  {searchTerm || filterSubject !== 'all' 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for'
                    : 'Start creating lesson plans to see them appear in your history'
                  }
                </p>
              </div>
              
              {(!searchTerm && filterSubject === 'all') && (
                <Button variant="outline" onClick={onBack} className="mt-4">
                  <BookOpen size={16} className="mr-2" />
                  Create Your First Lesson Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredCurriculums.map((curriculum, index) => (
            <Card 
              key={curriculum.id || index} 
              variant="elevated" 
              className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <CardTitle size="default" className="text-neutral-900 dark:text-neutral-100 group-hover:text-blueberry-700 dark:group-hover:text-blueberry-300 transition-colors">
                      {curriculum.lessonStructure.title}
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={getSubjectBadgeVariant(curriculum.metadata.subject)}
                        size="default"
                      >
                        {curriculum.metadata.subject}
                      </Badge>
                      <Badge variant="outline" size="default">
                        <Users size={12} className="mr-1" />
                        {curriculum.metadata.gradeLevel}
                      </Badge>
                      <Badge variant="secondary" size="default">
                        <Clock size={12} className="mr-1" />
                        {curriculum.lessonStructure.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewCurriculum(curriculum)}
                      className="border-success-300 text-success-700 hover:bg-success-50 dark:border-success-600 dark:text-success-400 dark:hover:bg-success-950"
                    >
                      <Eye size={14} className="mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditCurriculum(curriculum)}
                      className="border-blueberry-300 text-blueberry-700 hover:bg-blueberry-50 dark:border-blueberry-600 dark:text-blueberry-400 dark:hover:bg-blueberry-950"
                    >
                      <Edit3 size={14} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(curriculum.id)}
                      className="border-error-300 text-error-700 hover:bg-error-50 dark:border-error-600 dark:text-error-400 dark:hover:bg-error-950"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-6 text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-success-500 rounded-full flex items-center justify-center">
                      <Calendar size={10} className="text-white" />
                    </div>
                    <span className="body-text text-sm">Created: {formatDate(curriculum.metadata.createdAt)}</span>
                  </div>
                  
                  {curriculum.metadata.updatedAt !== curriculum.metadata.createdAt && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blueberry-500 rounded-full flex items-center justify-center">
                        <Clock size={10} className="text-white" />
                      </div>
                      <span className="body-text text-sm">Updated: {formatDate(curriculum.metadata.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {!loading && curriculums.length > 0 && (
        <Card variant="gradient" className="mt-8">
          <CardContent size="lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">{curriculums.length}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400">Total Plans</div>
              </div>
              <div className="space-y-2">
                <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">{uniqueSubjects.length}</div>
                <div className="body-text text-neutral-600 dark:text-neutral-400">Subjects</div>
              </div>
              <div className="space-y-2">
                <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">
                  {Math.round(curriculums.reduce((acc, c) => acc + parseInt(c.lessonStructure.duration), 0) / curriculums.length)}
                </div>
                <div className="body-text text-neutral-600 dark:text-neutral-400">Avg Duration (min)</div>
              </div>
              <div className="space-y-2">
                <div className="heading-2 text-blueberry-600 dark:text-blueberry-400">
                  {curriculums.filter(c => {
                    const created = new Date(c.metadata.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created > weekAgo;
                  }).length}
                </div>
                <div className="body-text text-neutral-600 dark:text-neutral-400">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
