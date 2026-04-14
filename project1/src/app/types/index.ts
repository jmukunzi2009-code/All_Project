export type UserRole = 'admin' | 'headmaster' | 'teacher' | 'student' | 'guardian';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  classId?: string; // For teacher, student, guardian
  profileImage?: string; // Profile picture URL
  createdAt: string;
  lastLogin?: string;
  mustChangePassword?: boolean;
  subjects?: string[]; // For teachers
  guardianOf?: string[]; // For guardians - student IDs
}

export interface Class {
  id: string;
  name: string;
  teacherId?: string; // Class teacher
  studentIds: string[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherId: string;
  classId: string;
}

export interface TeacherAvailability {
  id: string;
  teacherId: string;
  subject: string;
  classId: string;
  dayOfWeek: number; // 0-6, Sunday=0
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
}

export interface Mark {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  maxScore: number;
  term: string;
  year: string;
  dateAdded: string;
  addedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  comments?: MarkComment[]; // Changed to array of comments
}

export interface MarkComment {
  id: string;
  markId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  comment: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  addedBy: string;
  createdAt: string;
}

export interface Report {
  id: string;
  studentId: string;
  term: string;
  year: string;
  generatedBy: string;
  generatedAt: string;
  comments: ReportComment[];
  content: {
    marks: Mark[];
    attendance: Attendance[];
    summary: string;
  };
}

export interface ReportComment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  type: 'direct' | 'class_group' | 'community';
  participants: string[]; // user IDs
  classId?: string; // For class_group
  lastMessage?: Message;
  createdAt: string;
  name?: string;
}

export interface TrendingPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  mediaUrl?: string; // Image or video URL
  mediaType?: 'image' | 'video'; // Type of media
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  priority: 'normal' | 'high' | 'urgent';
}

export interface TeacherBooking {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedReason?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Session {
  userId: string;
  token: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
}