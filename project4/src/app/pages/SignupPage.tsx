import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen, GraduationCap, Users, School, Shield,
  Eye, EyeOff, ArrowRight, CheckCircle
} from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";

const ROLES = [
  {
    id: "student" as UserRole,
    label: "Student",
    icon: GraduationCap,
    color: "blue",
    desc: "Join with a school code",
    perks: ["Access 500+ lessons", "Join community projects", "Earn badges & points", "Connect with mentors"],
  },
  {
    id: "teacher" as UserRole,
    label: "Teacher",
    icon: Users,
    color: "teal",
    desc: "Verified educator account",
    perks: ["Upload lessons & quizzes", "Manage student progress", "Mentorship tools", "School collaboration"],
  },
  {
    id: "school" as UserRole,
    label: "School",
    icon: School,
    color: "violet",
    desc: "Institutional account",
    perks: ["Manage all students & staff", "Post announcements", "Run competitions", "Analytics dashboard"],
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; btn: string; light: string }> = {
  blue: { border: "border-blue-500", bg: "bg-blue-50", text: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-700", light: "bg-blue-100" },
  teal: { border: "border-teal-500", bg: "bg-teal-50", text: "text-teal-600", btn: "bg-teal-600 hover:bg-teal-700", light: "bg-teal-100" },
  violet: { border: "border-violet-500", bg: "bg-violet-50", text: "text-violet-600", btn: "bg-violet-600 hover:bg-violet-700", light: "bg-violet-100" },
};

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", schoolCode: "",
    credentials: "", schoolName: "", contactPerson: "", address: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const currentRoleData = ROLES.find(r => r.id === selectedRole)!;
  const colors = COLOR_MAP[currentRoleData.color];

  const updateForm = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleNext = () => setStep(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    login(selectedRole);
    navigate(`/dashboard/${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
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
          <p className="text-slate-400 mt-2 text-sm">Create your account and start learning today.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 px-2">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                step >= s ? `${colors.btn.split(" ")[0]} text-white` : "bg-slate-700 text-slate-400"
              }`} style={{ fontWeight: 600 }}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs ${step >= s ? "text-white" : "text-slate-500"}`}>
                {s === 1 ? "Choose Role" : "Your Details"}
              </span>
              {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? colors.btn.split(" ")[0] : "bg-slate-700"}`}></div>}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 1 ? (
            <div>
              <h2 className="text-slate-800 mb-1" style={{ fontWeight: 700 }}>I want to join as...</h2>
              <p className="text-slate-500 text-sm mb-6">Select your role to get started</p>
              <div className="space-y-3">
                {ROLES.map(({ id, label, icon: Icon, color, desc, perks }) => {
                  const c = COLOR_MAP[color];
                  const active = selectedRole === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedRole(id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        active ? `${c.border} ${c.bg}` : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${active ? c.light : "bg-slate-100"} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${active ? c.text : "text-slate-400"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${active ? c.text : "text-slate-700"}`} style={{ fontWeight: 600 }}>{label}</span>
                            {active && <div className={`w-5 h-5 ${c.text.replace("text-", "bg-").replace("-600", "-600")} rounded-full flex items-center justify-center`}>
                              <CheckCircle className="w-5 h-5" />
                            </div>}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                          {active && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {perks.map(p => (
                                <span key={p} className={`${c.bg} ${c.text} text-xs px-2 py-0.5 rounded-full`}>{p}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Admin note */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                <Shield className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500">
                  <span style={{ fontWeight: 600 }}>Admin accounts</span> are invitation-only and managed by the platform team.
                </p>
              </div>

              <button
                onClick={handleNext}
                className={`w-full mt-6 ${colors.btn} text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors`}
                style={{ fontWeight: 600 }}
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-6">
                <button type="button" onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600 text-sm">
                  ← Back
                </button>
                <h2 className="text-slate-800" style={{ fontWeight: 700 }}>
                  {selectedRole === "school" ? "School Details" : "Your Details"}
                </h2>
              </div>

              <div className="space-y-4">
                {selectedRole === "school" ? (
                  <>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>School Name</label>
                      <input value={form.schoolName} onChange={e => updateForm("schoolName", e.target.value)}
                        placeholder="e.g. Riverside High School" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Contact Person</label>
                      <input value={form.contactPerson} onChange={e => updateForm("contactPerson", e.target.value)}
                        placeholder="Principal or Admin name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" required />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>School Address</label>
                      <input value={form.address} onChange={e => updateForm("address", e.target.value)}
                        placeholder="Full address" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" required />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Full Name</label>
                    <input value={form.name} onChange={e => updateForm("name", e.target.value)}
                      placeholder="Your full name" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Email Address</label>
                  <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)}
                    placeholder="your@email.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={form.password} onChange={e => updateForm("password", e.target.value)}
                      placeholder="Create a strong password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pr-10" required />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {selectedRole === "student" && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>School Code <span className="text-slate-400" style={{ fontWeight: 400 }}>(optional)</span></label>
                    <input value={form.schoolCode} onChange={e => updateForm("schoolCode", e.target.value)}
                      placeholder="e.g. RVRSIDE-2026" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    <p className="text-xs text-slate-400 mt-1">Ask your teacher or school admin for the code</p>
                  </div>
                )}

                {selectedRole === "teacher" && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5" style={{ fontWeight: 600 }}>School Affiliation</label>
                    <input value={form.credentials} onChange={e => updateForm("credentials", e.target.value)}
                      placeholder="School name or 'Independent'" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" required />
                    <p className="text-xs text-slate-400 mt-1">Your account will be verified by your school or admin</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1" required />
                <label htmlFor="terms" className="text-xs text-slate-500" style={{ fontWeight: 400 }}>
                  I agree to EduConnect's{" "}
                  <a href="#" className="text-blue-600">Terms of Service</a> and{" "}
                  <a href="#" className="text-blue-600">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 ${colors.btn} text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors`}
                style={{ fontWeight: 600 }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800" style={{ fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
