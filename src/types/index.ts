import { Timestamp } from 'firebase/firestore';

export type UserRole = 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string; // Added field
  role: UserRole | null;
}

export interface ProjectReport {
  id: string; // Firestore document ID
  projectId: string; // ID of the project this report belongs to
  studentUid: string; // UID of the student who submitted the report
  teacherUid: string; // UID of the teacher overseeing the project
  submittedAt: Timestamp; // from firebase/firestore
  textStatus: string; // student's textual description of the status
  studentProjectStatus: 'on-track' | 'off-track'; // Changed from rating
}

export interface Question {
  id:string;
  title: string;
  helpText: string;
  isInstruction?: boolean;
  position: number;
  minLength?: number;
  maxLength?: number;
}
