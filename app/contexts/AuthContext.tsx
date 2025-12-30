'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ADMIN_ACCOUNTS, AdminAccount } from '../data/adminAccounts';

export type UserRole = 'user' | 'admin';

interface AdminInfo {
  id: string;
  username: string;
  location: string;
  isMainAdmin: boolean;
}

interface AuthContextType {
  role: UserRole;
  isAdmin: boolean;
  adminInfo: AdminInfo | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isMainAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);

  // Check for existing admin session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('userRole') as UserRole | null;
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedAdminInfo = localStorage.getItem('adminInfo');
      
      if (storedRole === 'admin' && storedAuth === 'true' && storedAdminInfo) {
        try {
          const admin = JSON.parse(storedAdminInfo);
          setRole('admin');
          setIsAuthenticated(true);
          setAdminInfo(admin);
        } catch (e) {
          console.error('Error parsing admin info:', e);
        }
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Find matching admin account
    const adminAccount = ADMIN_ACCOUNTS.find(
      account => account.username === username && account.password === password
    );

    if (adminAccount) {
      const admin: AdminInfo = {
        id: adminAccount.id,
        username: adminAccount.username,
        location: adminAccount.location,
        isMainAdmin: adminAccount.isMainAdmin
      };

      setRole('admin');
      setIsAuthenticated(true);
      setAdminInfo(admin);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminInfo', JSON.stringify(admin));
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole('user');
    setIsAuthenticated(false);
    setAdminInfo(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('adminInfo');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === 'admin',
        adminInfo,
        login,
        logout,
        isAuthenticated,
        isMainAdmin: adminInfo?.isMainAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

