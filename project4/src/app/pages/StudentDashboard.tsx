import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen, Trophy, Rocket, MessageSquare, Bell, Star, TrendingUp,
  CheckCircle, Clock, Play, FileText, Target, Users, Calendar,
  Award, ChevronRight, BarChart2, Zap, LogOut, Search, Settings,
  Home, ThumbsUp, Send
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, Legend
} from "recharts";
import { useAuth } from "../context/AuthContext";

const WEEKLY_PROGRESS = [
  { day: "Mon", points: 120, lessons: 3 },
  { day: "Tue", points: 85, lessons: 2 },
  { day: "Wed", points: 210, lessons: 5 },
  { day: "Thu", points: 160, lessons: 4 },
  { day: "Fri", points: 280, lessons: 6 },
  { day: "Sat", points: 95, lessons: 2 },
  { day: "Sun", points: 50, lessons: 1 },
];

const SUBJECT_DATA = [
  { subject: "Math", score: 82 },
  { subject: "Science", score: 91 },
  { subject: "English", score: 76 },
  { subject: "History", score: 88 },
  { subject: "Art", score: 95 },
];

const RADAR_DATA = [
  { skill: "Problem Solving", value: 85 },
  { skill: "Creativity", value: 92 },
  { skill: "Teamwork", value: 78 },
  { skill: "Communication", value: 88 },
  { skill: "Critical Thinking", value: 80 },
  { skill: "Research", value: 75 },
];

const LESSONS = [
  { id: 1, title: "Introduction to Algebra", subject: "Math", teacher: "Dr. Williams", duration: "45 min", progress: 100, status: "completed", thumb: "📐" },
  { id: 2, title: "The Cell Cycle & Mitosis", subject: "Biology", teacher: "Prof. Okafor", duration: "38 min", progress: 65, status: "in-progress", thumb: "🔬" },
  { id: 3, title: "Shakespeare's Sonnets", subject: "English", teacher: "Ms. Chen", duration: "30 min", progress: 0, status: "not-started", thumb: "📝" },
  { id: 4, title: "World War II Overview", subject: "History", teacher: "Mr. Davis", duration: "52 min", progress: 100, status: "completed", thumb: "🌍" },
  { id: 5, title: "Newton's Laws of Motion", subject: "Physics", teacher: "Dr. Williams", duration: "40 min", progress: 20, status: "in-progress", thumb: "⚡" },
  { id: 6, title: "Digital Art Fundamentals", subject: "Art", teacher: "Ms. Park", duration: "60 min", progress: 0, status: "not-started", thumb: "🎨" },
];

const ASSIGNMENTS = [
  { id: 1, title: "Quadratic Equations Worksheet", subject: "Math", due: "Tomorrow", status: "pending", points: 50 },
  { id: 2, title: "Essay: Themes in Macbeth", subject: "English", due: "Apr 10", status: "pending", points: 80 },
  { id: 3, title: "Cell Diagram Labeling", subject: "Biology", due: "Apr 8", status: "submitted", points: 30 },
  { id: 4, title: "History Timeline Project", subject: "History", due: "Apr 15", status: "pending", points: 100 },
  { id: 5, title: "Physics Lab Report", subject: "Physics", due: "Apr 7", status: "overdue", points: 60 },
];

const PROJECTS = [
  { id: 1, title: "Community Garden Initiative", category: "Environment", members: 12, progress: 45, role: "Member", daysLeft: 18 },
  { id: 2, title: "Peer Tutoring Network", category: "Education", members: 8, progress: 70, role: "Leader", daysLeft: 7 },
  { id: 3, title: "Local History Digital Archive", category: "Culture", members: 15, progress: 30, role: "Member", daysLeft: 35 },
];

