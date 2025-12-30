'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminLogin } from './AdminLogin';
import { SalesReport } from './SalesReport';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut, Shield, BarChart3 } from 'lucide-react';

export function AdminNav() {
  const { isAdmin, adminInfo, isMainAdmin, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSalesReport, setShowSalesReport] = useState(false);

  if (isAdmin && adminInfo) {
    return (
      <>
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <Badge variant="default" className="gap-1">
                  {isMainAdmin ? 'Main Admin' : 'Admin'} - {adminInfo.location}
                </Badge>
                {/* <span className="text-sm text-muted-foreground">
                  Cash payment enabled - Direct ticket generation
                </span> */}
              </div>
              <div className="flex items-center gap-2">
                {isMainAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSalesReport(true)}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Sales Report
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
        {isMainAdmin && (
          <SalesReport open={showSalesReport} onClose={() => setShowSalesReport(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogin(true)}
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </Button>
          </div>
        </div>
      </div>
      <AdminLogin open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}

