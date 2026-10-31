import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MoreHorizontal, Eye, Ban, CheckCircle, XCircle, User, Tractor, ShoppingBag } from 'lucide-react';
import { userAPI } from '../../utils/api';

interface AccountsTableProps {
  searchQuery: string;
}

export function AccountsTable({ searchQuery }: AccountsTableProps) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getUsers();
        setUsers(response.users || []);
      } catch (error) {
        console.error('Failed to load users:', error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'pending' | 'banned') => {
    try {
      await userAPI.updateUserStatus(userId, newStatus);
      
      // Update local state
      setUsers(prev => prev.map((user: any) => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users
    .filter((u: any) => u.role !== 'admin')
    .filter((user: any) => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    banned: "bg-red-50 text-red-700 border-red-200"
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer': return <Tractor className="w-4 h-4 text-green-600" />;
      case 'consumer': return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="space-x-2">
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {filteredUsers.map((user: any) => (
        <Card key={user.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <p className="text-sm text-gray-500 truncate">{user.mobile}</p>
                    <p className="text-xs text-gray-500 truncate">{user.location}</p>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                    {user.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined {user.registrationDate}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  {user.status === 'pending' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleStatusChange(user.id, 'active')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleStatusChange(user.id, 'banned')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {user.status === 'active' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleStatusChange(user.id, 'banned')}
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  )}
                  {user.status === 'banned' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleStatusChange(user.id, 'active')}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Info for Farmers */}
            {user.role === 'farmer' && user.farmSize && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Farm Size: </span>
                    <span className="text-gray-700">{user.farmSize}</span>
                  </div>
                  {user.herbsGrown && user.herbsGrown.length > 0 && (
                    <div>
                      <span className="text-gray-500">Herbs: </span>
                      <span className="text-gray-700">
                        {user.herbsGrown.slice(0, 2).join(', ')}{user.herbsGrown.length > 2 ? '...' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}