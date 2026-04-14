import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen, Users, FileText, MessageSquare, Bell, Calendar,
  Upload, CheckCircle, Clock, BarChart2, LogOut, Search, Settings,
  Home, Plus, Star, TrendingUp, Eye, Edit, Trash2, Send,
  Award, ChevronRight, Video, PenTool
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { useAuth } from "../context/AuthContext";

const CLASS_ENGAGEMENT = [
  { week: "W1", grade10A: 78, grade10B: 65, grade11: 82 },
  { week: "W2", grade10A: 85, grade10B: 72, grade11: 79 },
  { week: "W3", grade10A: 80, grade10B: 80, grade11: 88 },
  { week: "W4", grade10A: 92, grade10B: 75, grade11: 91 },
];

const ASSIGNMENT_STATS = [
  { name: "Submitted", value: 38 },
  { name: "Pending", value: 12 },
  { name: "Overdue", value: 5 },
];
const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const STUDENT_PERFORMANCE = [
  { subject: "Algebra I", avg: 82, submitted: 45, total: 52 },
  { subject: "Calculus", avg: 75, submitted: 28, total: 35 },
  { subject: "Statistics", avg: 88, submitted: 40, total: 42 },
  { subject: "Physics", avg: 79, submitted: 33, total: 38 },
];

const RESOURCES = [
  { id: 1, title: "Introduction to Quadratic Equations", type: "Video", subject: "Algebra I", views: 142, uploaded: "Apr 1", thumb: "📹" },
  { id: 2, title: "Derivatives & Integrals Worksheet", type: "PDF", subject: "Calculus", views: 89, uploaded: "Mar 28", thumb: "📄" },
  { id: 3, title: "Statistical Analysis Tutorial", type: "Lesson", subject: "Statistics", views: 203, uploaded: "Mar 25", thumb: "📊" },
  { id: 4, title: "Newton's Laws Interactive Demo", type: "Interactive", subject: "Physics", views: 167, uploaded: "Mar 20", thumb: "⚡" },
];

const MENTORSHIP_REQUESTS = [
  { id: 1, student: "Alex Johnson", avatar: "AJ", subject: "Calculus help", grade: "10A", time: "Today, 2pm", status: "pending", color: "bg-blue-500" },
  { id: 2, student: "Priya Sharma", avatar: "PS", subject: "Science fair guidance", grade: "11B", time: "Tomorrow, 3pm", status: "confirmed", color: "bg-teal-500" },
  { id: 3, student: "Jordan Mills", avatar: "JM", subject: "Assignment review", grade: "10B", time: "Apr 8, 10am", status: "pending", color: "bg-violet-500" },
];

const RECENT_SUBMISSIONS = [
  { student: "Alex J.", assignment: "Quadratic Equations", submitted: "2h ago", score: null, avatar: "AJ" },
  { student: "Priya S.", assignment: "Derivative Practice", submitted: "5h ago", score: 92, avatar: "PS" },
  { student: "Jordan M.", assignment: "Statistical Analysis", submitted: "1d ago", score: 85, avatar: "JM" },
  { student: "Emma R.", assignment: "Physics Lab Report", submitted: "2d ago", score: 78, avatar: "ER" },
];

