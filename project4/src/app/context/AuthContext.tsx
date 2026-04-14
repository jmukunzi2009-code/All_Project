import React, { createContext, useContext, useState } from "react";

export type UserRole = "student" | "teacher" | "school" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  school?: string;
  points?: number;
  badges?: number;
  level?: number;
}

const DEMO_USERS: Record<UserRole, User> = {
  student: {
    id: "s1",
    name: "Alex Johnson",
    email: "alex@student.edu",
    role: "student",
    avatar: "AJ",
    school: "Riverside High School",
    points: 2450,
    badges: 12,
    level: 8,
  },
  teacher: {
    id: "t1",
    name: "Dr. Sarah Williams",
    email: "sarah@teacher.edu",
    role: "teacher",
    avatar: "SW",
    school: "Riverside High School",
    points: 5800,
    badges: 24,
    level: 15,
  },
  school: {
    id: "sc1",
    name: "Riverside High School",
    email: "admin@riverside.edu",
    role: "school",
    avatar: "RS",
    school: "Riverside High School",
  },
  admin: {
    id: "a1",
    name: "Platform Admin",
    email: "admin@educonnect.io",
    role: "admin",
    avatar: "PA",
  },
};

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
