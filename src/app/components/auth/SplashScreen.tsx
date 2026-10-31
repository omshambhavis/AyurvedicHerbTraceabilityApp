import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Leaf, Globe } from 'lucide-react';
import { useAuth } from './AuthContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { language, setLanguage, t } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo Animation */}
        <div className={`mb-8 transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t('appName')}</h1>
          <p className="text-green-600">{t('tagline')}</p>
        </div>

        {/* Content */}
        {showContent && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {t('welcome')}
              </h2>
              <p className="text-gray-600 text-sm">
                Track your Ayurvedic herbs from farm to your hands
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>

            <Button 
              onClick={onComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg"
            >
              Get Started
            </Button>

            <div className="text-xs text-gray-500 mt-4">
              Ensuring transparency in Ayurvedic herb supply chain
            </div>
          </div>
        )}
      </div>
    </div>
  );
}