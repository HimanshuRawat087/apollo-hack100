// assign-project-dialog.tsx
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db as firebaseDbService } from '@/lib/firebase';
// IMPORT ProjectIdea and SavedProjectTask from idea-detail.tsx now, as that's where the updated types live
import type { ProjectIdea, SavedProjectTask } from '@/app/teacher/dashboard/student-mentor/idea-detail'; // <--- UPDATED IMPORT PATH
import type { UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format as formatDate } from 'date-fns'; // For date formatting, addDays is in calculateTaskDates
import { Button } from '@/components/ui/button';
import { calculateTaskDates } from '@/lib/utils'; // Import the new utility function
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssignProjectDialogProps {
  project: ProjectIdea | null;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teacherId: string;
}

export default function AssignProjectDialog({ project, isOpen, onOpenChange, teacherId }: AssignProjectDialogProps) {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedStudentUid, setSelectedStudentUid] = useState<string | undefined>(undefined);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const { toast } = useToast();

  // State for project start date
  const [projectStartDate, setProjectStartDate] = useState<string>(''); 
  // State for tasks with recalculated dates
  const [processedTasks, setProcessedTasks] = useState<SavedProjectTask[]>([]);

  useEffect(() => {
    if (isOpen && project) {
      // Initialize projectStartDate state from prop when dialog opens or project changes
      setProjectStartDate(project.projectStartDate ? project.projectStartDate : formatDate(new Date(), 'yyyy-MM-dd'));
    }
  }, [isOpen, project]);


  useEffect(() => {
    const fetchStudents = async () => {
      if (!isOpen || !firebaseDbService) return;
      setIsLoadingStudents(true);
      try {
        const usersRef = collection(firebaseDbService, 'users');
        const q = query(usersRef, where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        const studentList: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          studentList.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error Fetching Students",
          description: "Could not load the list of students. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen, toast]);

  // Effect to recalculate task dates when project or projectStartDate changes
  useEffect(() => {
    if (project && project.tasks && projectStartDate) {
      // Ensure tasks passed to calculateTaskDates have numeric durations as expected by its internal logic if not parsing strings
      // Since project.tasks are SavedProjectTask[], duration is already number.
      const processed = calculateTaskDates(project.tasks, projectStartDate);
      setProcessedTasks(processed);
    } else if (project && project.tasks) {
      // Fallback if projectStartDate is not yet set, ensure durations are valid numbers.
      // This might be redundant if project.tasks always have valid numeric durations.
      setProcessedTasks(project.tasks.map(task => ({
        ...task,
        duration: typeof task.duration === 'number' && task.duration > 0 ? task.duration : 1,
      })));
    } else {
      setProcessedTasks([]);
    }
  }, [project, projectStartDate]);

  const handleAssignProject = async () => {
    if (!project || !selectedStudentUid || !firebaseDbService) {
      toast({
        title: "Assignment Error",
        description: "Project or student not selected, or database service unavailable.",
        variant: "destructive",
      });
      return;
    }

    const selectedStudent = students.find(s => s.uid === selectedStudentUid);
    if (!selectedStudent) {
      toast({ title: "Student not found", description: "Selected student details could not be found.", variant: "destructive" });
      return;
    }

    setIsAssigning(true);
    try {
      // Step 1: Create a new project document in 'projects' collection with an auto-generated ID
      const projectDataForDatabase = {
        title: project.title,
        description: project.description,
        difficulty: project.difficulty,
        duration: project.duration, // This is overall project duration, not sum of tasks
        projectStartDate: projectStartDate, // Add the selected start date
        tasks: processedTasks, // Use tasks with recalculated dates
        createdAt: serverTimestamp(),
        // teacherUid: teacherId, // Consider adding teacherId to the project document itself if useful
      };
      // Use addDoc to get an auto-generated ID for the new project document
      const newProjectRef = await addDoc(collection(firebaseDbService, 'projects'), projectDataForDatabase);
      const newProjectId = newProjectRef.id; // This is the Firestore auto-generated ID

      // Step 2: Create assignment in 'assignedProjects' collection, referencing the newProjectId
      const assignmentData = {
        projectId: newProjectId, // Use the new auto-generated ID
        studentUid: selectedStudentUid,
        studentName: selectedStudent.displayName || selectedStudent.email || 'N/A',
        teacherUid: teacherId,
        assignedAt: serverTimestamp(),
        status: 'assigned', // e.g., 'assigned', 'in-progress', 'completed'
        // projectTitle: project.title, // Denormalize for easier querying if needed
        // studentEmail: selectedStudent.email, // Denormalize for easier querying
      };

      await addDoc(collection(firebaseDbService, 'assignedProjects'), assignmentData);
      toast({
        title: "Project Assigned!",
        description: `${project.title} has been assigned to ${selectedStudent.displayName || selectedStudent.email}.`,
      });
      onOpenChange(false);
      setSelectedStudentUid(undefined);
    } catch (error) {
      console.error("Error assigning project:", error);
      toast({
        title: "Assignment Failed",
        description: "Could not assign the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!project) return null;

  const selectedStudentDisplayValue = students.find(student => student.uid === selectedStudentUid)?.displayName || students.find(student => student.uid === selectedStudentUid)?.email || "Select student...";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setSelectedStudentUid(undefined); // Reset student selection on close
        setIsComboboxOpen(false);
      }
    }}>
      <TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Project: <span className="text-primary">{project.title}</span></DialogTitle>
            <DialogDescription>
              Select the project start date and a student to assign this project to. Task dates will be calculated based on the start date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4"> {/* Increased gap slightly */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-start-date" className="text-right col-span-1">
                Start Date
              </Label>
              <div className="col-span-3">
                <input
                  type="date"
                  id="project-start-date"
                  value={projectStartDate}
                  onChange={(e) => setProjectStartDate(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2"
                  disabled={isAssigning}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student-select" className="text-right col-span-1">
                Student
              </Label>
              <div className="col-span-3">
                {isLoadingStudents ? (
                  <div className="flex items-center">
                  <LoadingSpinner size={20} className="mr-2" /> Loading students...
                </div>
              ) : students.length === 0 ? (
                <p className="text-sm text-muted-foreground">No students found.</p>
              ) : (
                <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isComboboxOpen}
                      className="w-full justify-between text-muted-foreground hover:text-muted-foreground"
                      disabled={isAssigning}
                    >
                      {selectedStudentUid
                        ? selectedStudentDisplayValue
                        : "Select student..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search student..." />
                      <CommandList>
                        <CommandEmpty>No student found.</CommandEmpty>
                        <CommandGroup>
                          {students.map((student) => (
                            <CommandItem
                              key={student.uid}
                              value={student.displayName || student.email || student.uid}
                              onSelect={() => {
                                setSelectedStudentUid(student.uid === selectedStudentUid ? undefined : student.uid);
                                setIsComboboxOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedStudentUid === student.uid ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {student.displayName || student.email || student.uid}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isAssigning}>Cancel</Button>
          </DialogClose>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleAssignProject}
                disabled={!selectedStudentUid || isAssigning || isLoadingStudents || students.length === 0}
              >
                {isAssigning ? <LoadingSpinner size={20} iconClassName="text-primary-foreground" /> : 'Assign Project'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to assign this project to the selected student.</p>
            </TooltipContent>
          </Tooltip>
        </DialogFooter>
        </DialogContent>
      </TooltipProvider>
    </Dialog>
  );
}