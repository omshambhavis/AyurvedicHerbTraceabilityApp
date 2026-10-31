import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { 
  Users, Package, TrendingUp, BarChart3, Search, Filter,
  CheckCircle, XCircle, Clock, Download, Eye, MoreHorizontal,
  Leaf, Shield, AlertTriangle, UserCheck, DollarSign
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { userAPI, batchAPI, analyticsAPI } from '../../utils/api';
import { AccountsTable } from './AccountsTable';
import { BatchApprovalCard } from './BatchApprovalCard';

export function AdminDashboard() {
  const { user, t } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getAnalytics();
        setAnalytics(response.analytics);
      } catch (error) {
        console.error('Failed to load analytics:', error);
        setError('Failed to load dashboard analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-xl animate-pulse">
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

  const recentActivities = [
    { id: 1, type: 'approval', message: 'System initialized with sample data', time: 'now' },
    { id: 2, type: 'registration', message: 'Platform setup completed successfully', time: '5 min ago' },
    { id: 3, type: 'batch', message: 'Database populated with herb catalog', time: '10 min ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="text-blue-100">Manage AyurTrace platform and users</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Batches</p>
                <p className="text-lg sm:text-xl font-semibold">{analytics?.totalBatches || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Farmers</p>
                <p className="text-lg sm:text-xl font-semibold">{analytics?.totalFarmers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending Approvals</p>
                <p className="text-lg sm:text-xl font-semibold">{analytics?.pendingApprovals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Avg Rating</p>
                <p className="text-lg sm:text-xl font-semibold">{analytics?.averageRating || '0.0'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      {analytics?.recentActivity && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analytics.recentActivity.newUsers}</p>
                <p className="text-sm text-gray-600">New users this week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{analytics.recentActivity.newBatches}</p>
                <p className="text-sm text-gray-600">New batches this week</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-16 flex-col gap-2">
              <Download className="w-5 h-5" />
              <span className="text-sm">Export Data</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <AccountsTable searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Pending Batch Approvals</h3>
            <Badge variant="outline">{analytics?.pendingApprovals || 0} pending</Badge>
          </div>
          <BatchApprovalCard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Farmers</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ 
                            width: `${analytics?.totalFarmers && analytics?.totalConsumers ? 
                              (analytics.totalFarmers / (analytics.totalFarmers + analytics.totalConsumers)) * 100 : 50}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analytics?.totalFarmers || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consumers</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ 
                            width: `${analytics?.totalFarmers && analytics?.totalConsumers ? 
                              (analytics.totalConsumers / (analytics.totalFarmers + analytics.totalConsumers)) * 100 : 50}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{analytics?.totalConsumers || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Batch Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.batchStatusDistribution && Object.entries(analytics.batchStatusDistribution).map(([status, count]: [string, any]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 mt-4">
          <h3 className="font-semibold">Recent Platform Activity</h3>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'approval' ? 'bg-yellow-100' :
                      activity.type === 'registration' ? 'bg-green-100' :
                      activity.type === 'review' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {activity.type === 'approval' && <Clock className="w-4 h-4 text-yellow-600" />}
                      {activity.type === 'registration' && <UserCheck className="w-4 h-4 text-green-600" />}
                      {activity.type === 'review' && <Eye className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'batch' && <Package className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}