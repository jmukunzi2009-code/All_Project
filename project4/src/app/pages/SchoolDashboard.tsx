import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen, Users, Bell, BarChart2, LogOut, Settings, Home,
  School, Search, TrendingUp, Calendar, Trophy, Megaphone,
  Plus, Edit, Trash2, ChevronRight, GraduationCap, CheckCircle,
  AlertCircle, FileText
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from "recharts";
import { useAuth } from "../context/AuthContext";

const ENROLLMENT_DATA = [
  { month: "Sep", students: 420, teachers: 32 },
  { month: "Oct", students: 435, teachers: 33 },
  { month: "Nov", students: 442, teachers: 34 },
  { month: "Dec", students: 440, teachers: 34 },
  { month: "Jan", students: 455, teachers: 35 },
  { month: "Feb", students: 462, teachers: 36 },
  { month: "Mar", students: 468, teachers: 36 },
  { month: "Apr", students: 475, teachers: 37 },
];

const CLASS_PERFORMANCE = [
  { class: "Grade 9", avg: 79 },
  { class: "Grade 10", avg: 84 },
  { class: "Grade 11", avg: 81 },
  { class: "Grade 12", avg: 87 },
];

const ENGAGEMENT_DATA = [
  { week: "W1", lessons: 1240, projects: 45, events: 8 },
  { week: "W2", lessons: 1380, projects: 52, events: 6 },
  { week: "W3", lessons: 1290, projects: 60, events: 10 },
  { week: "W4", lessons: 1520, projects: 71, events: 12 },
];

const STUDENTS = [
  { id: 1, name: "Alex Johnson", grade: "10A", email: "alex@student.edu", status: "active", points: 2450, projects: 3 },
  { id: 2, name: "Priya Sharma", grade: "11B", email: "priya@student.edu", status: "active", points: 3200, projects: 5 },
  { id: 3, name: "Jordan Mills", grade: "10B", email: "jordan@student.edu", status: "active", points: 2800, projects: 4 },
  { id: 4, name: "Emma Rodriguez", grade: "12A", email: "emma@student.edu", status: "inactive", points: 1200, projects: 1 },
  { id: 5, name: "Sam Kim", grade: "9C", email: "sam@student.edu", status: "active", points: 2300, projects: 2 },
];

const TEACHERS = [
  { id: 1, name: "Dr. Sarah Williams", subjects: "Math, Physics", email: "sarah@teacher.edu", status: "verified", rating: 4.9, students: 125 },
  { id: 2, name: "Prof. David Okafor", subjects: "Biology, Chemistry", email: "david@teacher.edu", status: "verified", rating: 4.8, students: 98 },
  { id: 3, name: "Ms. Linda Chen", subjects: "English, Literature", email: "linda@teacher.edu", status: "pending", rating: 4.7, students: 87 },
  { id: 4, name: "Mr. James Davis", subjects: "History, Social Studies", email: "james@teacher.edu", status: "verified", rating: 4.6, students: 110 },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "End of Term Exams Schedule Released", date: "Apr 6", category: "Academic", important: true },
  { id: 2, title: "Science Fair Registration Now Open", date: "Apr 4", category: "Events", important: false },
  { id: 3, title: "Parent-Teacher Conference — April 15", date: "Apr 2", category: "Meetings", important: true },
  { id: 4, title: "Inter-School Debate Competition", date: "Mar 30", category: "Competition", important: false },
];

const COMPETITIONS = [
  { title: "Science Fair 2026", participants: 48, status: "Ongoing", deadline: "Apr 12" },
  { title: "Math Olympiad", participants: 32, status: "Upcoming", deadline: "Apr 22" },
  { title: "Essay Writing Contest", participants: 65, status: "Ongoing", deadline: "Apr 15" },
  { title: "Coding Challenge", participants: 20, status: "Upcoming", deadline: "May 3" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "students", label: "Students", icon: GraduationCap },
  { id: "teachers", label: "Teachers", icon: Users },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "competitions", label: "Competitions", icon: Trophy },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

