"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, CalendarDays, MessageCircle, ShieldCheck } from "lucide-react";

const dashboardDetails = {
  admin: {
    title: "Administrator Dashboard",
    summary: [
      { label: "Students", value: "1,250" },
      { label: "Teachers", value: "85" },
      { label: "Classes", value: "42" },
      { label: "Announcements", value: "7" },
    ],
    subtitle: "Manage accounts, review reports, and keep the whole system aligned.",
  },
  teacher: {
    title: "Teacher Dashboard",
    summary: [
      { label: "Assigned Classes", value: "5" },
      { label: "Students", value: "220" },
      { label: "Lessons Today", value: "3" },
      { label: "Attendance", value: "98%" },
    ],
    subtitle: "Track performance, mark attendance, and share announcements with your classes.",
  },
  student: {
    title: "Student Dashboard",
    summary: [
      { label: "GPA", value: "3.8" },
      { label: "Attendance", value: "94%" },
      { label: "Subjects", value: "8" },
      { label: "Messages", value: "4" },
    ],
    subtitle: "Review results, attendance, and school updates from a single portal.",
  },
  parent: {
    title: "Parent Dashboard",
    summary: [
      { label: "Children", value: "2" },
      { label: "Upcoming Events", value: "3" },
      { label: "Reports", value: "2" },
      { label: "Notifications", value: "5" },
    ],
    subtitle: "Monitor academic progress and stay connected with school communication.",
  },
};

const roleModules = {
  admin: [
    { icon: ShieldCheck, label: "Access Control" },
    { icon: BookOpen, label: "Student Management" },
    { icon: CalendarDays, label: "Timetables" },
    { icon: MessageCircle, label: "Announcements" },
  ],
  teacher: [
    { icon: BookOpen, label: "Class Roster" },
    { icon: CalendarDays, label: "Attendance" },
    { icon: BarChart3, label: "Performance" },
    { icon: MessageCircle, label: "Communications" },
  ],
  student: [
    { icon: BookOpen, label: "Grades" },
    { icon: CalendarDays, label: "Schedule" },
    { icon: BarChart3, label: "Progress" },
    { icon: MessageCircle, label: "Announcements" },
  ],
  parent: [
    { icon: BookOpen, label: "Child Profiles" },
    { icon: CalendarDays, label: "Events" },
    { icon: BarChart3, label: "Reports" },
    { icon: MessageCircle, label: "Updates" },
  ],
};

export default function DashboardClient({ role }: { role: string }) {
  const router = useRouter();
  const details = useMemo(
    () => dashboardDetails[role as keyof typeof dashboardDetails] || dashboardDetails.student,
    [role]
  );
  const modules = useMemo(
    () => roleModules[role as keyof typeof roleModules] || roleModules.student,
    [role]
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">{details.title}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">{details.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Home
          </button>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {details.summary.map((item) => (
            <article key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-950">Key modules</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.label} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-slate-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">{module.label}</h3>
                    <p className="text-sm text-slate-500">Designed for your role’s daily workflows.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-700 p-8 text-white shadow-xl">
            <h3 className="text-lg font-semibold">Reliable security</h3>
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Role-based access control keeps administration, teaching, learning, and parent communications secure and organized.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-950">Streamlined communication</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Announcements, messaging, and notifications are grouped by role for fast, clear updates.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-950">Real-time management</h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Attendance, timetables, and results are presented in a clean dashboard optimized for every user.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
