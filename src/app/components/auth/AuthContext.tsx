import { createContext, useContext, useState, useEffect } from 'react';
import { User, translations } from '../../data/sampleData';
import { authAPI, apiClient } from '../../utils/api';

interface AuthContextType {
  user: User | null;
  language: 'en' | 'hi';
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'farmer' | 'consumer' | 'admin';
    mobile: string;
    location: string;
    farmSize?: string;
    herbsGrown?: string[];
    aadhaarId?: string;
  }) => Promise<{ success: boolean; needsApproval?: boolean; error?: string }>;
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data and check session
    const initializeApp = async () => {
      try {
        // Check for stored language
        const storedLang = localStorage.getItem('ayurtrace_language');
        if (storedLang) {
          setLanguage(storedLang as 'en' | 'hi');
        }

        // Check for existing session
        const storedUser = localStorage.getItem('ayurtrace_user');
        const storedToken = localStorage.getItem('ayurtrace_token');
        
        if (storedUser && storedToken) {
          // Set the auth token for API calls
          apiClient.setAuthToken(storedToken);
          
          try {
            // Verify the token is still valid by getting user profile
            const profileResponse = await authAPI.getProfile();
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Session expired or invalid:', error);
            // Clear invalid session
            localStorage.removeItem('ayurtrace_user');
            localStorage.removeItem('ayurtrace_token');
          }
        }

        // Initialize database with sample data
        try {
          const { sampleHerbs, sampleUsers, sampleBatches, sampleReviews } = await import('../../data/sampleData');
          
          const response = await fetch('/api/admin/seed-all', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              herbs: sampleHerbs,
              users: sampleUsers,
              batches: sampleBatches,
              reviews: sampleReviews,
            }),
          });
          
          if (!response.ok) {
            console.log('Sample data seeding failed or already completed');
          }
        } catch (error) {
          console.log('Sample data seeding completed or failed silently');
        }

      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate authentication
      // In a real app, this would validate against the backend
      const demoUsers = [
        { email: 'admin@ayurtrace.com', password: 'password123', role: 'admin', name: 'Admin User' },
        { email: 'ravi.kumar@email.com', password: 'password123', role: 'farmer', name: 'Ravi Kumar' },
        { email: 'priya.reddy@email.com', password: 'password123', role: 'consumer', name: 'Priya Reddy' },
      ];

      const matchedUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (matchedUser) {
        const mockToken = `demo_token_${Date.now()}`;
        
        // Set auth token for API calls
        apiClient.setAuthToken(mockToken);
        
        const userData = {
          id: matchedUser.role === 'admin' ? 'A001' : matchedUser.role === 'farmer' ? 'F001' : 'C001',
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          mobile: '+91-9876543210',
          location: matchedUser.role === 'admin' ? 'Delhi, India' : matchedUser.role === 'farmer' ? 'Wayanad, Kerala' : 'Bangalore, Karnataka',
          registrationDate: '2024-01-01',
          status: 'active'
        };
        
        setUser(userData);
        localStorage.setItem('ayurtrace_user', JSON.stringify(userData));
        localStorage.setItem('ayurtrace_token', mockToken);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('ayurtrace_user');
      localStorage.removeItem('ayurtrace_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'farmer' | 'consumer' | 'admin';
    mobile: string;
    location: string;
    farmSize?: string;
    herbsGrown?: string[];
    aadhaarId?: string;
  }): Promise<{ success: boolean; needsApproval?: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate registration
      // In a real app, this would create an account in the backend
      
      const newUser = {
        id: `${userData.role.charAt(0).toUpperCase()}${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        mobile: userData.mobile,
        location: userData.location,
        registrationDate: new Date().toISOString().split('T')[0],
        status: userData.role === 'farmer' ? 'pending' : 'active',
        ...(userData.role === 'farmer' && {
          farmSize: userData.farmSize,
          herbsGrown: userData.herbsGrown,
          aadhaarId: userData.aadhaarId
        })
      };

      // For consumers and admins, auto-login after registration
      if (userData.role !== 'farmer') {
        const mockToken = `demo_token_${Date.now()}`;
        apiClient.setAuthToken(mockToken);
        setUser(newUser);
        localStorage.setItem('ayurtrace_user', JSON.stringify(newUser));
        localStorage.setItem('ayurtrace_token', mockToken);
        return { success: true };
      }
      
      return { 
        success: true, 
        needsApproval: true 
      };

    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const setLanguageAndStore = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    localStorage.setItem('ayurtrace_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <AuthContext.Provider value={{
      user,
      language,
      loading,
      login,
      logout,
      register,
      setLanguage: setLanguageAndStore,
      t
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