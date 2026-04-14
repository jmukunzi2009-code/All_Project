import { useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen, Users, Bell, BarChart2, LogOut, Settings, Home,
  School, Search, TrendingUp, Shield, CheckCircle, XCircle,
  AlertTriangle, Globe, Plus, Eye, Edit, Trash2, Database,
  Activity, Flag, Clock, ChevronRight, GraduationCap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";
import { useAuth } from "../context/AuthContext";

const PLATFORM_GROWTH = [
  { month: "Oct", students: 38000, teachers: 2400, schools: 340 },
  { month: "Nov", students: 40500, teachers: 2600, schools: 360 },
  { month: "Dec", students: 41200, teachers: 2700, schools: 370 },
  { month: "Jan", students: 43800, teachers: 2850, schools: 390 },
  { month: "Feb", students: 46200, teachers: 2980, schools: 420 },
  { month: "Mar", teachers: 3100, students: 48500, schools: 455 },
  { month: "Apr", students: 50100, teachers: 3200, schools: 480 },
];

const CONTENT_STATS = [
  { name: "Approved", value: 4280 },
  { name: "Pending Review", value: 142 },
  { name: "Flagged", value: 23 },
];
const PIE_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const ACTIVITY_DATA = [
  { day: "Mon", logins: 8240, actions: 32500 },
  { day: "Tue", logins: 9100, actions: 38200 },
  { day: "Wed", logins: 8900, actions: 36800 },
  { day: "Thu", logins: 9600, actions: 40100 },
  { day: "Fri", logins: 10200, actions: 44300 },
  { day: "Sat", logins: 6100, actions: 22400 },
  { day: "Sun", logins: 5800, actions: 19600 },
];

const PENDING_SCHOOLS = [
  { id: 1, name: "Westfield Academy", location: "Boston, MA", contact: "principal@westfield.edu", applied: "Apr 4", students: 620 },
  { id: 2, name: "Sunrise Community School", location: "Austin, TX", contact: "admin@sunrise.edu", applied: "Apr 3", students: 280 },
  { id: 3, name: "Oak Park High", location: "Chicago, IL", contact: "info@oakpark.edu", applied: "Apr 1", students: 890 },
];

const PENDING_TEACHERS = [
  { id: 1, name: "Dr. Emily Parker", subjects: "Chemistry, Biology", school: "Lincoln Academy", applied: "Apr 5" },
  { id: 2, name: "Mr. Tom Rivera", subjects: "Spanish, Literature", school: "Westfield Academy", applied: "Apr 4" },
  { id: 3, name: "Ms. Aisha Mohammed", subjects: "Computer Science", school: "Oak Park High", applied: "Apr 3" },
];

const FLAGGED_CONTENT = [
  { id: 1, type: "Forum Post", content: "Inappropriate language in discussion", reporter: "Student", date: "Apr 6", severity: "medium" },
  { id: 2, type: "Resource", content: "Unverified external links in lesson", reporter: "Teacher", date: "Apr 5", severity: "low" },
  { id: 3, type: "Project", content: "Potential plagiarism in project submission", reporter: "System", date: "Apr 4", severity: "high" },
];

const ALL_SCHOOLS = [
  { id: 1, name: "Riverside High School", location: "San Francisco, CA", students: 475, teachers: 37, status: "active" },
  { id: 2, name: "Lincoln Academy", location: "Boston, MA", students: 820, teachers: 62, status: "active" },
  { id: 3, name: "Greenwood High", location: "New York, NY", students: 654, teachers: 48, status: "active" },
  { id: 4, name: "City International School", location: "Los Angeles, CA", students: 1200, teachers: 89, status: "suspended" },
  { id: 5, name: "West Valley Academy", location: "Phoenix, AZ", students: 392, teachers: 29, status: "active" },
];

const SYSTEM_HEALTH = [
  { label: "API Uptime", value: "99.98%", status: "healthy" },
  { label: "Database", value: "Optimal", status: "healthy" },
  { label: "Media Storage", value: "68% used", status: "warning" },
  { label: "Auth Service", value: "Online", status: "healthy" },
  { label: "Email Service", value: "Online", status: "healthy" },
  { label: "CDN", value: "Active", status: "healthy" },
];

const TABS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "schools", label: "Schools", icon: School },
  { id: "users", label: "Users", icon: Users },
  { id: "content", label: "Content", icon: Flag },
  { id: "approvals", label: "Approvals", icon: CheckCircle },
  { id: "system", label: "System", icon: Database },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static z-40 h-full w-64 bg-slate-900 flex flex-col transition-transform duration-300`}>
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg text-white" style={{ fontWeight: 700 }}>EduConnect</span>
          </div>
          <span className="text-xs text-rose-400 mt-1 block" style={{ fontWeight: 600 }}>ADMIN PANEL</span>
        </div>

        <div className="p-4 mx-3 mt-4 bg-slate-800 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{user?.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate" style={{ fontWeight: 600 }}>{user?.name}</p>
              <p className="text-xs text-rose-400">Super Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === id
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              style={{ fontWeight: activeTab === id ? 600 : 400 }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {id === "approvals" && (
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-400"}`}>6</span>
              )}
              {id === "content" && (
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-red-500/20 text-red-400"}`}>3</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500">
              <BarChart2 className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search users, schools, content..." className="pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-xl focus:outline-none w-72" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>{user?.avatar}</div>
              <span className="hidden sm:block text-sm text-slate-700" style={{ fontWeight: 600 }}>Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl mb-1" style={{ fontWeight: 700 }}>Platform Overview 🛡️</h1>
                    <p className="text-slate-400">All systems operational · Last updated just now</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                      <Activity className="w-4 h-4" /> All Systems Online
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: "50,100", icon: GraduationCap, color: "blue", change: "+1,600 this month" },
                  { label: "Total Teachers", value: "3,200", icon: Users, color: "teal", change: "+120 this month" },
                  { label: "Partner Schools", value: "480", icon: School, color: "violet", change: "+25 this month" },
                  { label: "Active Projects", value: "1,842", icon: Globe, color: "amber", change: "+230 this month" },
                ].map(({ label, value, icon: Icon, color, change }) => {
                  const cm: Record<string, string> = {
                    blue: "bg-blue-50 text-blue-600",
                    teal: "bg-teal-50 text-teal-600",
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

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Platform Growth</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={PLATFORM_GROWTH}>
                      <defs>
                        <linearGradient id="blueGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="students" stroke="#2563eb" fill="url(#blueGrad2)" strokeWidth={2} name="Students" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Content Status</h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={CONTENT_STATS} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                        {CONTENT_STATS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {CONTENT_STATS.map(({ name, value }, i) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }}></div>
                          <span className="text-slate-600">{name}</span>
                        </div>
                        <span className="text-slate-800" style={{ fontWeight: 600 }}>{value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alerts + Daily Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Pending Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Schools awaiting approval", count: 3, color: "amber", icon: School },
                      { label: "Teachers awaiting verification", count: 3, color: "blue", icon: Users },
                      { label: "Flagged content to review", count: 3, color: "red", icon: Flag },
                      { label: "Support tickets open", count: 8, color: "violet", icon: AlertTriangle },
                    ].map(({ label, count, color, icon: Icon }) => {
                      const cm: Record<string, string> = {
                        amber: "bg-amber-50 border-amber-200 text-amber-700",
                        blue: "bg-blue-50 border-blue-200 text-blue-700",
                        red: "bg-red-50 border-red-200 text-red-700",
                        violet: "bg-violet-50 border-violet-200 text-violet-700",
                      };
                      return (
                        <div key={label} className={`flex items-center justify-between p-3 rounded-xl border ${cm[color]}`}>
                          <div className="flex items-center gap-2 text-sm">
                            <Icon className="w-4 h-4" />
                            {label}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm" style={{ fontWeight: 700 }}>{count}</span>
                            <ChevronRight className="w-4 h-4 opacity-60" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Daily Platform Activity</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ACTIVITY_DATA} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="logins" fill="#2563eb" radius={[4, 4, 0, 0]} name="Logins" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* SCHOOLS */}
          {activeTab === "schools" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Schools Management</h1>
                <button className="text-sm bg-rose-600 text-white px-4 py-2 rounded-xl flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Plus className="w-4 h-4" /> Add School
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {["School", "Location", "Students", "Teachers", "Status", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ALL_SCHOOLS.map(({ id, name, location, students, teachers, status }) => (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                              <School className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{location}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{students}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{teachers}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`} style={{ fontWeight: 600 }}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded"><Eye className="w-4 h-4" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-amber-600 rounded"><Edit className="w-4 h-4" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>User Management</h1>
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: "50,100", color: "blue" },
                  { label: "Total Teachers", value: "3,200", color: "teal" },
                  { label: "School Admins", value: "480", color: "violet" },
                  { label: "Platform Admins", value: "12", color: "rose" },
                ].map(({ label, value, color }) => {
                  const cm: Record<string, string> = {
                    blue: "bg-blue-50 border-blue-200 text-blue-700",
                    teal: "bg-teal-50 border-teal-200 text-teal-700",
                    violet: "bg-violet-50 border-violet-200 text-violet-700",
                    rose: "bg-rose-50 border-rose-200 text-rose-700",
                  };
                  return (
                    <div key={label} className={`${cm[color]} border rounded-2xl p-4`}>
                      <div className="text-2xl mb-1" style={{ fontWeight: 700 }}>{value}</div>
                      <div className="text-sm">{label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>User Growth Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={PLATFORM_GROWTH}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={2} name="Students" />
                    <Line type="monotone" dataKey="teachers" stroke="#0d9488" strokeWidth={2} name="Teachers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* CONTENT MODERATION */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Content Moderation</h1>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Approved", value: 4280, color: "text-green-600 bg-green-50 border-green-200" },
                  { label: "Pending Review", value: 142, color: "text-amber-600 bg-amber-50 border-amber-200" },
                  { label: "Flagged", value: 23, color: "text-red-600 bg-red-50 border-red-200" },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`${color} border rounded-2xl p-5`}>
                    <div className="text-3xl mb-1" style={{ fontWeight: 700 }}>{value.toLocaleString()}</div>
                    <div className="text-sm">{label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Flagged Content</h3>
                <div className="space-y-4">
                  {FLAGGED_CONTENT.map(({ id, type, content, reporter, date, severity }) => (
                    <div key={id} className={`p-4 rounded-xl border ${severity === "high" ? "border-red-200 bg-red-50" : severity === "medium" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Flag className={`w-4 h-4 ${severity === "high" ? "text-red-600" : severity === "medium" ? "text-amber-600" : "text-slate-500"}`} />
                            <span className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{type}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${severity === "high" ? "bg-red-100 text-red-700" : severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`} style={{ fontWeight: 600 }}>
                              {severity}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{content}</p>
                          <p className="text-xs text-slate-400 mt-1">Reported by: {reporter} · {date}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ fontWeight: 600 }}>
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ fontWeight: 600 }}>
                            <XCircle className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* APPROVALS */}
          {activeTab === "approvals" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>Pending Approvals</h1>

              {/* Pending Schools */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Schools Awaiting Approval ({PENDING_SCHOOLS.length})</h3>
                <div className="space-y-4">
                  {PENDING_SCHOOLS.map(({ id, name, location, contact, applied, students }) => (
                    <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-amber-200 bg-amber-50 rounded-xl">
                      <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <School className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{name}</p>
                        <p className="text-xs text-slate-500">{location} · {contact}</p>
                        <p className="text-xs text-slate-400">Applied: {applied} · ~{students} students</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-1" style={{ fontWeight: 600 }}>
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button className="text-xs bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl flex items-center gap-1" style={{ fontWeight: 600 }}>
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>
                        <button className="text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl" style={{ fontWeight: 600 }}>
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Teachers */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Teachers Awaiting Verification ({PENDING_TEACHERS.length})</h3>
                <div className="space-y-4">
                  {PENDING_TEACHERS.map(({ id, name, subjects, school, applied }) => (
                    <div key={id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-blue-200 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                        {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{name}</p>
                        <p className="text-xs text-slate-500">{subjects} · {school}</p>
                        <p className="text-xs text-slate-400">Applied: {applied}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-1" style={{ fontWeight: 600 }}>
                          <CheckCircle className="w-3.5 h-3.5" /> Verify
                        </button>
                        <button className="text-xs bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl" style={{ fontWeight: 600 }}>
                          Request Docs
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <h1 className="text-2xl text-slate-800" style={{ fontWeight: 700 }}>System Health</h1>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SYSTEM_HEALTH.map(({ label, value, status }) => (
                  <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm border ${status === "healthy" ? "border-green-100" : "border-amber-200"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600" style={{ fontWeight: 600 }}>{label}</span>
                      <div className={`w-3 h-3 rounded-full ${status === "healthy" ? "bg-green-500" : "bg-amber-500"}`}></div>
                    </div>
                    <div className={`text-lg ${status === "healthy" ? "text-green-600" : "text-amber-600"}`} style={{ fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-slate-800 mb-4" style={{ fontWeight: 600 }}>Platform Activity (This Week)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="actions" stroke="#e11d48" fill="url(#roseGrad)" strokeWidth={2} name="Total Actions" />
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