const UPCOMING_EVENTS = [
  { title: "Science Fair Judging", date: "Apr 12", type: "Event", color: "bg-blue-100 text-blue-700" },
  { title: "Parent-Teacher Conference", date: "Apr 15", type: "Meeting", color: "bg-teal-100 text-teal-700" },
  { title: "Algebra I Mid-term", date: "Apr 18", type: "Exam", color: "bg-red-100 text-red-700" },
  { title: "Mentorship Workshop", date: "Apr 22", type: "Workshop", color: "bg-violet-100 text-violet-700" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "classes", label: "Classes", icon: Users },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: FileText },
  { id: "mentorship", label: "Mentorship", icon: MessageSquare },
  { id: "events", label: "Events", icon: Calendar },
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300`}>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg text-slate-800" style={{ fontWeight: 700 }}>EduConnect</span>
          </div>
        </div>

        {/* Teacher card */}
        <div className="p-4 mx-3 mt-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl border border-teal-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{user?.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate" style={{ fontWeight: 600 }}>{user?.name}</p>
              <p className="text-xs text-teal-600">Verified Teacher</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs text-slate-600" style={{ fontWeight: 500 }}>4.9 rating · {user?.points} pts</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === id ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
              style={{ fontWeight: activeTab === id ? 600 : 400 }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === "mentorship" && <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"}`}>2</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500">
              <BarChart2 className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search students, resources..." className="pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-xl focus:outline-none focus:border-teal-300 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{user?.avatar}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl mb-1" style={{ fontWeight: 700 }}>Welcome back, {user?.name?.split(" ")[0]}! 🎓</h1>
                    <p className="text-teal-100">You have 2 pending mentorship requests and 5 submissions to review.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                      + Upload Resource
                    </button>
                    <button className="bg-white text-teal-700 text-sm px-4 py-2 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                      Create Quiz
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: "125", icon: Users, color: "teal", change: "+5 this month" },
                  { label: "Active Classes", value: "4", icon: BookOpen, color: "blue", change: "All active" },
                  { label: "Resources Uploaded", value: "48", icon: Upload, color: "violet", change: "+3 this week" },
                  { label: "Mentorship Sessions", value: "32", icon: MessageSquare, color: "amber", change: "this semester" },
                ].map(({ label, value, icon: Icon, color, change }) => {
                  const cm: Record<string, string> = {
                    teal: "bg-teal-50 text-teal-600",
                    blue: "bg-blue-50 text-blue-600",
                    violet: "bg-violet-50 text-violet-600",
                    amber: "bg-amber-50 text-amber-600",
                  };
                  return (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                      <div className={`w-10 h-10 ${cm[color]} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl text-slate-800 mb-1" style={{ fontWeight: 700 }}>{value}</div>
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className={`text-xs mt-1 ${cm[color].split(" ")[1]}`}>{change}</div>
                    </div>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Class Engagement (4 Weeks)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={CLASS_ENGAGEMENT}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="grade10A" stroke="#2563eb" strokeWidth={2} dot={false} name="Grade 10A" />
                      <Line type="monotone" dataKey="grade10B" stroke="#0d9488" strokeWidth={2} dot={false} name="Grade 10B" />
                      <Line type="monotone" dataKey="grade11" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Grade 11" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Assignment Status</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ASSIGNMENT_STATS} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {ASSIGNMENT_STATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {ASSIGNMENT_STATS.map(({ name, value }, i) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }}></div>
                          <span className="text-slate-600">{name}</span>
                        </div>
                        <span className="text-slate-800" style={{ fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Submissions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Recent Submissions</h3>
                    <button className="text-xs text-teal-600" style={{ fontWeight: 600 }}>View All →</button>
                  </div>
                  <div className="space-y-3">
                    {RECENT_SUBMISSIONS.map(({ student, assignment, submitted, score, avatar }) => (
                      <div key={student} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{student}</p>
                          <p className="text-xs text-slate-500 truncate">{assignment} · {submitted}</p>
                        </div>
                        {score !== null ? (
                          <span className={`text-xs px-2 py-1 rounded-full ${score >= 90 ? "bg-green-100 text-green-700" : score >= 75 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`} style={{ fontWeight: 600 }}>
                            {score}%
                          </span>
                        ) : (
                          <button className="text-xs bg-teal-600 text-white px-3 py-1 rounded-lg" style={{ fontWeight: 600 }}>Review</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Upcoming Schedule</h3>
                    <button className="text-xs text-teal-600" style={{ fontWeight: 600 }}>Full Calendar →</button>
                  </div>
                  <div className="space-y-3">
                    {UPCOMING_EVENTS.map(({ title, date, type, color }) => (
                      <div key={title} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="text-center w-12 flex-shrink-0">
                          <p className="text-lg text-slate-800" style={{ fontWeight: 700 }}>{date.split(" ")[1]}</p>
                          <p className="text-xs text-slate-500">{date.split(" ")[0]}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${color}`} style={{ fontWeight: 600 }}>{type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CLASSES */}
          {activeTab === "classes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>My Classes</h1>
                <button className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl" style={{ fontWeight: 600 }}>+ New Class</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: "Algebra I", grade: "Grade 10A", students: 32, avg: 82, schedule: "Mon/Wed/Fri · 9:00 AM", color: "blue" },
                  { name: "Calculus", grade: "Grade 11B", students: 28, avg: 75, schedule: "Tue/Thu · 10:30 AM", color: "teal" },
                  { name: "Statistics", grade: "Grade 10B", students: 35, avg: 88, schedule: "Mon/Wed · 1:00 PM", color: "violet" },
                  { name: "Physics", grade: "Grade 11A", students: 30, avg: 79, schedule: "Tue/Thu/Fri · 2:00 PM", color: "amber" },
                ].map(({ name, grade, students, avg, schedule, color }) => {
                  const cm: Record<string, string> = {
                    blue: "from-blue-500 to-blue-700",
                    teal: "from-teal-500 to-teal-700",
                    violet: "from-violet-500 to-violet-700",
                    amber: "from-amber-500 to-amber-700",
                  };
                  return (
                    <div key={name} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className={`bg-gradient-to-r ${cm[color]} p-5 text-white`}>
                        <h3 className="text-lg mb-1" style={{ fontWeight: 700 }}>{name}</h3>
                        <p className="text-white/80 text-sm">{grade}</p>
                      </div>
                      <div className="p-5">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            { label: "Students", value: students },
                            { label: "Class Avg", value: `${avg}%` },
                            { label: "Sessions", value: "16" },
                          ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                              <div className="text-lg text-slate-800" style={{ fontWeight: 700 }}>{value}</div>
                              <div className="text-xs text-slate-500">{label}</div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mb-4">📅 {schedule}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors" style={{ fontWeight: 600 }}>View Students</button>
                          <button className="flex-1 text-xs py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors" style={{ fontWeight: 600 }}>Manage</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Subject performance */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Performance by Subject</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={STUDENT_PERFORMANCE} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#0d9488" radius={[6, 6, 0, 0]} name="Class Average %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* RESOURCES */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Resource Library</h1>
                <button className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {RESOURCES.map(({ id, title, type, subject, views, uploaded, thumb }) => (
                  <div key={id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{thumb}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        type === "Video" ? "bg-red-100 text-red-600" :
                        type === "PDF" ? "bg-orange-100 text-orange-600" :
                        type === "Interactive" ? "bg-blue-100 text-blue-600" :
                        "bg-green-100 text-green-600"
                      }`} style={{ fontWeight: 600 }}>{type}</span>
                    </div>
                    <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>{title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{subject} · Uploaded {uploaded}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Eye className="w-3 h-3" />{views} views</span>
                      <div className="flex gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENTORSHIP */}
          {activeTab === "mentorship" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Mentorship</h1>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Sessions", value: 32, color: "teal" },
                  { label: "Pending Requests", value: 2, color: "amber" },
                  { label: "Students Mentored", value: 18, color: "blue" },
                ].map(({ label, value, color }) => {
                  const cm: Record<string, string> = { teal: "bg-teal-50 text-teal-600", amber: "bg-amber-50 text-amber-600", blue: "bg-blue-50 text-blue-600" };
                  return (
                    <div key={label} className={`${cm[color]} rounded-2xl p-5`}>
                      <div className="text-3xl mb-1" style={{ fontWeight: 700 }}>{value}</div>
                      <div className="text-sm">{label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Mentorship Requests</h3>
                <div className="space-y-4">
                  {MENTORSHIP_REQUESTS.map(({ id, student, avatar, subject, grade, time, status, color }) => (
                    <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white text-sm flex-shrink-0`} style={{ fontWeight: 600 }}>{avatar}</div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{student} <span className="text-slate-500" style={{ fontWeight: 400 }}>· Grade {grade}</span></p>
                        <p className="text-xs text-slate-500">{subject} · {time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${status === "confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`} style={{ fontWeight: 600 }}>
                          {status === "confirmed" ? "✓ Confirmed" : "⏳ Pending"}
                        </span>
                        {status === "pending" && (
                          <>
                            <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg" style={{ fontWeight: 600 }}>Accept</button>
                            <button className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg" style={{ fontWeight: 600 }}>Decline</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Events & Calendar</h1>
                <button className="text-sm bg-teal-600 text-white px-4 py-2 rounded-xl" style={{ fontWeight: 600 }}>+ Add Event</button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...UPCOMING_EVENTS, { title: "Math Olympiad Prep", date: "Apr 25", type: "Training", color: "bg-indigo-100 text-indigo-700" }, { title: "End of Term Review", date: "May 1", type: "Exam", color: "bg-red-100 text-red-700" }].map(({ title, date, type, color }) => (
                  <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${color}`} style={{ fontWeight: 600 }}>{type}</span>
                    </div>
                    <h3 className="text-slate-800 mb-2" style={{ fontWeight: 600 }}>{title}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1"><Calendar className="w-4 h-4" />{date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Assignments</h1>
                <button className="text-sm bg-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Plus className="w-4 h-4" /> Create Assignment
                </button>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100">
                      <th className="pb-3 text-sm text-slate-500" style={{ fontWeight: 600 }}>Assignment</th>
                      <th className="pb-3 text-sm text-slate-500 hidden sm:table-cell" style={{ fontWeight: 600 }}>Class</th>
                      <th className="pb-3 text-sm text-slate-500 hidden md:table-cell" style={{ fontWeight: 600 }}>Due Date</th>
                      <th className="pb-3 text-sm text-slate-500" style={{ fontWeight: 600 }}>Submissions</th>
                      <th className="pb-3 text-sm text-slate-500" style={{ fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { title: "Quadratic Equations", class: "Algebra I", due: "Apr 7", submitted: 28, total: 32 },
                      { title: "Derivative Practice", class: "Calculus", due: "Apr 9", submitted: 20, total: 28 },
                      { title: "Statistical Analysis", class: "Statistics", due: "Apr 12", submitted: 35, total: 35 },
                      { title: "Newton's Laws Lab", class: "Physics", due: "Apr 14", submitted: 12, total: 30 },
                    ].map(({ title, class: cls, due, submitted, total }) => (
                      <tr key={title} className="hover:bg-slate-50">
                        <td className="py-4 text-sm text-slate-800" style={{ fontWeight: 500 }}>{title}</td>
                        <td className="py-4 text-sm text-slate-500 hidden sm:table-cell">{cls}</td>
                        <td className="py-4 text-sm text-slate-500 hidden md:table-cell">{due}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-20">
                              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(submitted / total) * 100}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-500">{submitted}/{total}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <button className="text-xs text-teal-600 hover:underline" style={{ fontWeight: 600 }}>Review →</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
