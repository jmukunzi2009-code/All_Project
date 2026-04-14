import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from '../components/ui/sonner';

export const RootLayout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  );
};
