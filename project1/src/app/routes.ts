import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { HeadmasterDashboard } from "./pages/headmaster/HeadmasterDashboard";
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";
import { GuardianDashboard } from "./pages/guardian/GuardianDashboard";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginPage },
      { path: "change-password", Component: ChangePasswordPage },
      { path: "admin/*", Component: AdminDashboard },
      { path: "headmaster/*", Component: HeadmasterDashboard },
      { path: "teacher/*", Component: TeacherDashboard },
      { path: "guardian/*", Component: GuardianDashboard },
      { path: "student/*", Component: StudentDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);