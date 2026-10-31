import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Search, QrCode, Clock, Leaf, Filter, LogOut, User, MessageCircle, Settings, Bell } from "lucide-react";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import { SplashScreen } from "./components/auth/SplashScreen";
import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { HerbCard } from "./components/HerbCard";
import { QRScanner } from "./components/QRScanner";
import { HerbDetail } from "./components/HerbDetail";
import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { CommunityTab } from "./components/consumer/CommunityTab";
import { batchAPI, herbAPI } from "./utils/api";
import { sampleBatches, sampleHerbs } from "./data/sampleData";

function AppContent() {
  const { user, logout, t, loading } = useAuth();
  const [currentView, setCurrentView] = useState<"main" | "detail">("main");
  const [selectedHerb, setSelectedHerb] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSplash, setShowSplash] = useState(!user);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [herbs, setHerbs] = useState([]);
  const [herbsLoading, setHerbsLoading] = useState(true);

  // Load approved batches for consumers
  useEffect(() => {
    if (user && user.role === 'consumer') {
      const loadHerbs = async () => {
        try {
          const [batchesResponse, herbsResponse] = await Promise.all([
            batchAPI.getBatches(),
            herbAPI.getHerbs()
          ]);

          const approvedBatches = (batchesResponse.batches || [])
            .filter((batch: any) => batch.approvalStatus === 'approved');
          
          const herbsMap = (herbsResponse.herbs || [])
            .reduce((acc: any, herb: any) => {
              acc[herb.id] = herb;
              return acc;
            }, {});

          const herbsForConsumer = approvedBatches.map((batch: any) => {
            const herb = herbsMap[batch.herbId];
            return {
              id: batch.id,
              name: herb?.name || 'Unknown Herb',
              scientificName: herb?.scientificName || '',
              image: herb?.image || '',
              farmImage: "https://images.unsplash.com/photo-1693593785503-5bfee6d1d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZpZWxkJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTEzMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
              origin: batch.farmLocation,
              harvestDate: batch.harvestDate,
              certifications: batch.certifications,
              quality: batch.quality,
              farmer: batch.farmerId,
              farmLocation: batch.farmLocation,
              description: herb?.description || '',
              benefits: herb?.benefits || [],
              processingMethod: batch.processingMethod,
              expiryDate: batch.expiryDate
            };
          });

          setHerbs(herbsForConsumer);
        } catch (error) {
          console.error('Failed to load herbs:', error);
          // Fallback to sample data
          const herbsForConsumer = sampleBatches.map(batch => {
            const herb = sampleHerbs.find(h => h.id === batch.herbId);
            return {
              id: batch.id,
              name: herb?.name || 'Unknown Herb',
              scientificName: herb?.scientificName || '',
              image: herb?.image || '',
              farmImage: "https://images.unsplash.com/photo-1693593785503-5bfee6d1d5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGZpZWxkJTIwYWdyaWN1bHR1cmV8ZW58MXx8fHwxNzU3NTEzMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
              origin: batch.farmLocation,
              harvestDate: batch.harvestDate,
              certifications: batch.certifications,
              quality: batch.quality,
              farmer: batch.farmerId,
              farmLocation: batch.farmLocation,
              description: herb?.description || '',
              benefits: herb?.benefits || [],
              processingMethod: batch.processingMethod,
              expiryDate: batch.expiryDate
            };
          });
          setHerbs(herbsForConsumer);
        } finally {
          setHerbsLoading(false);
        }
      };

      loadHerbs();
    } else {
      setHerbsLoading(false);
    }
  }, [user]);

  const recentScans = [
    "AYU-TUR-2024-001234",
    "AYU-ASH-2024-002156"
  ];

  const filteredHerbs = herbs.filter((herb: any) =>
    herb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    herb.origin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleHerbClick = (herbId: string) => {
    setSelectedHerb(herbId);
    setCurrentView("detail");
  };

  const handleQRScan = (code: string) => {
    const herb = herbs.find((h: any) => h.id === code);
    if (herb) {
      setSelectedHerb(code);
      setCurrentView("detail");
    } else {
      alert("Herb not found. Please try again.");
    }
  };

  const selectedHerbData = herbs.find((h: any) => h.id === selectedHerb);

  // Show loading screen during app initialization
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <p className="text-green-800 font-medium">Loading AyurTrace...</p>
        </div>
      </div>
    );
  }

  // Show splash screen if not authenticated
  if (showSplash && !user) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Show login screen
  if (showLogin && !user) {
    return (
      <LoginScreen 
        onBack={() => setShowLogin(false)}
        onRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
    );
  }

  // Show register screen
  if (showRegister && !user) {
    return (
      <RegisterScreen 
        onBack={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    );
  }

  // Show login/register buttons if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm sm:max-w-md mx-auto w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">{t('appName')}</h1>
          <p className="text-green-600 mb-6 sm:mb-8 text-sm sm:text-base">{t('tagline')}</p>
          
          <div className="space-y-3 sm:space-y-4">
            <Button 
              onClick={() => setShowLogin(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-base sm:text-lg"
            >
              {t('login')}
            </Button>
            <Button 
              onClick={() => setShowRegister(true)}
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-xl text-base sm:text-lg"
            >
              {t('register')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Role-based dashboards
  if (user.role === 'farmer') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{t('appName')}</h1>
                <p className="text-xs text-gray-600 hidden sm:block">{t('farmer')} Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <FarmerDashboard />
        </div>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{t('appName')}</h1>
                <p className="text-xs text-gray-600 hidden sm:block">{t('admin')} Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <AdminDashboard />
        </div>
      </div>
    );
  }

  // Consumer interface (default)
  if (currentView === "detail" && selectedHerbData) {
    return (
      <HerbDetail
        herb={selectedHerbData}
        onBack={() => setCurrentView("main")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm sm:text-base">{t('appName')}</h1>
                <p className="text-xs text-gray-600 hidden sm:block">{t('tagline')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge variant="outline" className="text-xs max-w-20 sm:max-w-none truncate">
                {user.name}
              </Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm sm:text-base"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{t('browse')}</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{t('scan')}</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{t('recent')}</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{t('community')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4 mt-4">
            <div className="space-y-3">
              {herbsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading herbs...</p>
                </div>
              ) : filteredHerbs.length > 0 ? (
                filteredHerbs.map((herb: any) => (
                  <HerbCard
                    key={herb.id}
                    {...herb}
                    onClick={() => handleHerbClick(herb.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Leaf className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No herbs found</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="scan" className="mt-4">
            <QRScanner onScan={handleQRScan} />
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4 mt-4">
            <div className="space-y-3">
              {recentScans.map(herbId => {
                const herb = herbs.find((h: any) => h.id === herbId);
                return herb ? (
                  <HerbCard
                    key={herb.id}
                    {...herb}
                    onClick={() => handleHerbClick(herb.id)}
                  />
                ) : null;
              })}
            </div>
            {recentScans.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent scans</p>
                <p className="text-sm">Use the Scan tab to track your first herb</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="mt-4">
            <CommunityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}