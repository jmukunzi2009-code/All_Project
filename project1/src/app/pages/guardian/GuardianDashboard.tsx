import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GuardianOverview } from '../../components/guardian/GuardianOverview';
import { GuardianChildren } from '../../components/guardian/GuardianChildren';
import { GuardianChat } from '../../components/guardian/GuardianChat';
import { ViewTrending } from '../../components/shared/ViewTrending';
import { Home, GraduationCap, MessageSquare, TrendingUp, AlertTriangle } from 'lucide-react';

export const GuardianDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'guardian') {
      navigate('/login');
    } else if (user?.mustChangePassword) {
      navigate('/change-password');
    }
  }, [isAuthenticated, user, navigate]);

  const navItems = [
    { label: 'Overview', path: '/guardian', icon: Home },
    { label: 'My Children', path: '/guardian/children', icon: GraduationCap },
    { label: 'Messages', path: '/guardian/chat', icon: MessageSquare },
    { label: 'Announcements', path: '/guardian/trending', icon: TrendingUp },
    { label: 'Concerns', path: '/guardian/concerns', icon: AlertTriangle },
  ];

  if (!isAuthenticated || user?.role !== 'guardian') {
    return null;
  }

  return (
    <DashboardLayout title="Guardian Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<GuardianOverview />} />
        <Route path="children" element={<GuardianChildren />} />
        <Route path="chat" element={<GuardianChat />} />
        <Route path="trending" element={<ViewTrending />} />
        <Route path="concerns" element={<div>Concerns Component</div>} />
      </Routes>
    </DashboardLayout>
  );
};