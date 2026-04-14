import type { 
  User, 
  Class, 
  Subject,
  TeacherAvailability,
  Mark, 
  Attendance, 
  Report, 
  Message, 
  Conversation, 
  TrendingPost, 
  ActivityLog,
  Session,
  TeacherBooking
} from '../types';

const STORAGE_KEYS = {
  USERS: 'ingabo_users',
  CLASSES: 'ingabo_classes',
  SUBJECTS: 'ingabo_subjects',
  TEACHER_AVAILABILITY: 'ingabo_teacher_availability',
  MARKS: 'ingabo_marks',
  ATTENDANCE: 'ingabo_attendance',
  REPORTS: 'ingabo_reports',
  MESSAGES: 'ingabo_messages',
  CONVERSATIONS: 'ingabo_conversations',
  TRENDING: 'ingabo_trending',
  ACTIVITY_LOGS: 'ingabo_activity_logs',
  SESSION: 'ingabo_session',
  BOOKINGS: 'ingabo_bookings',
};

// Simple hash function for password (in production, use bcrypt or similar)
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash)}_${password.length}`;
};

// Initialize default data
export const initializeDefaultData = () => {
  const users = getUsers();
  if (users.length === 0) {
    // Create default admin
    const defaultAdmin: User = {
      id: 'admin_1',
      username: 'ingabo',
      password: hashPassword('ingabo1'),
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };
    saveUsers([defaultAdmin]);
  }
};

// Generic storage functions
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Users
export const getUsers = (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS);
export const saveUsers = (users: User[]): void => saveToStorage(STORAGE_KEYS.USERS, users);
export const getUserById = (id: string): User | undefined => getUsers().find(u => u.id === id);
export const getUserByUsername = (username: string): User | undefined => 
  getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());

// Classes
export const getClasses = (): Class[] => getFromStorage<Class>(STORAGE_KEYS.CLASSES);
export const saveClasses = (classes: Class[]): void => saveToStorage(STORAGE_KEYS.CLASSES, classes);
export const getClassById = (id: string): Class | undefined => getClasses().find(c => c.id === id);
export const getClassByName = (name: string): Class | undefined => 
  getClasses().find(c => c.name.toLowerCase() === name.toLowerCase());

// Subjects
export const getSubjects = (): Subject[] => getFromStorage<Subject>(STORAGE_KEYS.SUBJECTS);
export const saveSubjects = (subjects: Subject[]): void => saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
export const getSubjectsByTeacherId = (teacherId: string): Subject[] => 
  getSubjects().filter(s => s.teacherId === teacherId);
export const getSubjectsByClassId = (classId: string): Subject[] => 
  getSubjects().filter(s => s.classId === classId);

// Teacher Availability
export const getTeacherAvailability = (): TeacherAvailability[] => getFromStorage<TeacherAvailability>(STORAGE_KEYS.TEACHER_AVAILABILITY);
export const saveTeacherAvailability = (availability: TeacherAvailability[]): void => saveToStorage(STORAGE_KEYS.TEACHER_AVAILABILITY, availability);
export const getAvailabilityByTeacherId = (teacherId: string): TeacherAvailability[] => 
  getTeacherAvailability().filter(a => a.teacherId === teacherId);

// Marks
export const getMarks = (): Mark[] => getFromStorage<Mark>(STORAGE_KEYS.MARKS);
export const saveMarks = (marks: Mark[]): void => saveToStorage(STORAGE_KEYS.MARKS, marks);
export const getMarksByStudentId = (studentId: string): Mark[] => 
  getMarks().filter(m => m.studentId === studentId);

// Attendance
export const getAttendance = (): Attendance[] => getFromStorage<Attendance>(STORAGE_KEYS.ATTENDANCE);
export const saveAttendance = (attendance: Attendance[]): void => saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);
export const getAttendanceByStudentId = (studentId: string): Attendance[] => 
  getAttendance().filter(a => a.studentId === studentId);

// Reports
export const getReports = (): Report[] => getFromStorage<Report>(STORAGE_KEYS.REPORTS);
export const saveReports = (reports: Report[]): void => saveToStorage(STORAGE_KEYS.REPORTS, reports);
export const getReportsByStudentId = (studentId: string): Report[] => 
  getReports().filter(r => r.studentId === studentId);

// Messages
export const getMessages = (): Message[] => getFromStorage<Message>(STORAGE_KEYS.MESSAGES);
export const saveMessages = (messages: Message[]): void => saveToStorage(STORAGE_KEYS.MESSAGES, messages);
export const getMessagesByConversationId = (conversationId: string): Message[] => 
  getMessages().filter(m => m.conversationId === conversationId).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

// Conversations
export const getConversations = (): Conversation[] => getFromStorage<Conversation>(STORAGE_KEYS.CONVERSATIONS);
export const saveConversations = (conversations: Conversation[]): void => saveToStorage(STORAGE_KEYS.CONVERSATIONS, conversations);
export const getConversationById = (id: string): Conversation | undefined => 
  getConversations().find(c => c.id === id);
export const getConversationsByUserId = (userId: string): Conversation[] => 
  getConversations().filter(c => c.participants.includes(userId));

// Trending
export const getTrendingPosts = (): TrendingPost[] => getFromStorage<TrendingPost>(STORAGE_KEYS.TRENDING);
export const saveTrendingPosts = (posts: TrendingPost[]): void => saveToStorage(STORAGE_KEYS.TRENDING, posts);

// Activity Logs
export const getActivityLogs = (): ActivityLog[] => getFromStorage<ActivityLog>(STORAGE_KEYS.ACTIVITY_LOGS);
export const saveActivityLogs = (logs: ActivityLog[]): void => saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, logs);
export const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>): void => {
  const logs = getActivityLogs();
  const newLog: ActivityLog = {
    ...log,
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  logs.push(newLog);
  saveActivityLogs(logs);
};

// Session
export const getSession = (): Session | null => {
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
};

export const saveSession = (session: Session | null): void => {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Bookings
export const getBookings = (): TeacherBooking[] => getFromStorage<TeacherBooking>(STORAGE_KEYS.BOOKINGS);
export const saveBookings = (bookings: TeacherBooking[]): void => saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
export const getBookingsByStudentId = (studentId: string): TeacherBooking[] => 
  getBookings().filter(b => b.studentId === studentId);
export const getBookingsByTeacherId = (teacherId: string): TeacherBooking[] => 
  getBookings().filter(b => b.teacherId === teacherId);

// Generate unique ID
export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};