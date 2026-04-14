import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, Settings, LogOut, Plus, Edit, CheckCircle, XCircle } from 'lucide-react';
import DoctorAvailability from '../components/DoctorAvailability';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Check if doctor is logged in
    const doctorUser = localStorage.getItem('doctorUser');
    if (!doctorUser) {
      navigate('/doctor-admin/login');
      return;
    }
    setDoctor(JSON.parse(doctorUser));

    // Load mock appointments for this doctor
    loadAppointments();
  }, [navigate]);

  const loadAppointments = () => {
    // Mock appointments data
    const mockAppointments = [
      {
        id: 1,
        patientName: 'John Smith',
        date: '2024-01-15',
        time: '10:00 AM',
        type: 'Consultation',
        status: 'confirmed',
        notes: 'Regular checkup'
      },
      {
        id: 2,
        patientName: 'Mary Johnson',
        date: '2024-01-15',
        time: '2:30 PM',
        type: 'Follow-up',
        status: 'pending',
        notes: 'Blood pressure monitoring'
      },
      {
        id: 3,
        patientName: 'Robert Davis',
        date: '2024-01-16',
        time: '11:00 AM',
        type: 'Consultation',
        status: 'confirmed',
        notes: 'Chest pain evaluation'
      }
    ];
    setAppointments(mockAppointments);
  };

  const handleLogout = () => {
    localStorage.removeItem('doctorUser');
    navigate('/');
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">MediCare</Link>
              <span className="ml-4 text-gray-500">• Doctor Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {doctor.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{doctor.name}</h2>
                <p className="text-indigo-600">{doctor.specialty}</p>
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
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'schedule'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'availability'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Availability
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Profile
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{appointment.patientName}</h4>
                            <p className="text-gray-600">{appointment.type}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {appointment.date} at {appointment.time}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {appointment.status === 'confirmed' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Manage Schedule</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Schedule Management</h4>
                    <p className="text-gray-500 mb-4">Set your availability and working hours</p>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Time Slot
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <DoctorAvailability
                doctor={doctor}
                onSave={(availability) => {
                  console.log('Availability saved:', availability);
                }}
              />
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Doctor Profile</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Profile Settings</h4>
                    <p className="text-gray-500 mb-4">Update your professional information</p>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;