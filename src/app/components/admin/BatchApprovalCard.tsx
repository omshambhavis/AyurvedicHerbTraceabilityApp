import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CheckCircle, XCircle, Eye, Calendar, Package, DollarSign, User } from 'lucide-react';
import { batchAPI, herbAPI, userAPI } from '../../utils/api';

export function BatchApprovalCard() {
  const [pendingBatches, setPendingBatches] = useState([]);
  const [herbs, setHerbs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [batchesResponse, herbsResponse, usersResponse] = await Promise.all([
          batchAPI.getBatches(),
          herbAPI.getHerbs(),
          userAPI.getUsers()
        ]);

        const allBatches = batchesResponse.batches || [];
        const pending = allBatches.filter((batch: any) => batch.approvalStatus === 'pending');
        
        setPendingBatches(pending);
        setHerbs(herbsResponse.herbs || []);
        setUsers(usersResponse.users || []);
      } catch (error) {
        console.error('Failed to load batch approval data:', error);
        setError('Failed to load pending approvals');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleApprove = async (batchId: string) => {
    try {
      await batchAPI.updateBatch(batchId, { approvalStatus: 'approved' });
      
      // Update local state
      setPendingBatches(prev => prev.filter((batch: any) => batch.id !== batchId));
    } catch (error) {
      console.error('Failed to approve batch:', error);
      alert('Failed to approve batch');
    }
  };

  const handleReject = async (batchId: string) => {
    try {
      await batchAPI.updateBatch(batchId, { approvalStatus: 'rejected' });
      
      // Update local state
      setPendingBatches(prev => prev.filter((batch: any) => batch.id !== batchId));
    } catch (error) {
      console.error('Failed to reject batch:', error);
      alert('Failed to reject batch');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
                <div className="h-10 bg-gray-200 rounded flex-1"></div>
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

  if (pendingBatches.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No pending batch approvals</p>
          <p className="text-sm text-gray-500 mt-1">All batches have been reviewed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {pendingBatches.map((batch: any) => {
        const herb = herbs.find((h: any) => h.id === batch.herbId);
        const farmer = users.find((u: any) => u.id === batch.farmerId);

        return (
          <Card key={batch.id} className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{herb?.name || 'Unknown Herb'}</h4>
                    <p className="text-sm text-gray-500 font-mono">{batch.id}</p>
                  </div>
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending Approval
                  </Badge>
                </div>

                {/* Farmer Info */}
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Farmer: {farmer?.name || 'Unknown'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{farmer?.location || batch.farmLocation}</span>
                </div>

                {/* Batch Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{batch.quantity} {batch.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Harvested {batch.harvestDate}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">₹{batch.price}/{batch.unit}</span>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      Quality: {batch.quality}
                    </Badge>
                  </div>
                </div>

                {/* Processing Method */}
                {batch.processingMethod && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Processing: </span>
                      {batch.processingMethod}
                    </p>
                  </div>
                )}

                {/* Certifications */}
                {batch.certifications && batch.certifications.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      {batch.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <Button
                    onClick={() => handleApprove(batch.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(batch.id)}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}