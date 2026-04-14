import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { TeacherOverview } from '../../components/teacher/TeacherOverview';
import { ManageClass } from '../../components/teacher/ManageClass';
import { TeacherChat } from '../../components/teacher/TeacherChat';
import { ViewTrending } from '../../components/shared/ViewTrending';
import { Home, GraduationCap, MessageSquare, TrendingUp, CheckSquare, Calendar } from 'lucide-react';

export const TeacherDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'teacher') {
      navigate('/login');
    } else if (user?.mustChangePassword) {
      navigate('/change-password');
    }
  }, [isAuthenticated, user, navigate]);

  const navItems = [
    { label: 'Overview', path: '/teacher', icon: Home },
    { label: 'My Class', path: '/teacher/students', icon: GraduationCap },
    { label: 'Mark Attendance', path: '/teacher/attendance', icon: CheckSquare },
    { label: 'Add Marks', path: '/teacher/marks', icon: CheckSquare },
    { label: 'Bookings', path: '/teacher/bookings', icon: Calendar },
    { label: 'Messages', path: '/teacher/chat', icon: MessageSquare },
    { label: 'Announcements', path: '/teacher/trending', icon: TrendingUp },
  ];

  if (!isAuthenticated || user?.role !== 'teacher') {
    return null;
  }

  return (
    <DashboardLayout title="Teacher Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<TeacherOverview />} />
        <Route path="students" element={<ManageClass />} />
        <Route path="attendance" element={<div>Attendance Component</div>} />
        <Route path="marks" element={<div>Marks Component</div>} />
        <Route path="bookings" element={<div>Bookings Component</div>} />
        <Route path="chat" element={<TeacherChat />} />
        <Route path="trending" element={<ViewTrending />} />
      </Routes>
    </DashboardLayout>
  );
};
