import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { HeadmasterOverview } from '../../components/headmaster/HeadmasterOverview';
import { ApproveMarks } from '../../components/headmaster/ApproveMarks';
import { ViewAllClasses } from '../../components/headmaster/ViewAllClasses';
import { ManageAnnouncements } from '../../components/headmaster/ManageAnnouncements';
import { ChatMonitor } from '../../components/headmaster/ChatMonitor';
import { ManageUsers } from '../../components/headmaster/ManageUsers';
import { TeacherBookings } from '../../components/headmaster/TeacherBookings';
import { Home, CheckSquare, Users, TrendingUp, MessageSquare, UserPlus, Calendar, BookOpen } from 'lucide-react';

export const HeadmasterDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'headmaster') {
      navigate('/login');
    } else if (user?.mustChangePassword) {
      navigate('/change-password');
    }
  }, [isAuthenticated, user, navigate]);

  const navItems = [
    { label: 'Overview', path: '/headmaster', icon: Home },
    { label: 'Approve Marks', path: '/headmaster/marks', icon: CheckSquare },
    { label: 'Manage Users', path: '/headmaster/users', icon: UserPlus },
    { label: 'View Classes', path: '/headmaster/classes', icon: BookOpen },
    { label: 'Bookings', path: '/headmaster/bookings', icon: Calendar },
    { label: 'Announcements', path: '/headmaster/trending', icon: TrendingUp },
    { label: 'Communication', path: '/headmaster/chat', icon: MessageSquare },
  ];

  if (!isAuthenticated || user?.role !== 'headmaster') {
    return null;
  }

  return (
    <DashboardLayout title="Headmaster Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<HeadmasterOverview />} />
        <Route path="marks" element={<ApproveMarks />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="classes" element={<ViewAllClasses />} />
        <Route path="bookings" element={<TeacherBookings />} />
        <Route path="trending" element={<ManageAnnouncements />} />
        <Route path="chat" element={<ChatMonitor />} />
      </Routes>
    </DashboardLayout>
  );
};