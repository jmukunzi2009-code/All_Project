"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Centralized school operations",
    description: "Manage students, teachers, attendance, schedules, and communication from one clear dashboard.",
    icon: Users,
  },
  {
    title: "Role-based access",
    description: "Administrators control account creation, while teachers, students, and parents see only their relevant tools.",
    icon: ShieldCheck,
  },
  {
    title: "Fast attendance and reporting",
    description: "Teachers can record attendance and generate reports quickly with intuitive interfaces.",
    icon: CalendarDays,
  },
  {
    title: "Clear insight panels",
    description: "Students and parents can review performance, announcements, and schedules in real-time.",
    icon: ClipboardList,
  },
];

const announcements = [
  { title: "Fall term registration opens", time: "Today" },
  { title: "Parent-teacher conference on Friday", time: "2 days" },
  { title: "New timetable module released", time: "Last week" },
];

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setIsLoginOpen(false);
    router.push(`/dashboard?role=${formData.role}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">School management system</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              A modern digital campus for administrators, teachers, students, and parents.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Everything works together with smart role access, secure account control, and fast access to school activity, attendance, results, schedules, and announcements.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Login to the system
            </button>
            <div className="rounded-3xl border border-slate-200/10 bg-slate-800/80 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Quick access note</p>
              <p>Use the login button above to preview dashboards for each role.</p>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8 rounded-[2rem] bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                    <div className="inline-flex items-center justify-center rounded-2xl bg-sky-500/15 p-3 text-sky-300">
                      <Icon size={20} />
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-white">{feature.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold text-white">Overview modules</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Student Management</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Add, edit, and organize student profiles with grade, class, and parent linkups.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Attendance Tracker</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Mark attendance daily, generate reports, and keep all records centralized.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Academic Results</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Review performance dashboards and share results with students and parents.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Communication Hub</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Send announcements, messages, and updates tailored to each role.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-300">Announcements</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Latest updates for the school.</h2>
              <div className="mt-6 space-y-4">
                {announcements.map((item) => (
                  <div key={item.title} className="rounded-3xl bg-slate-900/80 p-4">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <h3 className="text-sm uppercase tracking-[0.24em] text-sky-300">Ready to explore</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">Log in through the popup and access a dashboard designed for your role.</p>
            </div>
          </aside>
        </section>

        <section className="mt-12 rounded-[2rem] bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Designed for clarity</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">A reliable platform for every school role.</h2>
            </div>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Open login popup
            </button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-slate-950/70 p-6 text-slate-300">
              <p className="font-semibold text-white">Administrator</p>
              <p className="mt-3 text-sm leading-6">Create users, assign roles, and manage the entire school workflow.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-6 text-slate-300">
              <p className="font-semibold text-white">Teachers</p>
              <p className="mt-3 text-sm leading-6">Access class rosters, take attendance, and track student progress.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-6 text-slate-300">
              <p className="font-semibold text-white">Students</p>
              <p className="mt-3 text-sm leading-6">View results, attendance, schedules, and announcements in one place.</p>
            </div>
            <div className="rounded-3xl bg-slate-950/70 p-6 text-slate-300">
              <p className="font-semibold text-white">Parents</p>
              <p className="mt-3 text-sm leading-6">Monitor children’s progress and receive timely school updates.</p>
            </div>
          </div>
        </section>
      </div>

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Popup login</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Access your dashboard</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Email
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Password
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
                    placeholder="Enter password"
                  />
                </label>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <span className="min-w-[90px]">Role</span>
                <select
                  value={formData.role}
                  onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                  className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
                >
                  <option value="admin">Administrator</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                </select>
              </label>

              {error && <p className="text-sm text-rose-500">{error}</p>}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Login now
                </button>
                <p className="text-sm text-slate-500">
                  Accounts are managed by the administrator for secure and role-driven access.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
