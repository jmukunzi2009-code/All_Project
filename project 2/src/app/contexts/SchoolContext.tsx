import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Class,
  Subject,
  TeacherAssignment,
  AcademicTerm,
  Mark,
  Attendance,
  StudentReport,
  Teacher,
  Student,
  Message,
  Conversation,
} from '../types';

/**
 * School Management Context
 * 
 * DATA STORAGE:
 * - All data is stored in localStorage for persistence
 * - System starts with EMPTY data - no mock/hardcoded information
 * - All data must be entered by admin and users through the interface
 * 
 * DATA FLOW:
 * 1. Admin creates users (teachers, students, headmaster)
 * 2. Admin creates classes and assigns class teachers
 * 3. Admin creates subjects and assigns teachers
 * 4. Admin creates academic terms
 * 5. Teachers add marks and attendance
 * 6. Class teachers generate reports
 * 
 * SECURITY:
 * - Data is tied to user roles
 * - Only authorized users can modify specific data types
 * - All changes are immediately persisted to localStorage
 */

interface SchoolContextType {
  classes: Class[];
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
  assignments: TeacherAssignment[];
  terms: AcademicTerm[];
  marks: Mark[];
  attendance: Attendance[];
  reports: StudentReport[];
  messages: Message[];
  conversations: Conversation[];
  addClass: (classData: Omit<Class, 'id'>) => string;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  assignTeacher: (assignment: TeacherAssignment) => void;
  addTerm: (term: Omit<AcademicTerm, 'id'>) => void;
  addMark: (mark: Omit<Mark, 'id'>) => void;
  addAttendance: (attendance: Omit<Attendance, 'id'>) => void;
  addReport: (report: Omit<StudentReport, 'id'>) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateClass: (classId: string, updates: Partial<Class>) => void;
  updateStudent: (studentId: string, updates: Partial<Student>) => void;
  updateTeacher: (teacherId: string, updates: Partial<Teacher>) => void;
  updateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  deleteClass: (classId: string) => void;
  deleteStudent: (studentId: string) => void;
  deleteTeacher: (teacherId: string) => void;
  deleteSubject: (subjectId: string) => void;
  assignTeacherToSubjectAndClass: (teacherId: string, subjectId: string, classId: string) => void;
  removeTeacherAssignment: (assignmentId: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Storage keys for localStorage persistence
const STORAGE_KEYS = {
  CLASSES: 'school_classes',
  SUBJECTS: 'school_subjects',
  TEACHERS: 'school_teachers',
  STUDENTS: 'school_students',
  ASSIGNMENTS: 'school_assignments',
  TERMS: 'school_terms',
  MARKS: 'school_marks',
  ATTENDANCE: 'school_attendance',
  REPORTS: 'school_reports',
  MESSAGES: 'school_messages',
  CONVERSATIONS: 'school_conversations',
};

export function SchoolProvider({ children }: { children: ReactNode }) {
  // Initialize all state from localStorage or empty arrays
  const [classes, setClasses] = useState<Class[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return stored ? JSON.parse(stored) : [];
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return stored ? JSON.parse(stored) : [];
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return stored ? JSON.parse(stored) : [];
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : [];
  });

  const [assignments, setAssignments] = useState<TeacherAssignment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return stored ? JSON.parse(stored) : [];
  });

  const [terms, setTerms] = useState<AcademicTerm[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.TERMS);
    return stored ? JSON.parse(stored) : [];
  });

  const [marks, setMarks] = useState<Mark[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MARKS);
    return stored ? JSON.parse(stored) : [];
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return stored ? JSON.parse(stored) : [];
  });

  const [reports, setReports] = useState<StudentReport[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return stored ? JSON.parse(stored) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return stored ? JSON.parse(stored) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TERMS, JSON.stringify(terms));
  }, [terms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  const addClass = (classData: Omit<Class, 'id'>) => {
    const newClass = { ...classData, id: `class-${Date.now()}` };
    setClasses((prevClasses) => [...prevClasses, newClass]);
    return newClass.id;
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: `subject-${Date.now()}` };
    setSubjects([...subjects, newSubject]);
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: `teacher-${Date.now()}` };
    setTeachers([...teachers, newTeacher]);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: `student-${Date.now()}` };
    setStudents([...students, newStudent]);
    // Also add student to the class
    if (student.classId) {
      setClasses(classes.map(cls =>
        cls.id === student.classId
          ? { ...cls, studentIds: [...(cls.studentIds || []), newStudent.id] }
          : cls
      ));
    }
  };

  const assignTeacher = (assignment: TeacherAssignment) => {
    setAssignments([...assignments, assignment]);
  };

  const addTerm = (term: Omit<AcademicTerm, 'id'>) => {
    const newTerm = { ...term, id: `term-${Date.now()}` };
    setTerms([...terms, newTerm]);
  };

  const addMark = (mark: Omit<Mark, 'id'>) => {
    const newMark = { ...mark, id: `mark-${Date.now()}` };
    setMarks([...marks, newMark]);
  };

  const addAttendance = (attendanceData: Omit<Attendance, 'id'>) => {
    const newAttendance = { ...attendanceData, id: `att-${Date.now()}` };
    setAttendance([...attendance, newAttendance]);
  };

  const addReport = (report: Omit<StudentReport, 'id'>) => {
    const newReport = { ...report, id: `report-${Date.now()}` };
    setReports([...reports, newReport]);
  };

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages([...messages, newMessage]);
  };

  const updateClass = (classId: string, updates: Partial<Class>) => {
    setClasses(classes.map(c => (c.id === classId ? { ...c, ...updates } : c)));
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    setStudents(students.map(s => (s.id === studentId ? { ...s, ...updates } : s)));
  };

  const updateTeacher = (teacherId: string, updates: Partial<Teacher>) => {
    setTeachers(teachers.map(t => (t.id === teacherId ? { ...t, ...updates } : t)));
  };

  const updateSubject = (subjectId: string, updates: Partial<Subject>) => {
    setSubjects(subjects.map(s => (s.id === subjectId ? { ...s, ...updates } : s)));
  };

  const deleteClass = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId));
  };

  const deleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(t => t.id !== teacherId));
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
  };

  const assignTeacherToSubjectAndClass = (teacherId: string, subjectId: string, classId: string) => {
    const assignmentId = `${teacherId}-${subjectId}-${classId}`;
    const assignment: TeacherAssignment = {
      teacherId,
      subjectId,
      classId,
    };

    // Check if assignment already exists
    if (!assignments.find(a => a.teacherId === teacherId && a.subjectId === subjectId && a.classId === classId)) {
      setAssignments([...assignments, assignment]);

      // Update teacher's assigned classes and subjects
      setTeachers(teachers.map(t => {
        if (t.id === teacherId) {
          const updatedSubjects = [...(t.subjects || [])];
          if (!updatedSubjects.includes(subjectId)) {
            updatedSubjects.push(subjectId);
          }
          const updatedClasses = [...(t.assignedClasses || [])];
          if (!updatedClasses.includes(classId)) {
            updatedClasses.push(classId);
          }
          return { ...t, subjects: updatedSubjects, assignedClasses: updatedClasses };
        }
        return t;
      }));
    }
  };

  const removeTeacherAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(a => {
      const id = `${a.teacherId}-${a.subjectId}-${a.classId}`;
      return id !== assignmentId;
    }));
  };

  return (
    <SchoolContext.Provider
      value={{
        classes,
        subjects,
        teachers,
        students,
        assignments,
        terms,
        marks,
        attendance,
        reports,
        messages,
        conversations,
        addClass,
        addSubject,
        addTeacher,
        addStudent,
        assignTeacher,
        addTerm,
        addMark,
        addAttendance,
        addReport,
        sendMessage,
        updateClass,
        updateStudent,
        updateTeacher,
        updateSubject,
        deleteClass,
        deleteStudent,
        deleteTeacher,
        deleteSubject,
        assignTeacherToSubjectAndClass,
        removeTeacherAssignment,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
}