export default function SchoolDashboard() {
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
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg text-slate-800" style={{ fontWeight: 700 }}>EduConnect</span>
          </div>
        </div>

        <div className="p-4 mx-3 mt-4 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
              <School className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate" style={{ fontWeight: 600 }}>{user?.name}</p>
              <p className="text-xs text-violet-600">School Account · Verified</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === id ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
              style={{ fontWeight: activeTab === id ? 600 : 400 }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
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
              <input placeholder="Search students, teachers..." className="pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-xl focus:outline-none w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{user?.avatar}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl mb-1" style={{ fontWeight: 700 }}>Riverside High School 🏫</h1>
                    <p className="text-violet-100">School code: <span style={{ fontWeight: 600 }}>RVRSIDE-2026</span> · Active since 2022</p>
                  </div>
                  <button className="bg-white text-violet-700 text-sm px-4 py-2 rounded-xl" style={{ fontWeight: 600 }}>
                    + Post Announcement
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: "475", icon: GraduationCap, color: "violet", change: "+13 this month" },
                  { label: "Teachers", value: "37", icon: Users, color: "blue", change: "1 pending approval" },
                  { label: "Active Classes", value: "24", icon: BookOpen, color: "teal", change: "8 grades" },
                  { label: "Engagement Score", value: "91%", icon: TrendingUp, color: "amber", change: "+4% vs last month" },
                ].map(({ label, value, icon: Icon, color, change }) => {
                  const cm: Record<string, string> = {
                    violet: "bg-violet-50 text-violet-600",
                    blue: "bg-blue-50 text-blue-600",
                    teal: "bg-teal-50 text-teal-600",
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

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Enrollment Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={ENROLLMENT_DATA}>
                      <defs>
                        <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="students" stroke="#7c3aed" fill="url(#violetGrad)" strokeWidth={2} name="Students" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Grade Performance</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={CLASS_PERFORMANCE} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="class" tick={{ fontSize: 12 }} />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="avg" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Avg Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Announcements + Competitions */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Recent Announcements</h3>
                    <button className="text-xs text-violet-600" style={{ fontWeight: 600 }}>View All →</button>
                  </div>
                  <div className="space-y-3">
                    {ANNOUNCEMENTS.slice(0, 3).map(({ id, title, date, category, important }) => (
                      <div key={id} className={`p-3 rounded-xl border ${important ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{title}</p>
                          {important && <span className="text-amber-500 flex-shrink-0">⚠</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{category}</span>
                          <span className="text-xs text-slate-400">{date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Active Competitions</h3>
                    <button className="text-xs text-violet-600" style={{ fontWeight: 600 }}>Manage →</button>
                  </div>
                  <div className="space-y-3">
                    {COMPETITIONS.slice(0, 3).map(({ title, participants, status, deadline }) => (
                      <div key={title} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                        <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{title}</p>
                          <p className="text-xs text-slate-500">{participants} participants · Deadline: {deadline}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${status === "Ongoing" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`} style={{ fontWeight: 600 }}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Students ({STUDENTS.length})</h1>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input placeholder="Search..." className="pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none w-48" />
                  </div>
                  <button className="text-sm bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                    <Plus className="w-4 h-4" /> Add Student
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Student", "Grade", "Email", "Status", "Points", "Projects", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {STUDENTS.map(({ id, name, grade, email, status, points, projects }) => (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                              {name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{grade}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 600 }}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-amber-600" style={{ fontWeight: 600 }}>{points}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{projects}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TEACHERS */}
          {activeTab === "teachers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Teachers ({TEACHERS.length})</h1>
                <button className="text-sm bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Plus className="w-4 h-4" /> Invite Teacher
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {TEACHERS.map(({ id, name, subjects, email, status, rating, students }) => (
                  <div key={id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white" style={{ fontWeight: 600 }}>
                        {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${status === "verified" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`} style={{ fontWeight: 600 }}>
                            {status === "verified" ? "✓ Verified" : "⏳ Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{subjects}</p>
                        <p className="text-xs text-slate-400">{email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">⭐</span>
                        <span className="text-sm text-slate-700" style={{ fontWeight: 600 }}>{rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">{students} students</span>
                      {status === "pending" && (
                        <button className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg" style={{ fontWeight: 600 }}>Approve</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Announcements</h1>
                <button className="text-sm bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Plus className="w-4 h-4" /> New Announcement
                </button>
              </div>
              <div className="space-y-4">
                {ANNOUNCEMENTS.map(({ id, title, date, category, important }) => (
                  <div key={id} className={`bg-white rounded-2xl p-5 shadow-sm border ${important ? "border-amber-200" : "border-slate-100"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${important ? "bg-amber-100" : "bg-violet-100"}`}>
                          <Megaphone className={`w-5 h-5 ${important ? "text-amber-600" : "text-violet-600"}`} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-800 mb-1" style={{ fontWeight: 600 }}>{title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{category}</span>
                            <span className="text-xs text-slate-400">{date}</span>
                            {important && <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>Important</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Post */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Draft New Announcement</h3>
                <input placeholder="Announcement title..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-violet-400" />
                <textarea placeholder="Announcement body..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-violet-400 resize-none h-24" />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="rounded" /> Mark as important
                  </label>
                  <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                    Publish Announcement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* COMPETITIONS */}
          {activeTab === "competitions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Competitions & Events</h1>
                <button className="text-sm bg-violet-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Plus className="w-4 h-4" /> Create Competition
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {COMPETITIONS.map(({ title, participants, status, deadline }) => (
                  <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${status === "Ongoing" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`} style={{ fontWeight: 600 }}>
                        {status}
                      </span>
                    </div>
                    <h3 className="text-slate-800 mb-2" style={{ fontWeight: 600 }}>{title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{participants} participants</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {deadline}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl" style={{ fontWeight: 600 }}>View Details</button>
                      <button className="flex-1 text-xs py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl" style={{ fontWeight: 600 }}>Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Platform Analytics</h1>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Engagement Overview (4 Weeks)</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="lessons" stroke="#7c3aed" strokeWidth={2} name="Lesson Views" />
                    <Line type="monotone" dataKey="projects" stroke="#0d9488" strokeWidth={2} name="Project Actions" />
                    <Line type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={2} name="Event Signups" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Lesson Completion Rate", value: "78%", trend: "+5%", color: "violet" },
                  { label: "Assignment Submission Rate", value: "85%", trend: "+3%", color: "teal" },
                  { label: "Active Daily Users", value: "312", trend: "+18", color: "blue" },
                  { label: "Project Participation", value: "62%", trend: "+8%", color: "amber" },
                  { label: "Forum Engagement", value: "44%", trend: "+12%", color: "green" },
                  { label: "Mentorship Sessions/Month", value: "87", trend: "+15", color: "rose" },
                ].map(({ label, value, trend, color }) => {
                  const cm: Record<string, string> = {
                    violet: "text-violet-600", teal: "text-teal-600", blue: "text-blue-600",
                    amber: "text-amber-600", green: "text-green-600", rose: "text-rose-600",
                  };
                  return (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                      <div className="text-2xl text-slate-800 mb-1" style={{ fontWeight: 700 }}>{value}</div>
                      <div className="text-sm text-slate-600 mb-2">{label}</div>
                      <div className={`text-xs ${cm[color]} flex items-center gap-1`}>
                        <TrendingUp className="w-3 h-3" /> {trend} this month
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
