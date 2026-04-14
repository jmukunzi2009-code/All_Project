import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Users, Plus, Edit, Trash2, Eye, LogOut, UserCheck, Mail, Phone, MapPin } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    experience: '',
    phone: '',
    address: '',
    license: '',
    image: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(adminUser));
    loadDoctors();
  }, [navigate]);

  const loadDoctors = () => {
    // Load doctors from localStorage
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    if (storedDoctors.length === 0) {
      // Initialize with default doctors
      const defaultDoctors = [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          email: "dr.johnson@medicare.com",
          password: "doctor123",
          specialty: "Cardiology",
          experience: "15 years",
          phone: "+1 (555) 123-4567",
          address: "123 Medical Center Dr, Suite 100",
          license: "MD123456",
          image: "/src/assets/D1.png",
          status: "active",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Dr. Michael Chen",
          email: "dr.chen@medicare.com",
          password: "doctor123",
          specialty: "Neurology",
          experience: "12 years",
          phone: "+1 (555) 234-5678",
          address: "456 Health Plaza, Suite 200",
          license: "MD234567",
          image: "/src/assets/D2.png",
          status: "active",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Dr. Emily Rodriguez",
          email: "dr.rodriguez@medicare.com",
          password: "doctor123",
          specialty: "Pediatrics",
          experience: "10 years",
          phone: "+1 (555) 345-6789",
          address: "789 Care Building, Suite 300",
          license: "MD345678",
          image: "/src/assets/D3.png",
          status: "active",
          createdAt: new Date().toISOString()
        },
        {
          id: 4,
          name: "Dr. James Wilson",
          email: "dr.wilson@medicare.com",
          password: "doctor123",
          specialty: "Orthopedics",
          experience: "18 years",
          phone: "+1 (555) 456-7890",
          address: "321 Wellness Center, Suite 400",
          license: "MD456789",
          image: "/src/assets/D4.png",
          status: "active",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('doctors', JSON.stringify(defaultDoctors));
      setDoctors(defaultDoctors);
    } else {
      setDoctors(storedDoctors);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const addDoctor = () => {
    if (!newDoctor.name || !newDoctor.email || !newDoctor.password || !newDoctor.specialty) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if email already exists
    if (doctors.some(d => d.email === newDoctor.email)) {
      alert('A doctor with this email already exists');
      return;
    }

    const doctor = {
      ...newDoctor,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedDoctors = [...doctors, doctor];
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    setDoctors(updatedDoctors);
    setNewDoctor({
      name: '', email: '', password: '', specialty: '', experience: '',
      phone: '', address: '', license: '', image: ''
    });
    setShowAddDoctor(false);
    alert('Doctor added successfully!');
  };

  const updateDoctor = () => {
    if (!editingDoctor.name || !editingDoctor.email || !editingDoctor.specialty) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedDoctors = doctors.map(d =>
      d.id === editingDoctor.id ? { ...editingDoctor } : d
    );
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    setDoctors(updatedDoctors);
    setEditingDoctor(null);
    alert('Doctor updated successfully!');
  };

  const deleteDoctor = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      const updatedDoctors = doctors.filter(d => d.id !== id);
      localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
      setDoctors(updatedDoctors);
      alert('Doctor deleted successfully!');
    }
  };

  const toggleDoctorStatus = (id) => {
    const updatedDoctors = doctors.map(d =>
      d.id === id ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' } : d
    );
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    setDoctors(updatedDoctors);
  };

  if (!admin) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-orange-600">MediCare</Link>
              <span className="ml-4 text-gray-500">• Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Admin</span>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctors.filter(d => d.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Access</p>
                <p className="text-2xl font-bold text-gray-900">Granted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Doctor Management</h3>
            <button
              onClick={() => setShowAddDoctor(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Doctor
            </button>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Login Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.image || '/api/placeholder/40/40'}
                              alt={doctor.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                            <div className="text-sm text-gray-500">{doctor.experience}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.specialty}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.email}</div>
                        <div className="text-sm text-gray-500">Password: {doctor.password}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          doctor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditingDoctor(doctor)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleDoctorStatus(doctor.id)}
                          className={`${
                            doctor.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDoctor(doctor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Doctor</h2>
              <button
                onClick={() => setShowAddDoctor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                  <input
                    type="text"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Login) *</label>
                  <input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={newDoctor.experience}
                    onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 10 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newDoctor.address}
                    onChange={(e) => setNewDoctor({ ...newDoctor, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    type="text"
                    value={newDoctor.license}
                    onChange={(e) => setNewDoctor({ ...newDoctor, license: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                  <input
                    type="url"
                    value={newDoctor.image}
                    onChange={(e) => setNewDoctor({ ...newDoctor, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddDoctor(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addDoctor}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Add Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Edit Doctor</h2>
              <button
                onClick={() => setEditingDoctor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                  <input
                    type="text"
                    value={editingDoctor.specialty}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (Login) *</label>
                  <input
                    type="email"
                    value={editingDoctor.email}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={editingDoctor.password}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={editingDoctor.experience}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingDoctor.phone}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingDoctor.address}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    type="text"
                    value={editingDoctor.license}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, license: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                  <input
                    type="url"
                    value={editingDoctor.image}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={updateDoctor}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                >
                  Update Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;