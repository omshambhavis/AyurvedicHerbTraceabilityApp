import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Leaf, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './AuthContext';

interface LoginScreenProps {
  onBack: () => void;
  onRegister: () => void;
}

export function LoginScreen({ onBack, onRegister }: LoginScreenProps) {
  const { login, t, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const sampleCredentials = [
    { role: 'Admin', email: 'admin@ayurtrace.com', password: 'password123' },
    { role: 'Farmer', email: 'ravi.kumar@email.com', password: 'password123' },
    { role: 'Consumer', email: 'priya.reddy@email.com', password: 'password123' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
      <div className="max-w-sm sm:max-w-md mx-auto pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">{t('login')}</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <p className="text-sm text-gray-600 text-center">
              Sign in to your AyurTrace account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-blue-800 mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-blue-700">
                {sampleCredentials.map((cred, index) => (
                  <div key={index} className="cursor-pointer hover:bg-blue-100 p-1 rounded"
                       onClick={() => {
                         setEmail(cred.email);
                         setPassword(cred.password);
                       }}>
                    <strong>{cred.role}:</strong> {cred.email} / {cred.password}
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2 italic">Click to auto-fill</p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              disabled={isLoading || loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading || loading ? 'Signing in...' : t('login')}
            </Button>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Button variant="link" onClick={onRegister} className="text-green-600 p-0">
                {t('register')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}