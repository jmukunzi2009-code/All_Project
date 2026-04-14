import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ROLE_DASHBOARD: Record<string, string> = {
  student: "/dashboard/student",
  teacher: "/dashboard/teacher",
  school: "/dashboard/school",
  admin: "/dashboard/admin",
};

const ROLE_COLOR: Record<string, string> = {
  student: "bg-blue-600",
  teacher: "bg-teal-600",
  school: "bg-indigo-600",
  admin: "bg-rose-600",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl" style={{ fontWeight: 700, color: "#1e293b" }}>
              Edu<span className="text-blue-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
              Home
            </Link>
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
              How It Works
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">
              Community
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 ${ROLE_COLOR[user.role]} rounded-full flex items-center justify-center text-white text-xs`}
                      style={{ fontWeight: 600 }}
                    >
                      {user.avatar}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm text-slate-800" style={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {user.name.split(" ")[0]}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        {user.points !== undefined && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-amber-600" style={{ fontWeight: 600 }}>{user.points} pts</span>
                          </div>
                        )}
                      </div>
                      <Link
                        to={ROLE_DASHBOARD[user.role]}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="#"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm text-slate-600 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-500 hover:text-blue-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2">
          <Link to="/" className="block py-2 text-slate-600 text-sm" onClick={() => setMobileOpen(false)}>Home</Link>
          <a href="#features" className="block py-2 text-slate-600 text-sm" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="block py-2 text-slate-600 text-sm" onClick={() => setMobileOpen(false)}>How It Works</a>
          {!user && (
            <Link to="/login" className="block py-2 text-blue-600 text-sm" style={{ fontWeight: 600 }} onClick={() => setMobileOpen(false)}>Log In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
