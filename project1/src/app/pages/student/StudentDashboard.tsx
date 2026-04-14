import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StudentOverview } from '../../components/student/StudentOverview';
import { MyMarks } from '../../components/student/MyMarks';
import { MyAttendance } from '../../components/student/MyAttendance';
import { StudentChat } from '../../components/student/StudentChat';
import { TeacherBooking } from '../../components/student/TeacherBooking';
import { ViewTrending } from '../../components/shared/ViewTrending';
import { Home, BookOpen, Calendar, MessageSquare, TrendingUp, UserCheck } from 'lucide-react';

export const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'student') {
      navigate('/login');
    } else if (user?.mustChangePassword) {
      navigate('/change-password');
    }
  }, [isAuthenticated, user, navigate]);

  const navItems = [
    { label: 'Overview', path: '/student', icon: Home },
    { label: 'My Marks', path: '/student/marks', icon: BookOpen },
    { label: 'My Attendance', path: '/student/attendance', icon: Calendar },
    { label: 'Book Teacher', path: '/student/bookings', icon: UserCheck },
    { label: 'Messages', path: '/student/chat', icon: MessageSquare },
    { label: 'Trending', path: '/student/trending', icon: TrendingUp },
  ];

  if (!isAuthenticated || user?.role !== 'student') {
    return null;
  }

  return (
    <DashboardLayout title="Student Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="marks" element={<MyMarks />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="bookings" element={<TeacherBooking />} />
        <Route path="chat" element={<StudentChat />} />
        <Route path="trending" element={<ViewTrending />} />
      </Routes>
    </DashboardLayout>
  );
};