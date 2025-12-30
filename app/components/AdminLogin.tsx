'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_ACCOUNTS } from '../data/adminAccounts';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';

interface AdminLoginProps {
  open: boolean;
  onClose: () => void;
}

export function AdminLogin({ open, onClose }: AdminLoginProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const success = login(username, password);
      
      if (success) {
        setUsername('');
        setPassword('');
        onClose();
      } else {
        setError('Invalid username or password');
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Login
          </DialogTitle>
          <CardDescription>
            Enter your admin credentials to access admin features
          </CardDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground pt-4 border-t">
          <p className="font-semibold mb-2">Available Admin Accounts:</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {ADMIN_ACCOUNTS.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span className="font-medium">{account.location}</span>
                  {account.isMainAdmin && (
                    <Badge variant="default" className="text-xs">Main</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs">{account.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

