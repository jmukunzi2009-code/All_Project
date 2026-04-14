import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { GraduationCap, Users, TrendingUp, MessageSquare, Calendar, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const HomePage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "School-Based Structure",
      description: "Connect teachers, students, guardians, and administrators in one secure platform"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Academic Progress",
      description: "Monitor marks, attendance, and generate comprehensive reports"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Real-Time Communication",
      description: "Instagram-like chat system for seamless conversations"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Teacher Bookings",
      description: "Schedule one-on-one sessions with teachers and social workers"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Role-based access control with encrypted data protection"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trending Updates",
      description: "Stay informed with important announcements and news"
    }
  ];

  const roles = [
    { name: "Admin", description: "Full system control and user management", color: "bg-[#043c04]" },
    { name: "Headmaster", description: "Manage teachers, classes, and school announcements", color: "bg-[#5d3010]" },
    { name: "Teacher", description: "Teach classes, mark attendance, and add student marks", color: "bg-[#e7ac3e]" },
    { name: "Guardian", description: "Monitor children's progress and communicate with teachers", color: "bg-[#043c04]" },
    { name: "Student", description: "Track academic progress and communicate with teachers", color: "bg-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2dede] via-white to-[#e2dede]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#043c04] via-[#5d3010] to-[#043c04] opacity-95"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <GraduationCap className="w-5 h-5 text-[#e7ac3e]" />
                <span className="text-sm font-medium">Academic Excellence Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to <span className="text-[#e7ac3e]">Ingabo</span> Marks Track
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                A comprehensive academic monitoring and communication platform connecting students, families, and educators for better educational outcomes.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-[#e7ac3e] hover:bg-[#d49a2e] text-[#043c04] font-semibold text-lg px-8 py-6">
                    Login to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#043c04] font-semibold text-lg px-8 py-6">
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[#e7ac3e]" />
                  <span className="font-medium">Secure Platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[#e7ac3e]" />
                  <span className="font-medium">Real-Time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-[#e7ac3e]" />
                  <span className="font-medium">Family-Focused</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e7ac3e] to-[#5d3010] rounded-3xl transform rotate-3"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc3MjQ5NDE0OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students studying in classroom"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#043c04] mb-4">Powerful Features</h2>
            <p className="text-xl text-[#5d3010] max-w-3xl mx-auto">
              Everything you need to track academic progress and foster better communication
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-[#e2dede] hover:border-[#e7ac3e] hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#043c04] to-[#5d3010] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#043c04] mb-3">{feature.title}</h3>
                  <p className="text-[#5d3010]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#043c04] to-[#5d3010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Four Distinct Roles</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Each role has specific permissions designed to support the educational ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${role.color} rounded-xl mb-4 flex items-center justify-center`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                  <p className="text-white/80 text-sm">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#043c04] mb-4">Supporting Educational Success</h2>
            <p className="text-xl text-[#5d3010]">
              Empowering students, families, and educators to work together
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1720420419622-5f1a528a8bd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwc3R1ZGVudCUyMGxlYXJuaW5nJTIwYm9va3N8ZW58MXx8fHwxNzcyNTUyODI4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Student learning"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#043c04] to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Student Progress</h3>
                <p className="text-sm">Track and improve academic performance</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1589206946274-929e4da3996b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwaGVscGluZyUyMHN0dWRlbnR8ZW58MXx8fHwxNzcyNTQ1OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Teacher helping student"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5d3010] to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold">One-on-One Support</h3>
                <p className="text-sm">Book sessions with teachers and mentors</p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1761370981420-a66e0672e2ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBlZHVjYXRpb24lMjB0b2dldGhlcnxlbnwxfHx8fDE3NzI1NTI4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Family education"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#e7ac3e] to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Family Involvement</h3>
                <p className="text-sm">Keep families connected and informed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#e7ac3e] to-[#e7ac3e]/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#043c04] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#5d3010] mb-10">
            Join Ingabo Marks Track today and transform your educational monitoring experience
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-[#043c04] hover:bg-[#032d03] text-white font-bold text-lg px-12 py-6">
              Access Your Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-[#5d3010]/20">
            <p className="text-sm text-[#5d3010] mb-2">
              <strong>Default Admin Login Credentials:</strong>
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <span>Username: <code className="bg-[#043c04] text-white px-2 py-1 rounded">ingabo</code></span>
              <span>Password: <code className="bg-[#043c04] text-white px-2 py-1 rounded">ingabo1</code></span>
            </div>
            <p className="text-xs text-[#5d3010]/70 mt-2">
              Please change your password after first login
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#043c04] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-[#e7ac3e]" />
            <span className="text-2xl font-bold">Ingabo Marks Track</span>
          </div>
          <p className="text-white/70 mb-6">
            Academic Monitoring & Communication Platform
          </p>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-white/70 hover:text-[#e7ac3e] transition-colors">About</a>
            <a href="#" className="text-white/70 hover:text-[#e7ac3e] transition-colors">Features</a>
            <a href="#" className="text-white/70 hover:text-[#e7ac3e] transition-colors">Support</a>
            <Link to="/login" className="text-white/70 hover:text-[#e7ac3e] transition-colors">Login</Link>
          </div>
          <p className="text-white/50 text-sm">
            © 2026 Ingabo Marks Track. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
