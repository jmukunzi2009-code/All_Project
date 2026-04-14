// User Types
export type UserRole = 'admin' | 'headmaster' | 'teacher' | 'class_teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Added password field
  role: UserRole;
  avatar?: string;
  profilePicture?: string; // URL or data URL for profile picture
}

export interface Teacher extends User {
  role: 'teacher' | 'class_teacher';
  subjects?: string[]; // Subject IDs
  assignedClasses?: string[]; // Class IDs where they teach
  classTeacherOf?: string; // class ID if they are a class teacher
  profilePicture?: string; // URL or data URL
}

export interface Student extends User {
  role: 'student';
  classId: string;
  enrollmentDate: string;
  profilePicture?: string; // URL or data URL
}

// Academic Structure
export interface Class {
  id: string;
  name: string;
  grade: string;
  classTeacherId?: string;
  studentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherId?: string;
  classIds?: string[]; // Classes where this subject is taught
}

export interface TeacherAssignment {
  teacherId: string;
  subjectId: string;
  classId: string;
}

// Academic Terms
export interface AcademicTerm {
  id: string;
  name: string;
  year: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

// Marks and Attendance
export interface Mark {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  termId: string;
  marks: number;
  maxMarks: number;
  teacherId: string;
  date: string;
  type: 'exam' | 'assignment' | 'quiz' | 'midterm' | 'final';
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  teacherId: string;
}

// Reports
export interface StudentReport {
  id: string;
  studentId: string;
  termId: string;
  classId: string;
  subjects: SubjectReport[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  rank?: number;
  attendance: {
    total: number;
    present: number;
    percentage: number;
  };
  conduct?: string;
  remarks?: string;
  generatedBy: string;
  generatedDate: string;
}

export interface SubjectReport {
  subjectId: string;
  subjectName: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
}

// Messaging
export interface Message {
  id: string;
  senderId: string;
  recipientId?: string; // undefined for group messages
  groupId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  type: 'direct' | 'group';
  name?: string; // for group conversations
}