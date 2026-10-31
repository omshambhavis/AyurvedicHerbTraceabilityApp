import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Leaf, Package, TrendingUp, Calendar, MapPin, Plus, 
  Bell, DollarSign, BarChart3, Users, Clock, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { batchAPI, herbAPI } from '../../utils/api';
import { AddBatchModal } from './AddBatchModal';
import { BatchCard } from './BatchCard';

export function FarmerDashboard() {
  const { user, t } = useAuth();
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [batches, setBatches] = useState([]);
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [batchesResponse, herbsResponse] = await Promise.all([
          batchAPI.getBatches(),
          herbAPI.getHerbs()
        ]);

        setBatches(batchesResponse.batches || []);
        setHerbs(herbsResponse.herbs || []);
      } catch (error) {
        console.error('Failed to load farmer dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBatchAdded = (newBatch: any) => {
    setBatches(prev => [newBatch, ...prev]);
    setShowAddBatch(false);
  };
  
  const stats = {
    totalBatches: batches.length,
    activeBatches: batches.filter((b: any) => !['sold', 'expired'].includes(b.status)).length,
    totalRevenue: batches.reduce((sum: number, batch: any) => sum + (batch.price * batch.quantity), 0),
    pendingApprovals: batches.filter((b: any) => b.approvalStatus === 'pending').length
  };

  const recentNotifications = [
    { id: 1, message: "Welcome to AyurTrace! Start by adding your first herb batch", time: "now", type: "info" },
    { id: 2, message: "Complete your farmer profile for faster approvals", time: "1 hour ago", type: "warning" },
    { id: 3, message: "Market trends show high demand for organic herbs", time: "2 hours ago", type: "info" }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-xl animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Welcome back, {user?.name}!</h1>
            <p className="text-green-100">Manage your herb cultivation and batches</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-100">
          <MapPin className="w-4 h-4" />
          <span>{user?.location}</span>
        </div>
      </div>

      {/* Account Status Alert for Pending Farmers */}
      {user?.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Account Pending Approval</p>
                <p className="text-sm text-yellow-700">
                  Your farmer account is under review. You can add batches, but they won't be visible to consumers until approved.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Batches</p>
                <p className="text-lg sm:text-xl font-semibold">{stats.totalBatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Active Batches</p>
                <p className="text-lg sm:text-xl font-semibold">{stats.activeBatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-xl font-semibold">₹{(stats.totalRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending Approval</p>
                <p className="text-lg sm:text-xl font-semibold">{stats.pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setShowAddBatch(true)}
              className="h-16 flex-col gap-2 bg-green-600 hover:bg-green-700"
            >
              <Package className="w-5 h-5" />
              <span className="text-sm">Add New Batch</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="batches" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="batches" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            {t('batches')}
          </TabsTrigger>
          <TabsTrigger value="herbs" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            {t('herbs')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">My Batches</h3>
            <Button size="sm" onClick={() => setShowAddBatch(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
            </Button>
          </div>
          <div className="space-y-3">
            {batches.map((batch: any) => (
              <BatchCard key={batch.id} batch={batch} />
            ))}
            {batches.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No batches yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Start your herb traceability journey by creating your first batch
                  </p>
                  <Button onClick={() => setShowAddBatch(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Batch
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="herbs" className="space-y-4 mt-4">
          <h3 className="font-semibold">Available Herbs</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {herbs.slice(0, 12).map((herb: any) => (
              <Card key={herb.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{herb.name}</h4>
                    <p className="text-xs text-gray-500 mb-2 italic hidden sm:block">{herb.scientificName}</p>
                    <Badge variant="outline" className="text-xs">
                      ₹{herb.price}/{herb.unit}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <h3 className="font-semibold">Recent Notifications</h3>
          <div className="space-y-3">
            {recentNotifications.map(notification => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'success' ? 'bg-green-100' :
                      notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {notification.type === 'warning' && <Bell className="w-4 h-4 text-yellow-600" />}
                      {notification.type === 'info' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <AddBatchModal 
          onClose={() => setShowAddBatch(false)} 
          onBatchAdded={handleBatchAdded}
        />
      )}
    </div>
  );
}