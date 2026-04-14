import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import HeadmasterDashboard from './pages/headmaster/HeadmasterDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageClasses from './pages/admin/ManageClasses';
import ManageSubjects from './pages/admin/ManageSubjects';
import ManageTerms from './pages/admin/ManageTerms';
import TeacherAssignments from './pages/admin/TeacherAssignments';
import MarksManagement from './pages/teacher/MarksManagement';
import AttendanceManagement from './pages/teacher/AttendanceManagement';
import ReportsPage from './pages/reports/ReportsPage';
import MessagingPage from './pages/messaging/MessagingPage';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'login', Component: LoginPage },
      { path: 'admin', Component: AdminDashboard },
      { path: 'admin/users', Component: ManageUsers },
      { path: 'admin/classes', Component: ManageClasses },
      { path: 'admin/subjects', Component: ManageSubjects },
      { path: 'admin/terms', Component: ManageTerms },
      { path: 'admin/assignments', Component: TeacherAssignments },
      { path: 'headmaster', Component: HeadmasterDashboard },
      { path: 'teacher', Component: TeacherDashboard },
      { path: 'teacher/marks', Component: MarksManagement },
      { path: 'teacher/attendance', Component: AttendanceManagement },
      { path: 'student', Component: StudentDashboard },
      { path: 'reports', Component: ReportsPage },
      { path: 'messages', Component: MessagingPage },
      { path: '*', Component: NotFound },
    ],
  },
]);
