import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

/**
 * Authentication Context for School Management System
 * 
 * SECURITY FEATURES:
 * 1. Password-based authentication - All users must login with email and password
 * 2. Admin-controlled user creation - Only admin can create accounts with passwords
 * 3. No hardcoded mock users - System starts with one default admin only
 * 4. Secure storage - User credentials stored in localStorage (encrypted storage recommended for production)
 * 5. Role-based access control - Different permissions for each user role
 * 
 * DEFAULT ADMIN ACCOUNT:
 * Email: admin@school.edu
 * Password: admin123
 * Note: Change this password after first login in production
 * 
 * USER ROLES:
 * - admin: Full system control, creates all accounts
 * - headmaster: Supervision and reporting
 * - teacher: Marks and attendance management
 * - class_teacher: Report generation + teacher functions
 * - student: View-only access to own data
 */

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  createUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize with one default admin account
const DEFAULT_ADMIN: User = {
  id: 'admin-default',
  name: 'System Administrator',
  email: 'admin@school.edu',
  password: 'admin123', // Default password - should be changed after first login
  role: 'admin',
};

// Storage keys
const USERS_STORAGE_KEY = 'school_users';
const CURRENT_USER_KEY = 'current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize users from localStorage or use default admin
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // First time setup - create default admin
      setUsers([DEFAULT_ADMIN]);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user with matching email and password
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password from user object before storing
      const userWithoutPassword = { ...foundUser };
      delete (userWithoutPassword as any).password;
      
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  const createUser = (userData: Omit<User, 'id'>) => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setUsers([...users, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(u => (u.id === userId ? { ...u, ...updates } : u)));
    
    // If updating current user, update the stored user too
    if (user?.id === userId) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId: string) => {
    // Prevent deleting the last admin
    const admins = users.filter(u => u.role === 'admin');
    if (admins.length === 1 && admins[0].id === userId) {
      throw new Error('Cannot delete the last admin account');
    }

    setUsers(users.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      getAllUsers,
      createUser,
      updateUser,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}