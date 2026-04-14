import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ManageClasses } from '../../components/admin/ManageClasses';
import { ManageUsers } from '../../components/admin/ManageUsers';
import { ViewActivityLogs } from '../../components/admin/ViewActivityLogs';
import { AdminOverview } from '../../components/admin/AdminOverview';
import { Users, UserPlus, Activity, Home } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'admin') {
      navigate('/login');
    } else if (user?.mustChangePassword) {
      navigate('/change-password');
    }
  }, [isAuthenticated, user, navigate]);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: Home },
    { label: 'Manage Classes', path: '/admin/classes', icon: Users },
    { label: 'Manage Users', path: '/admin/users', icon: UserPlus },
    { label: 'Activity Logs', path: '/admin/logs', icon: Activity },
  ];

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="classes" element={<ManageClasses />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="logs" element={<ViewActivityLogs />} />
      </Routes>
    </DashboardLayout>
  );
};
