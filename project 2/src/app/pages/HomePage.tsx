import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  School,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Sun,
  Moon,
  UserCircle,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'headmaster':
          navigate('/headmaster');
          break;
        case 'teacher':
        case 'class_teacher':
          navigate('/teacher');
          break;
        case 'student':
          navigate('/student');
          break;
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage teachers, students, and staff efficiently',
    },
    {
      icon: BookOpen,
      title: 'Academic Management',
      description: 'Handle classes, subjects, and curriculum',
    },
    {
      icon: ClipboardList,
      title: 'Marks & Attendance',
      description: 'Record and track student performance',
    },
    {
      icon: FileText,
      title: 'Reports',
      description: 'Generate term and yearly reports',
    },
    {
      icon: MessageSquare,
      title: 'Messaging',
      description: 'Communicate with teachers and students',
    },
    {
      icon: Calendar,
      title: 'Academic Terms',
      description: 'Manage terms and academic years',
    },
  ];

  const roles = [
    {
      icon: UserCircle,
      title: 'Admin',
      description: 'Full system control and management',
      color: 'text-red-500',
    },
    {
      icon: GraduationCap,
      title: 'Headmaster',
      description: 'Supervision and performance monitoring',
      color: 'text-purple-500',
    },
    {
      icon: Users,
      title: 'Teachers',
      description: 'Marks, attendance, and subject management',
      color: 'text-blue-500',
    },
    {
      icon: School,
      title: 'Class Teachers',
      description: 'Report generation and class management',
      color: 'text-green-500',
    },
    {
      icon: BookOpen,
      title: 'Students',
      description: 'View marks, reports, and attendance',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        >
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900/90" />
      </div>

      <div className="relative">
        {/* Welcome Popup */}
        {showWelcome && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <Card className="w-80 shadow-2xl shadow-slate-950/50 border-white/10 bg-slate-900/95">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <School className="size-5 text-sky-400" />
                  Welcome to School Management System
                </CardTitle>
                <CardDescription>
                  A complete platform for academic and administrative school management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowWelcome(false)}
                  variant="outline"
                  className="w-full"
                >
                  Got it!
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Header */}
        <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-sm">
          <div className="container mx-auto flex h-20 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <School className="size-8 text-sky-400" />
              <div>
                <h1 className="text-lg font-semibold text-white">School Management System</h1>
                <p className="text-sm text-slate-400">Simple, readable, and powerful for every school.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button size="lg" onClick={() => navigate('/login')}>
                Login
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-sm font-medium text-sky-200 ring-1 ring-sky-400/20">
                School app built for clarity and accessibility
              </div>
              <div className="space-y-4">
                <h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">
                  Manage your school with one clear, modern dashboard.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  From class creation to attendance, marks, reports, and messaging — everything is designed for school teams, parents, and students.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/login')}>
                  Start Free Demo
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Explore Features
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-3xl font-semibold text-white">100+</p>
                  <p className="text-sm text-slate-400">Schools supported</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-3xl font-semibold text-white">24/7</p>
                  <p className="text-sm text-slate-400">Reliable access</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                  <p className="text-3xl font-semibold text-white">5K+</p>
                  <p className="text-sm text-slate-400">Student records managed</p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/60">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80"
                alt="School campus"
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* About School Section */}
        <section className="container mx-auto px-4 pb-24">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <span className="text-sm uppercase tracking-[0.35em] text-sky-300">About the project</span>
              <h3 className="text-4xl font-semibold text-white">A school dashboard designed for everyone.</h3>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Clean visual hierarchy, readable color contrast, and responsive layouts make the system easy to use for school leaders, teachers, and students.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-white/10 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-white">Clear Reporting</CardTitle>
                    <CardDescription>Track attendance and marks with confidence.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-white/10 bg-slate-900/70">
                  <CardHeader>
                    <CardTitle className="text-white">Teacher Assignments</CardTitle>
                    <CardDescription>Assign subjects and classes with one click.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80"
                alt="School classroom"
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 pb-24">
          <h2 className="text-3xl font-semibold text-white text-center mb-12">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-white/10 bg-slate-900/80 hover:border-sky-500/40 hover:shadow-sky-500/10 transition-all">
                <CardHeader>
                  <feature.icon className="size-10 text-sky-400 mb-3" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Campus Gallery */}
        <section className="container mx-auto px-4 pb-24">
          <h2 className="text-3xl font-semibold text-white text-center mb-12">Campus Gallery</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <img
              src="https://images.unsplash.com/photo-1598360740326-7e1f6ce5cc9b?auto=format&fit=crop&w=1000&q=80"
              alt="School campus building"
              className="h-72 w-full rounded-[32px] object-cover shadow-2xl shadow-slate-950/30"
            />
            <img
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=80"
              alt="Students working together"
              className="h-72 w-full rounded-[32px] object-cover shadow-2xl shadow-slate-950/30"
            />
            <img
              src="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=1000&q=80"
              alt="School event"
              className="h-72 w-full rounded-[32px] object-cover shadow-2xl shadow-slate-950/30"
            />
          </div>
        </section>

        {/* Roles Section */}
        <section className="container mx-auto px-4 pb-24">
          <h2 className="text-3xl font-semibold text-white text-center mb-12">Who can use it?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {roles.map((role, index) => (
              <Card key={index} className="text-center border-white/10 bg-slate-900/80 hover:bg-slate-900/95 transition-all">
                <CardHeader>
                  <role.icon className={`size-12 mx-auto mb-3 ${role.color}`} />
                  <CardTitle className="text-white">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10">
          <div className="container mx-auto px-4 text-center text-slate-400">
            <p>&copy; 2026 School Management System. Built for readable and reliable school management.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
