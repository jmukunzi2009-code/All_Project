import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { Stethoscope, Users, Clock, Award, ArrowRight, CheckCircle } from 'lucide-react'

const Home = () => {
    const features = [
        {
            icon: <Stethoscope className="w-8 h-8" />,
            title: "Expert Doctors",
            description: "Our team of experienced healthcare professionals is dedicated to providing the best care."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Patient Centered",
            description: "We put our patients first, ensuring personalized care and attention to your needs."
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "24/7 Support",
            description: "Round-the-clock emergency services and support when you need it most."
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Quality Care",
            description: "Accredited healthcare services with the latest technology and treatments."
        }
    ]

    const stats = [
        { number: "500+", label: "Happy Patients" },
        { number: "50+", label: "Expert Doctors" },
        { number: "24/7", label: "Emergency Care" },
        { number: "15+", label: "Years Experience" }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Your Health, Our
                                <span className="text-emerald-600"> Priority</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Experience world-class healthcare with our team of expert doctors,
                                modern facilities, and personalized treatment plans.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/appointments"
                                    className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Book Appointment
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/services"
                                    className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                                >
                                    Our Services
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-emerald-100 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <img
                                    src="/src/assets/hero.png"
                                    alt="Healthcare professionals"
                                    className="w-full h-auto rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 bg-emerald-600">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center text-white">
                                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-emerald-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MediCare?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We combine expertise, technology, and compassion to deliver exceptional healthcare services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of patients who trust MediCare for their healthcare needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Contact Us Today
                        </Link>
                        <Link
                            to="/doctors"
                            className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
                        >
                            Meet Our Doctors
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home