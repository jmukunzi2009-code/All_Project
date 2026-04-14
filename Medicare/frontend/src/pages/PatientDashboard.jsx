import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Calendar, Clock, User, Settings } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    // Load appointments from localStorage
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(storedAppointments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">MediCare</h1>
              <span className="ml-4 text-gray-500">• Patient Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      <SignedIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">My Health</h2>
                  <p className="text-indigo-600">Patient Portal</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'appointments'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    My Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('records')}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'records'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 inline mr-2" />
                    Medical Records
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'appointments' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">My Appointments</h3>
                  </div>
                  <div className="p-6">
                    {appointments.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h4>
                        <p className="text-gray-500 mb-4">Book your first appointment with one of our doctors</p>
                        <a
                          href="/doctors"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Browse Doctors
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">{appointment.doctor}</h4>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {appointment.date} at {appointment.time}
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'records' && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Medical Records</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-12">
                      <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Medical Records</h4>
                      <p className="text-gray-500">Your medical history and records will appear here</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your patient dashboard</p>
            <SignInButton mode="modal">
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default PatientDashboard;