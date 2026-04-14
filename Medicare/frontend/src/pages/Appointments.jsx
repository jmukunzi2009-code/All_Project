import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';

const Appointments = () => {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Load doctors from localStorage
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    if (storedDoctors.length > 0) {
      // Filter only active doctors
      setDoctors(storedDoctors.filter(doctor => doctor.status === 'active'));
    } else {
      // Fallback to default doctors
      setDoctors([
        { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology" },
        { id: 2, name: "Dr. Michael Chen", specialty: "Neurology" },
        { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrics" },
        { id: 4, name: "Dr. James Wilson", specialty: "Orthopedics" }
      ]);
    }

    // Check if doctor is passed in URL params
    const doctorParam = searchParams.get('doctor');
    if (doctorParam) {
      setSelectedDoctor(doctorParam);
    }
  }, [searchParams]);

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      alert('Please fill in all fields');
      return;
    }

    // Create appointment object
    const appointment = {
      id: Date.now(),
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      patientName: 'Demo Patient', // In real app, get from user auth
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Show payment modal
    setPendingAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paidAppointment) => {
    // Store the paid appointment
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    existingAppointments.push(paidAppointment);
    localStorage.setItem('appointments', JSON.stringify(existingAppointments));

    alert(`Appointment booked and payment processed successfully!\nDate: ${paidAppointment.date}\nTime: ${paidAppointment.time}\nDoctor: ${paidAppointment.doctor}\nPayment ID: ${paidAppointment.paymentId}\n\nYou will receive a confirmation email shortly.`);

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setPendingAppointment(null);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-purple-900 mb-4">Book an Appointment</h1>
            <p className="text-lg text-purple-700">Schedule your visit with our healthcare professionals</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Doctor</h3>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6"
                />

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Time</h3>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Doctor:</span>
                    <p className="text-purple-600">{selectedDoctor || 'Not selected'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-purple-600">{selectedDate || 'Not selected'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <p className="text-purple-600">{selectedTime || 'Not selected'}</p>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !selectedDoctor}
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                    selectedDate && selectedTime && selectedDoctor
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        appointment={pendingAppointment}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Appointments;