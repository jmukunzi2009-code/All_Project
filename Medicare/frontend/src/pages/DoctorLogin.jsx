import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load doctors from localStorage for authentication
  const doctors = JSON.parse(localStorage.getItem('doctors') || '[]').filter(d => d.status === 'active');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const doctor = doctors.find(d => d.email === email && d.password === password);

      if (doctor) {
        // Store doctor info in localStorage (in real app, use proper auth)
        localStorage.setItem('doctorUser', JSON.stringify(doctor));
        navigate('/doctor/dashboard');
      } else {
        alert('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Home Link */}
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Login</h1>
            <p className="text-gray-600">Access your doctor dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="doctor@medicare.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Enter your password"
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
              className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Doctor Accounts:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <p key={doctor.id}>
                    <strong>{doctor.name}:</strong> {doctor.email} / {doctor.password}
                  </p>
                ))
              ) : (
                <>
                  <p><strong>Dr. Sarah Johnson:</strong> dr.johnson@medicare.com / doctor123</p>
                  <p><strong>Dr. Michael Chen:</strong> dr.chen@medicare.com / doctor123</p>
                  <p><strong>Dr. Emily Rodriguez:</strong> dr.rodriguez@medicare.com / doctor123</p>
                  <p><strong>Dr. James Wilson:</strong> dr.wilson@medicare.com / doctor123</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;