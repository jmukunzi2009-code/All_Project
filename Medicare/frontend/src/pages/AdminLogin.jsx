import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock admin credentials
  const adminCredentials = {
    email: 'admin@medicare.com',
    password: 'admin123'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (credentials.email === adminCredentials.email && credentials.password === adminCredentials.password) {
        // Store admin session
        localStorage.setItem('adminUser', JSON.stringify({ email: credentials.email, role: 'admin' }));
        navigate('/admin/dashboard');
      } else {
        alert('Invalid admin credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Home Link */}
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Access the administration panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="admin@medicare.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In as Admin'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-sm font-medium text-orange-800 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              Demo Admin Credentials:
            </h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p><strong>Email:</strong> admin@medicare.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              Use these credentials to access the admin panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;