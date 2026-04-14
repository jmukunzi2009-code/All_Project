import { createBrowserRouter, Outlet } from "react-router";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <div className="text-8xl mb-4">🎓</div>
        <h1 className="text-4xl text-slate-800 mb-2" style={{ fontWeight: 700 }}>Page Not Found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl" style={{ fontWeight: 600 }}>
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/dashboard/student",
    Component: StudentDashboard,
  },
  {
    path: "/dashboard/teacher",
    Component: TeacherDashboard,
  },
  {
    path: "/dashboard/school",
    Component: SchoolDashboard,
  },
  {
    path: "/dashboard/admin",
    Component: AdminDashboard,
  },
]);
