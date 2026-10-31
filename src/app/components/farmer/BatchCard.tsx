import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, MapPin, Package, DollarSign, Eye, MoreHorizontal } from 'lucide-react';
import { Batch, sampleHerbs } from '../../data/sampleData';

interface BatchCardProps {
  batch: Batch;
}

export function BatchCard({ batch }: BatchCardProps) {
  const herb = sampleHerbs.find(h => h.id === batch.herbId);
  
  const statusColors = {
    cultivation: "bg-yellow-50 text-yellow-700 border-yellow-200",
    harvested: "bg-blue-50 text-blue-700 border-blue-200",
    processed: "bg-purple-50 text-purple-700 border-purple-200",
    quality_checked: "bg-orange-50 text-orange-700 border-orange-200",
    packaged: "bg-cyan-50 text-cyan-700 border-cyan-200",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    retail: "bg-green-50 text-green-700 border-green-200",
    sold: "bg-gray-50 text-gray-700 border-gray-200"
  };

  const approvalColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{herb?.name || 'Unknown Herb'}</h4>
              <p className="text-sm text-gray-500 font-mono">{batch.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[batch.status]}>
                {batch.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{batch.quantity} {batch.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">₹{batch.price}/{batch.unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{batch.harvestDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 truncate">{batch.currentLocation}</span>
            </div>
          </div>

          {/* Quality & Approval */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {batch.quality}
              </Badge>
              <Badge className={approvalColors[batch.approvalStatus]}>
                {batch.approvalStatus}
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Track
            </Button>
          </div>

          {/* Certifications */}
          {batch.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {batch.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}