import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '../types';
import { 
  getUserByUsername, 
  getUsers,
  saveUsers,
  getSession, 
  saveSession, 
  clearSession,
  hashPassword,
  initializeDefaultData,
  addActivityLog,
  getUserById
} from '../lib/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    initializeDefaultData();
    const session = getSession();
    if (session) {
      const now = new Date().getTime();
      const lastActivity = new Date(session.lastActivity).getTime();
      const expiresAt = new Date(session.expiresAt).getTime();

      if (now > expiresAt || now - lastActivity > SESSION_TIMEOUT) {
        // Session expired
        clearSession();
        setUser(null);
        setIsAuthenticated(false);
      } else {
        // Valid session
        const foundUser = getUserById(session.userId);
        if (foundUser) {
          setUser(foundUser);
          setIsAuthenticated(true);
          // Update last activity
          const updatedSession: Session = {
            ...session,
            lastActivity: new Date().toISOString(),
          };
          saveSession(updatedSession);
        } else {
          clearSession();
        }
      }
    }
  }, []);

  // Auto-logout on inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkActivity = setInterval(() => {
      const session = getSession();
      if (session) {
        const now = new Date().getTime();
        const lastActivity = new Date(session.lastActivity).getTime();
        
        if (now - lastActivity > SESSION_TIMEOUT) {
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkActivity);
  }, [isAuthenticated]);

  // Update activity on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      const session = getSession();
      if (session) {
        const updatedSession: Session = {
          ...session,
          lastActivity: new Date().toISOString(),
        };
        saveSession(updatedSession);
      }
    };

    // Listen for user interactions
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [isAuthenticated]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const foundUser = getUserByUsername(username);
    
    if (!foundUser) {
      return { success: false, error: 'Invalid username or password' };
    }

    const hashedPassword = hashPassword(password);
    if (foundUser.password !== hashedPassword) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Create session
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT);
    const session: Session = {
      userId: foundUser.id,
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    saveSession(session);
    setUser(foundUser);
    setIsAuthenticated(true);

    // Update last login
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === foundUser.id ? { ...u, lastLogin: now.toISOString() } : u
    );
    saveUsers(updatedUsers);

    // Log activity
    addActivityLog({
      userId: foundUser.id,
      userName: `${foundUser.firstName} ${foundUser.lastName}`,
      userRole: foundUser.role,
      action: 'Login',
      details: `User logged in successfully`,
    });

    return { success: true };
  };

  const logout = () => {
    if (user) {
      addActivityLog({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role,
        action: 'Logout',
        details: `User logged out`,
      });
    }

    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    if (!user) return false;

    const hashedPassword = hashPassword(newPassword);
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, password: hashedPassword, mustChangePassword: false } : u
    );
    saveUsers(updatedUsers);

    // Update current user state
    setUser({ ...user, password: hashedPassword, mustChangePassword: false });

    // Log activity
    addActivityLog({
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      action: 'Password Changed',
      details: `User changed their password`,
    });

    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
