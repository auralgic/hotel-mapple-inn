import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (identity: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'mapple_inn_user_auth_secure_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STRICT ENTERPRISE SECURITY: Default to null (unauthenticated). Never auto-login as admin.
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate session structure
        if (parsed?.id && parsed?.role && parsed?.email) {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Verified Staff Credentials Matrix
  const login = async (identity: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identity.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check credentials against authorized roles
    // 1. MASTER ADMIN (Full Access to Rates, Rooms, Folios, Settings, Reports)
    if (
      (cleanId === 'admin@mappleinn.com' || cleanId === 'admin' || cleanId === 'mapple') &&
      (cleanPass === 'Aman@2026##' || cleanPass === 'Mapple@2026##' || cleanPass === 'Admin@2026')
    ) {
      const authenticatedUser: User = {
        id: 'u-admin-master',
        name: 'Aman (General Manager)',
        email: 'admin@mappleinn.com',
        role: 'admin',
        active: true,
      };
      setUser(authenticatedUser);
      return { success: true };
    }

    // 2. FRONT DESK / RECEPTION (Check-ins, Invoices, Bookings)
    if (
      (cleanId === 'reception@mappleinn.com' || cleanId === 'reception') &&
      (cleanPass === 'Mapple@2026##' || cleanPass === 'Aman@2026##' || cleanPass === 'Reception@2026')
    ) {
      const authenticatedUser: User = {
        id: 'u-reception-staff',
        name: 'Front Desk Reception',
        email: 'reception@mappleinn.com',
        role: 'reception',
        active: true,
      };
      setUser(authenticatedUser);
      return { success: true };
    }

    // 3. KITCHEN CHEF / KDS (Food Orders & Kitchen Display)
    if (
      (cleanId === 'kitchen@mappleinn.com' || cleanId === 'kitchen') &&
      (cleanPass === 'Kitchen@2026##' || cleanPass === 'Aman@2026##' || cleanPass === 'Kitchen@2026')
    ) {
      const authenticatedUser: User = {
        id: 'u-kitchen-chef',
        name: 'Executive Chef',
        email: 'kitchen@mappleinn.com',
        role: 'kitchen',
        active: true,
      };
      setUser(authenticatedUser);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Access is restricted to authorized Hotel Mapple Inn staff only.',
    };
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
        isAuthenticated: Boolean(user && user.role),
        login,
        logout,
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
