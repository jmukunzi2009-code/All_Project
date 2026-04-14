import React from 'react';
import Navbar from '../components/Navbar';

const Services = () => {
  const services = [
    {
      id: 1,
      name: "Emergency Care",
      description: "24/7 emergency medical services for critical conditions",
      image: "/src/assets/S1.png",
      price: "Contact for pricing",
      duration: "As needed"
    },
    {
      id: 2,
      name: "Primary Care",
      description: "Comprehensive healthcare for all ages",
      image: "/src/assets/S2.png",
      price: "$150/visit",
      duration: "30 minutes"
    },
    {
      id: 3,
      name: "Cardiology",
      description: "Heart health and cardiovascular treatments",
      image: "/src/assets/S3.png",
      price: "$200/consultation",
      duration: "45 minutes"
    },
    {
      id: 4,
      name: "Dermatology",
      description: "Skin care and dermatological treatments",
      image: "/src/assets/S4.png",
      price: "$180/visit",
      duration: "30 minutes"
    },
    {
      id: 5,
      name: "Orthopedics",
      description: "Bone, joint, and muscle care",
      image: "/src/assets/S5.png",
      price: "$250/consultation",
      duration: "45 minutes"
    },
    {
      id: 6,
      name: "Pediatrics",
      description: "Specialized care for children and adolescents",
      image: "/src/assets/S6.png",
      price: "$120/visit",
      duration: "30 minutes"
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Services</h1>
            <p className="text-lg text-blue-700">Comprehensive healthcare services for your well-being</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-600 font-semibold">{service.price}</span>
                    <span className="text-gray-500 text-sm">{service.duration}</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;