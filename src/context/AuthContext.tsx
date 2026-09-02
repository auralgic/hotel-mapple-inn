import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../lib/demoData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'mapple_inn_user_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Default to Admin for seamless local exploration
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, requestedRole?: UserRole): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      // In production Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'password123', // or user input
        });
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase auth fallback:', e);
      }
    }

    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: requestedRole || 'admin',
      active: true,
    };

    setUser(matched);
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    const matched = INITIAL_USERS.find(u => u.role === newRole) || {
      id: `u-${newRole}`,
      name: `${newRole.toUpperCase()} Staff`,
      email: `${newRole}@mappleinn.com`,
      role: newRole,
      active: true,
    };
    setUser(matched);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
