import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BookOpen, GraduationCap, Users, School, Shield, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";

const ROLES = [
  { id: "student" as UserRole, label: "Student", icon: GraduationCap, color: "blue", desc: "Access lessons, projects & progress tracking" },
  { id: "teacher" as UserRole, label: "Teacher", icon: Users, color: "teal", desc: "Manage classes, mentor students & share resources" },
  { id: "school" as UserRole, label: "School", icon: School, color: "violet", desc: "Oversee students, staff & school activities" },
  { id: "admin" as UserRole, label: "Admin", icon: Shield, color: "rose", desc: "Platform oversight & content moderation" },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; btn: string }> = {
  blue: { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-700" },
  teal: { border: "border-teal-500", bg: "bg-teal-50", text: "text-teal-600", btn: "bg-teal-600 hover:bg-teal-700" },
  violet: { border: "border-violet-500", bg: "bg-violet-50", text: "text-violet-600", btn: "bg-violet-600 hover:bg-violet-700" },
  rose: { border: "border-rose-500", bg: "bg-rose-50", text: "text-rose-600", btn: "bg-rose-600 hover:bg-rose-700" },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
    student: { email: "alex@student.edu", password: "demo123" },
    teacher: { email: "sarah@teacher.edu", password: "demo123" },
    school: { email: "admin@riverside.edu", password: "demo123" },
    admin: { email: "admin@educonnect.io", password: "demo123" },
  };

  const handleDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login(selectedRole);
    navigate(`/dashboard/${selectedRole}`);
  };

  const currentRole = ROLES.find(r => r.id === selectedRole)!;
  const colors = COLOR_MAP[currentRole.color];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl text-white" style={{ fontWeight: 700 }}>
              Edu<span className="text-blue-400">Connect</span>
            </span>
          </Link>
          <p className="text-slate-400 mt-2 text-sm">Welcome back! Log in to your account.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-3">I'm a...</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(({ id, label, icon: Icon, color }) => {
                const c = COLOR_MAP[color];
                const active = selectedRole === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedRole(id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                      active ? `${c.border} ${c.bg}` : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? c.text : "text-slate-400"}`} />
                    <span className={`text-sm ${active ? c.text : "text-slate-600"}`} style={{ fontWeight: active ? 600 : 400 }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={DEMO_CREDENTIALS[selectedRole].email}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${colors.btn} text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors`}
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Log In as {currentRole.label} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-600" />
              <p className="text-amber-800 text-sm" style={{ fontWeight: 600 }}>Quick Demo Login</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(({ id, label, color }) => (
                <button
                  key={id}
                  onClick={() => handleDemoLogin(id)}
                  className={`text-xs py-1.5 px-3 rounded-lg border transition-colors ${
                    selectedRole === id
                      ? `${COLOR_MAP[color].bg} ${COLOR_MAP[color].border} ${COLOR_MAP[color].text}`
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  Demo {label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800" style={{ fontWeight: 600 }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
