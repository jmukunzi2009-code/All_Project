import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, User, GraduationCap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.mustChangePassword) {
        navigate('/change-password');
      } else {
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'social_worker':
            navigate('/social-worker');
            break;
          case 'mom':
            navigate('/mom');
            break;
          case 'student':
            navigate('/student');
            break;
        }
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(username, password);
    
    if (!result.success) {
      toast.error(result.error || 'Login failed');
    } else {
      toast.success('Login successful!');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e2dede] via-white to-[#e2dede] p-4">
      <Card className="w-full max-w-md border-2 border-[#e2dede] shadow-xl">
        <CardHeader className="space-y-3 text-center bg-gradient-to-br from-[#043c04] to-[#5d3010] text-white rounded-t-lg">
          <div className="mx-auto w-16 h-16 bg-[#e7ac3e] rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-[#043c04]" />
          </div>
          <CardTitle className="text-3xl text-white">Ingabo Marks Track</CardTitle>
          <CardDescription className="text-white/90">
            Academic Monitoring & Communication Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#043c04]">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5d3010]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-[#e2dede] focus:border-[#e7ac3e] focus:ring-[#e7ac3e]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#043c04]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#5d3010]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-[#e2dede] focus:border-[#e7ac3e] focus:ring-[#e7ac3e]"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#043c04] to-[#5d3010] hover:from-[#032d03] hover:to-[#4a2508] text-white font-semibold" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-[#e7ac3e]/20 rounded-lg border-2 border-[#e7ac3e]">
            <p className="text-sm text-[#5d3010]">
              <strong className="text-[#043c04]">Default Admin:</strong><br />
              Username: <code className="bg-[#043c04] text-white px-2 py-1 rounded">ingabo</code><br />
              Password: <code className="bg-[#043c04] text-white px-2 py-1 rounded">ingabo1</code>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/">
              <Button variant="ghost" className="text-[#5d3010] hover:text-[#043c04] hover:bg-[#e2dede]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};