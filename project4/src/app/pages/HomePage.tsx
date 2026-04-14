import { Link } from "react-router";
import { motion } from "motion/react";
import {
  BookOpen, Users, Trophy, Rocket, MessageSquare, Calendar,
  ArrowRight, Star, CheckCircle, GraduationCap, School, Shield,
  TrendingUp, Globe, Heart, Zap, ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const HERO_IMG = "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxlYXJuaW5nJTIwdG9nZXRoZXIlMjBjbGFzc3Jvb218ZW58MXx8fHwxNzc1NDczNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080";
const MENTOR_IMG = "https://images.unsplash.com/photo-1758685733907-42e9651721f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwbWVudG9yaW5nJTIwc3R1ZGVudCUyMG9uZSUyMG9uJTIwb25lfGVufDF8fHx8MTc3NTQ3MzQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080";
const COMMUNITY_IMG = "https://images.unsplash.com/photo-1544928938-6852c1925194?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwcm9qZWN0JTIwdm9sdW50ZWVycyUyMHlvdXRofGVufDF8fHx8MTc3NTQ3MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080";
const ACHIEVEMENT_IMG = "https://images.unsplash.com/photo-1659080907377-ee6a57fb6b9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNoaWV2ZW1lbnQlMjBhd2FyZCUyMHRyb3BoeXxlbnwxfHx8fDE3NzU0NzM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080";
const ONLINE_LEARNING_IMG = "https://images.unsplash.com/photo-1771408427146-09be9a1d4535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBsZWFybmluZyUyMGxhcHRvcCUyMGVkdWNhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzc1NDczNDk1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const GROUP_STUDY_IMG = "https://images.unsplash.com/photo-1758270705290-62b6294dd044?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwc3R1ZGVudHMlMjB3b3JraW5nJTIwdG9nZXRoZXIlMjBncm91cCUyMHN0dWR5fGVufDF8fHx8MTc3NTQ3MzQ5OXww&ixlib=rb-4.1.0&q=80&w=1080";

const FEATURES = [
  {
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
    title: "Smart Learning Resources",
    desc: "Access structured lessons, videos, and materials curated by verified teachers across all subjects.",
  },
  {
    icon: Users,
    color: "bg-teal-100 text-teal-600",
    title: "Mentorship Program",
    desc: "Connect students with experienced teachers and community professionals for personalized guidance.",
  },
  {
    icon: Rocket,
    color: "bg-violet-100 text-violet-600",
    title: "Community Projects",
    desc: "Collaborate on real-world projects that create impact in schools, neighborhoods, and beyond.",
  },
  {
    icon: Trophy,
    color: "bg-amber-100 text-amber-600",
    title: "Gamification & Achievements",
    desc: "Earn points, unlock badges, and climb leaderboards to stay motivated and recognize progress.",
  },
  {
    icon: Calendar,
    color: "bg-rose-100 text-rose-600",
    title: "Events & Competitions",
    desc: "Participate in school-wide and inter-school events, science fairs, debates, and challenges.",
  },
  {
    icon: MessageSquare,
    color: "bg-green-100 text-green-600",
    title: "Discussion Forums",
    desc: "Engage in safe, moderated discussions with peers, teachers, and community members.",
  },
];

const STATS = [
  { value: "50,000+", label: "Active Students", icon: GraduationCap },
  { value: "3,200+", label: "Verified Teachers", icon: Users },
  { value: "480+", label: "Partner Schools", icon: School },
  { value: "1,800+", label: "Community Projects", icon: Globe },
];

const HOW_IT_WORKS = [
  {
    role: "Students",
    icon: GraduationCap,
    color: "blue",
    steps: [
      "Sign up with your school code or email",
      "Explore lessons, join projects & take quizzes",
      "Earn points & badges, track your progress",
    ],
    cta: "Join as Student",
    path: "/signup?role=student",
  },
  {
    role: "Teachers",
    icon: Users,
    color: "teal",
    steps: [
      "Register with verified credentials",
      "Upload lessons, create assignments & quizzes",
      "Mentor students and monitor their growth",
    ],
    cta: "Join as Teacher",
    path: "/signup?role=teacher",
  },
  {
    role: "Schools",
    icon: School,
    color: "violet",
    steps: [
      "Create your school account & get verified",
      "Manage students, teachers, and classes",
      "Post announcements & organize competitions",
    ],
    cta: "Register School",
    path: "/signup?role=school",
  },
];

const TESTIMONIALS = [
  {
    name: "Maya Chen",
    role: "Grade 10 Student",
    school: "Lincoln Academy",
    text: "EduConnect changed how I learn. I found a mentor who helped me prepare for science competitions, and now I have 3 gold badges!",
    rating: 5,
    avatar: "MC",
    color: "bg-blue-500",
  },
  {
    name: "Mr. David Okafor",
    role: "Math Teacher",
    school: "Greenwood High",
    text: "The platform makes it so easy to share resources and track student progress. The mentorship features are outstanding.",
    rating: 5,
    avatar: "DO",
    color: "bg-teal-500",
  },
  {
    name: "Principal Lisa Torres",
    role: "School Administrator",
    school: "Riverside High School",
    text: "Our school engagement increased by 60% after joining EduConnect. The inter-school competitions are a huge motivator!",
    rating: 5,
    avatar: "LT",
    color: "bg-violet-500",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm mb-6">
                <Zap className="w-4 h-4" />
                The Future of Education is Here
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl text-white mb-6" style={{ fontWeight: 800, lineHeight: 1.15 }}>
                Learn, Collaborate,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                  Impact Your Community
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                EduConnect brings students, teachers, and schools together on one powerful platform — enabling personalized learning, expert mentorship, and community-driven projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all"
                  style={{ fontWeight: 600 }}
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl transition-all"
                  style={{ fontWeight: 600 }}
                >
                  Demo Login <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {["bg-blue-500", "bg-teal-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"].map((c, i) => (
                    <div key={i} className={`w-8 h-8 ${c} rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs`} style={{ fontWeight: 600 }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-slate-400 text-sm">Trusted by 50,000+ learners</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
                  <ImageWithFallback src={HERO_IMG} alt="Students learning together" className="w-full h-80 object-cover" />
                </div>
                {/* Floating cards */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">This week</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 700 }}>+142 new learners</p>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Badges earned today</p>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 700 }}>328 achievements</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-white"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl lg:text-4xl text-white mb-1" style={{ fontWeight: 800 }}>{value}</div>
                <div className="text-blue-100 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-sm uppercase tracking-wider" style={{ fontWeight: 600 }}>Platform Features</span>
            <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 mb-4" style={{ fontWeight: 700 }}>
              Everything You Need to Thrive
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              From structured lessons to community projects, EduConnect provides all the tools students, teachers, and schools need to succeed together.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 group"
              >
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-slate-800 mb-2" style={{ fontWeight: 600 }}>{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-teal-600 text-sm uppercase tracking-wider" style={{ fontWeight: 600 }}>Mentorship</span>
              <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 mb-4" style={{ fontWeight: 700 }}>
                One-on-One Expert Guidance
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Every student deserves personalized attention. Our mentorship system connects learners with qualified teachers and community professionals who guide them through challenges and opportunities.
              </p>
              <ul className="space-y-3">
                {["Match with teachers based on your interests", "Schedule sessions at your convenience", "Get feedback on assignments and projects", "Track your mentorship journey over time"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-600 text-sm">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup?role=student" className="inline-flex items-center gap-2 mt-8 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                Find a Mentor <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback src={MENTOR_IMG} alt="Teacher mentoring student" className="w-full h-72 object-cover" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>SW</div>
                  <div>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Dr. Sarah Williams</p>
                    <p className="text-xs text-slate-500">Physics & Math Mentor · ⭐ 4.9 rating</p>
                  </div>
                  <button className="ml-auto bg-teal-600 text-white text-xs px-3 py-1.5 rounded-lg" style={{ fontWeight: 600 }}>
                    Request Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-md">
                  <ImageWithFallback src={COMMUNITY_IMG} alt="Community project" className="w-full h-48 object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md mt-8">
                  <ImageWithFallback src={ACHIEVEMENT_IMG} alt="Achievement" className="w-full h-48 object-cover" />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <span className="text-violet-600 text-sm uppercase tracking-wider" style={{ fontWeight: 600 }}>Community Projects</span>
              <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 mb-4" style={{ fontWeight: 700 }}>
                Learn by Making a Real Impact
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Students don't just learn theories — they apply them to real community challenges. From environmental campaigns to tech for social good, every project earns badges and real-world experience.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Active Projects", value: "1,800+", color: "text-violet-600" },
                  { label: "Communities Served", value: "320+", color: "text-blue-600" },
                  { label: "Student Volunteers", value: "15,000+", color: "text-teal-600" },
                  { label: "Hours Contributed", value: "120K+", color: "text-amber-600" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4">
                    <div className={`text-2xl ${color} mb-1`} style={{ fontWeight: 700 }}>{value}</div>
                    <div className="text-slate-500 text-sm">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-sm uppercase tracking-wider" style={{ fontWeight: 600 }}>Get Started</span>
            <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 mb-4" style={{ fontWeight: 700 }}>
              How EduConnect Works
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Join thousands of students, teachers, and schools already transforming education.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ role, icon: Icon, color, steps, cta, path }, i) => {
              const colorMap: Record<string, string> = {
                blue: "border-blue-200 bg-blue-600",
                teal: "border-teal-200 bg-teal-600",
                violet: "border-violet-200 bg-violet-600",
              };
              return (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-2xl p-8 border-2 ${colorMap[color].split(" ")[0]} shadow-sm`}
                >
                  <div className={`w-12 h-12 ${colorMap[color].split(" ")[1]} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-slate-800 text-lg mb-4" style={{ fontWeight: 700 }}>For {role}</h3>
                  <ol className="space-y-3 mb-6">
                    {steps.map((step, si) => (
                      <li key={si} className="flex items-start gap-3 text-slate-600 text-sm">
                        <span className={`w-6 h-6 ${colorMap[color].split(" ")[1]} text-white rounded-full flex items-center justify-center text-xs flex-shrink-0`} style={{ fontWeight: 600 }}>
                          {si + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <Link
                    to={path}
                    className={`flex items-center justify-center gap-2 w-full ${colorMap[color].split(" ")[1]} hover:opacity-90 text-white px-4 py-3 rounded-xl transition-opacity text-sm`}
                    style={{ fontWeight: 600 }}
                  >
                    {cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-amber-600 text-sm uppercase tracking-wider" style={{ fontWeight: 600 }}>Gamification</span>
              <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 mb-4" style={{ fontWeight: 700 }}>
                Learn More, Earn More
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our gamification system keeps students engaged and motivated. Complete assignments, join projects, and help peers to earn points, unlock badges, and rise on the leaderboard.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🏆", label: "Badges", value: "150+ unique badges", color: "bg-amber-50 border-amber-200" },
                  { icon: "⚡", label: "Points System", value: "Earn for every action", color: "bg-blue-50 border-blue-200" },
                  { icon: "🏅", label: "Leaderboards", value: "Weekly & monthly", color: "bg-teal-50 border-teal-200" },
                  { icon: "🎖️", label: "Levels", value: "25 levels to reach", color: "bg-violet-50 border-violet-200" },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} className={`${color} border rounded-xl p-4`}>
                    <div className="text-2xl mb-2">{icon}</div>
                    <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{label}</p>
                    <p className="text-slate-500 text-xs">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback src={ONLINE_LEARNING_IMG} alt="Online learning" className="w-full h-72 object-cover" />
              </div>
              {/* Leaderboard preview */}
              <div className="absolute top-4 -left-6 bg-white rounded-2xl shadow-xl p-4 w-52">
                <p className="text-sm text-slate-800 mb-3" style={{ fontWeight: 700 }}>🏆 Top Learners</p>
                {[
                  { name: "Alex J.", pts: 2450, rank: "🥇" },
                  { name: "Priya S.", pts: 2310, rank: "🥈" },
                  { name: "Jordan M.", pts: 2200, rank: "🥉" },
                ].map(({ name, pts, rank }) => (
                  <div key={name} className="flex items-center justify-between py-1">
                    <span className="text-lg">{rank}</span>
                    <span className="text-sm text-slate-700 flex-1 ml-2">{name}</span>
                    <span className="text-xs text-amber-600" style={{ fontWeight: 600 }}>{pts}p</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-sm uppercase tracking-wider" style={{ fontWeight: 600 }}>Testimonials</span>
            <h2 className="text-3xl lg:text-4xl text-slate-900 mt-2 mb-4" style={{ fontWeight: 700 }}>
              Voices from Our Community
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, school, text, rating, avatar, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white text-sm`} style={{ fontWeight: 600 }}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{name}</p>
                    <p className="text-xs text-slate-500">{role} · {school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Group study image section */}
      <section className="relative h-64 overflow-hidden">
        <ImageWithFallback src={GROUP_STUDY_IMG} alt="Students working together" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-teal-900/60 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl mb-2" style={{ fontWeight: 700 }}>Join the EduConnect Community</h2>
            <p className="text-blue-200 mb-6">50,000+ learners are already growing together</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              style={{ fontWeight: 700 }}
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl text-white mb-4" style={{ fontWeight: 700 }}>
            Ready to Transform Education?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Whether you're a student eager to learn, a teacher ready to inspire, or a school looking to grow — EduConnect is your platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg" style={{ fontWeight: 700 }}>
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-xl transition-colors text-lg" style={{ fontWeight: 600 }}>
              <Shield className="w-5 h-5" /> Demo Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