const LEADERBOARD = [
  { rank: 1, name: "Priya S.", points: 3200, badge: "🥇", school: "Lincoln Academy" },
  { rank: 2, name: "Jordan M.", points: 2800, badge: "🥈", school: "Greenwood High" },
  { rank: 3, name: "Alex J.", points: 2450, badge: "🥉", school: "Riverside High", isYou: true },
  { rank: 4, name: "Sam K.", points: 2300, badge: "4", school: "City School" },
  { rank: 5, name: "Emma R.", points: 2100, badge: "5", school: "West Academy" },
];

const FORUM_POSTS = [
  { id: 1, author: "Jordan M.", avatar: "JM", subject: "Math", title: "How to solve this calculus problem?", replies: 8, likes: 12, time: "2h ago", color: "bg-blue-500" },
  { id: 2, author: "Priya S.", avatar: "PS", subject: "Biology", title: "Anyone else confused by the cell cycle?", replies: 5, likes: 9, time: "4h ago", color: "bg-teal-500" },
  { id: 3, author: "Sam K.", avatar: "SK", subject: "English", title: "Let's discuss Macbeth themes together", replies: 14, likes: 21, time: "1d ago", color: "bg-violet-500" },
];

const BADGES = [
  { icon: "🌟", name: "Star Learner", desc: "10 lessons completed" },
  { icon: "🔥", name: "On Fire", desc: "7-day streak" },
  { icon: "🤝", name: "Team Player", desc: "Joined 3 projects" },
  { icon: "📚", name: "Bookworm", desc: "50+ lessons done" },
  { icon: "🎯", name: "Goal Setter", desc: "Completed goals" },
  { icon: "💡", name: "Innovator", desc: "Created a project" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "lessons", label: "Lessons", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: FileText },
  { id: "projects", label: "Projects", icon: Rocket },
  { id: "forum", label: "Forum", icon: MessageSquare },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

const NOTIFICATIONS = [
  { icon: "📝", text: "New assignment: Quadratic Equations", time: "30 min ago", unread: true },
  { icon: "🏆", text: "You earned the '7-Day Streak' badge!", time: "2h ago", unread: true },
  { icon: "💬", text: "Dr. Williams replied to your forum post", time: "3h ago", unread: false },
  { icon: "📅", text: "Science Fair registration opens tomorrow", time: "1d ago", unread: false },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const levelProgress = ((user?.points || 0) % 500) / 5;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300`}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg text-slate-800" style={{ fontWeight: 700 }}>EduConnect</span>
          </div>
        </div>

        {/* User card */}
        <div className="p-4 mx-3 mt-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
              {user?.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate" style={{ fontWeight: 600 }}>{user?.name}</p>
              <p className="text-xs text-blue-600">Level {user?.level} · {user?.points} pts</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>XP Progress</span><span>{levelProgress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-blue-200 rounded-full">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${levelProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              style={{ fontWeight: activeTab === id ? 600 : 400 }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === "assignments" && <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>3</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-700">
              <BarChart2 className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search lessons, assignments..." className="pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:border-blue-300 w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{user?.avatar}</div>
              <span className="hidden sm:block text-sm text-slate-700" style={{ fontWeight: 600 }}>{user?.name?.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl mb-1" style={{ fontWeight: 700 }}>Good Morning, {user?.name?.split(" ")[0]}! 👋</h1>
                    <p className="text-blue-100">You're on a 7-day streak! Keep it up.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center bg-white/20 rounded-xl p-3">
                      <div className="text-2xl" style={{ fontWeight: 700 }}>{user?.points}</div>
                      <div className="text-xs text-blue-100">Points</div>
                    </div>
                    <div className="text-center bg-white/20 rounded-xl p-3">
                      <div className="text-2xl" style={{ fontWeight: 700 }}>{user?.badges}</div>
                      <div className="text-xs text-blue-100">Badges</div>
                    </div>
                    <div className="text-center bg-white/20 rounded-xl p-3">
                      <div className="text-2xl" style={{ fontWeight: 700 }}>Lv.{user?.level}</div>
                      <div className="text-xs text-blue-100">Level</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Lessons Done", value: "24", icon: BookOpen, color: "blue", change: "+3 this week" },
                  { label: "Assignments", value: "3", icon: FileText, color: "red", change: "pending" },
                  { label: "Projects", value: "3", icon: Rocket, color: "violet", change: "active" },
                  { label: "Forum Posts", value: "8", icon: MessageSquare, color: "green", change: "+2 replies" },
                ].map(({ label, value, icon: Icon, color, change }) => {
                  const colorMap: Record<string, string> = {
                    blue: "bg-blue-50 text-blue-600 border-blue-100",
                    red: "bg-red-50 text-red-600 border-red-100",
                    violet: "bg-violet-50 text-violet-600 border-violet-100",
                    green: "bg-green-50 text-green-600 border-green-100",
                  };
                  return (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                      <div className={`w-10 h-10 ${colorMap[color].split(" ").slice(0, 2).join(" ")} rounded-xl flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl text-slate-800 mb-1" style={{ fontWeight: 700 }}>{value}</div>
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className={`text-xs mt-1 ${colorMap[color].split(" ")[1]}`}>{change}</div>
                    </div>
                  );
                })}
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Weekly Activity</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={WEEKLY_PROGRESS}>
                      <defs>
                        <linearGradient id="ptGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="points" stroke="#2563eb" fill="url(#ptGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Subject Performance</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={SUBJECT_DATA} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#0d9488" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Row: Notifications + Leaderboard */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Notifications</h3>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full" style={{ fontWeight: 600 }}>2 new</span>
                  </div>
                  <div className="space-y-3">
                    {NOTIFICATIONS.map((n, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${n.unread ? "bg-blue-50" : "bg-slate-50"}`}>
                        <span className="text-lg">{n.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${n.unread ? "text-slate-800" : "text-slate-600"}`} style={{ fontWeight: n.unread ? 500 : 400 }}>{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-800" style={{ fontWeight: 600 }}>🏆 Weekly Leaderboard</h3>
                    <button className="text-xs text-blue-600" style={{ fontWeight: 600 }}>View All</button>
                  </div>
                  <div className="space-y-2">
                    {LEADERBOARD.map(({ rank, name, points, badge, isYou }) => (
                      <div key={rank} className={`flex items-center gap-3 p-3 rounded-xl ${isYou ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"}`}>
                        <span className="text-lg w-8 text-center">{badge.length === 1 ? badge : <span className="text-sm text-slate-500" style={{ fontWeight: 600 }}>#{badge}</span>}</span>
                        <span className={`text-sm flex-1 ${isYou ? "text-blue-700" : "text-slate-700"}`} style={{ fontWeight: isYou ? 700 : 400 }}>
                          {name} {isYou && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full ml-1">You</span>}
                        </span>
                        <span className="text-sm text-amber-600" style={{ fontWeight: 600 }}>{points}p</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LESSONS TAB */}
          {activeTab === "lessons" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>My Lessons</h1>
                <div className="flex gap-2">
                  {["All", "In Progress", "Completed", "New"].map(f => (
                    <button key={f} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${f === "All" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`} style={{ fontWeight: 600 }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {LESSONS.map(({ id, title, subject, teacher, duration, progress, status, thumb }) => (
                  <div key={id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{thumb}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status === "completed" ? "bg-green-100 text-green-700" :
                        status === "in-progress" ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-500"
                      }`} style={{ fontWeight: 600 }}>
                        {status === "completed" ? "✓ Done" : status === "in-progress" ? "In Progress" : "New"}
                      </span>
                    </div>
                    <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>{title}</h3>
                    <p className="text-xs text-slate-500 mb-1">{subject} · {teacher}</p>
                    <p className="text-xs text-slate-400 mb-3">⏱ {duration}</p>
                    {status !== "not-started" && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span><span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full">
                          <div className={`h-full rounded-full ${status === "completed" ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )}
                    <button className="w-full flex items-center justify-center gap-2 text-xs py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                      <Play className="w-3 h-3" />
                      {status === "completed" ? "Review" : status === "in-progress" ? "Continue" : "Start"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSIGNMENTS TAB */}
          {activeTab === "assignments" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Assignments</h1>
              <div className="grid sm:grid-cols-3 gap-4 mb-2">
                {[
                  { label: "Pending", count: 3, color: "text-amber-600 bg-amber-50 border-amber-200" },
                  { label: "Submitted", count: 1, color: "text-green-600 bg-green-50 border-green-200" },
                  { label: "Overdue", count: 1, color: "text-red-600 bg-red-50 border-red-200" },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`${color} border rounded-xl p-4 text-center`}>
                    <div className="text-2xl mb-1" style={{ fontWeight: 700 }}>{count}</div>
                    <div className="text-sm">{label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {ASSIGNMENTS.map(({ id, title, subject, due, status, points }) => (
                  <div key={id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status === "pending" ? "bg-amber-500" : status === "submitted" ? "bg-green-500" : "bg-red-500"}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{title}</p>
                      <p className="text-xs text-slate-500">{subject} · Due: {due} · {points} pts</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status === "pending" ? "bg-amber-100 text-amber-700" :
                        status === "submitted" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`} style={{ fontWeight: 600 }}>
                        {status === "pending" ? "⏳ Pending" : status === "submitted" ? "✓ Submitted" : "⚠ Overdue"}
                      </span>
                      {status !== "submitted" && (
                        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition-colors" style={{ fontWeight: 600 }}>
                          {status === "overdue" ? "Submit Late" : "Start"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Community Projects</h1>
                <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                  + Browse Projects
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROJECTS.map(({ id, title, category, members, progress, role, daysLeft }) => (
                  <div key={id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full" style={{ fontWeight: 600 }}>{category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${role === "Leader" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`} style={{ fontWeight: 600 }}>
                        {role}
                      </span>
                    </div>
                    <h3 className="text-slate-800 mb-3" style={{ fontWeight: 600 }}>{title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{members} members</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{daysLeft}d left</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span><span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <button className="w-full text-xs py-2 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                      View Project →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FORUM TAB */}
          {activeTab === "forum" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Discussion Forum</h1>
                <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                  + New Post
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {["All", "Math", "Science", "English", "History", "General"].map(s => (
                  <button key={s} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${s === "All" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`} style={{ fontWeight: 600 }}>{s}</button>
                ))}
              </div>

              <div className="space-y-4">
                {FORUM_POSTS.map(({ id, author, avatar, subject, title, replies, likes, time, color }) => (
                  <div key={id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`} style={{ fontWeight: 600 }}>{avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{author}</span>
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{subject}</span>
                          <span className="text-xs text-slate-400 ml-auto">{time}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{title}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />{likes}
                          </button>
                          <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                            <MessageSquare className="w-3.5 h-3.5" />{replies} replies
                          </button>
                          <button className="ml-auto text-xs text-blue-600 hover:text-blue-800" style={{ fontWeight: 600 }}>
                            Reply →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Post */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <p className="text-sm text-slate-700 mb-3" style={{ fontWeight: 600 }}>Ask a Question</p>
                <textarea placeholder="What would you like to ask..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 resize-none h-24" />
                <div className="flex justify-end mt-3">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition-colors" style={{ fontWeight: 600 }}>
                    <Send className="w-4 h-4" /> Post Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Achievements & Badges</h1>

              {/* Skill radar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Your Skills Profile</h3>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {RADAR_DATA.map(({ skill, value }) => (
                      <div key={skill}>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>{skill}</span><span style={{ fontWeight: 600 }}>{value}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Earned Badges ({user?.badges})</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {BADGES.map(({ icon, name, desc }) => (
                    <div key={name} className="text-center p-4 bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-200 rounded-2xl hover:shadow-md transition-shadow">
                      <div className="text-3xl mb-2">{icon}</div>
                      <p className="text-xs text-slate-800 mb-1" style={{ fontWeight: 600 }}>{name}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points history */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Points History</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={WEEKLY_PROGRESS}>
                    <defs>
                      <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="points" stroke="#f59e0b" fill="url(#amberGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
