import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Load doctors from localStorage
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    if (storedDoctors.length > 0) {
      // Filter only active doctors
      setDoctors(storedDoctors.filter(doctor => doctor.status === 'active'));
    } else {
      // Fallback to default doctors if none in storage
      const defaultDoctors = [
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          experience: "15 years",
          image: "/src/assets/D1.png",
          rating: 4.9,
          reviews: 127
        },
        {
          id: 2,
          name: "Dr. Michael Chen",
          specialty: "Neurology",
          experience: "12 years",
          image: "/src/assets/D2.png",
          rating: 4.8,
          reviews: 98
        },
        {
          id: 3,
          name: "Dr. Emily Rodriguez",
          specialty: "Pediatrics",
          experience: "10 years",
          image: "/src/assets/D3.png",
          rating: 4.9,
          reviews: 156
        },
        {
          id: 4,
          name: "Dr. James Wilson",
          specialty: "Orthopedics",
          experience: "18 years",
          image: "/src/assets/D4.png",
          rating: 4.7,
          reviews: 89
        }
      ];
      setDoctors(defaultDoctors);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-emerald-900 mb-4">Our Doctors</h1>
            <p className="text-lg text-emerald-700">Meet our experienced healthcare professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-emerald-200">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                <p className="text-emerald-600 font-semibold mb-2">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm mb-4">{doctor.experience} experience</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{doctor.rating}</span>
                  <span className="text-gray-500">({doctor.reviews} reviews)</span>
                </div>
                <Link
                  to={`/appointments?doctor=${encodeURIComponent(doctor.name)}`}
                  className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors inline-block text-center"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;