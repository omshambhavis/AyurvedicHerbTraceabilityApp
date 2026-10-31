import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { X, Package, Calendar, DollarSign, MapPin, CheckCircle } from 'lucide-react';
import { herbAPI, batchAPI } from '../../utils/api';
import { useAuth } from '../auth/AuthContext';

interface AddBatchModalProps {
  onClose: () => void;
  onBatchAdded: (batch: any) => void;
}

export function AddBatchModal({ onClose, onBatchAdded }: AddBatchModalProps) {
  const { user } = useAuth();
  const [herbs, setHerbs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    herbId: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    quality: 'standard' as 'premium' | 'organic' | 'standard',
    price: '',
    expiryDate: '',
    processingMethod: '',
    farmLocation: user?.location || '',
    certifications: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadHerbs = async () => {
      try {
        const response = await herbAPI.getHerbs();
        setHerbs(response.herbs || []);
      } catch (error) {
        console.error('Failed to load herbs:', error);
        setError('Failed to load herbs');
      } finally {
        setIsLoading(false);
      }
    };

    loadHerbs();
  }, []);

  const handleSubmit = async () => {
    if (!formData.herbId || !formData.quantity || !formData.harvestDate || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Calculate expiry date (2 years from harvest for most herbs)
      const harvestDate = new Date(formData.harvestDate);
      const expiryDate = new Date(harvestDate);
      expiryDate.setFullYear(harvestDate.getFullYear() + 2);

      const batchData = {
        herbId: formData.herbId,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        harvestDate: formData.harvestDate,
        quality: formData.quality,
        price: parseFloat(formData.price),
        expiryDate: expiryDate.toISOString().split('T')[0],
        processingMethod: formData.processingMethod || 'Traditional processing methods',
        farmLocation: formData.farmLocation,
        certifications: formData.certifications
      };

      const response = await batchAPI.createBatch(batchData);
      
      if (response.batch) {
        setSuccess(true);
        onBatchAdded(response.batch);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Failed to create batch:', error);
      setError(error.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCertifications = [
    'AYUSH Certified',
    'Organic',
    'Fair Trade',
    'GMP Certified',
    'ISO 9001',
    'NPOP Certified'
  ];

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
            <h2 className="text-xl font-semibold">Batch Created Successfully!</h2>
            <p className="text-sm text-gray-600">
              Your batch has been submitted and is pending admin approval.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-800">
                You'll be notified once your batch is approved and visible to consumers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Add New Batch
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Loading herbs...</p>
            </div>
          ) : (
            <>
              {/* Herb Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Herb *</label>
                <Select value={formData.herbId} onValueChange={(value) => setFormData(prev => ({ ...prev, herbId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an herb..." />
                  </SelectTrigger>
                  <SelectContent>
                    {herbs.map((herb: any) => (
                      <SelectItem key={herb.id} value={herb.id}>
                        <div className="flex items-center gap-2">
                          <span>{herb.name}</span>
                          <span className="text-xs text-gray-500">₹{herb.price}/{herb.unit}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity *</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Harvest Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Harvest Date *</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Quality & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality Grade</label>
                  <Select value={formData.quality} onValueChange={(value: 'premium' | 'organic' | 'standard') => setFormData(prev => ({ ...prev, quality: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per {formData.unit} *</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="250"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Farm Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Farm Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    value={formData.farmLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, farmLocation: e.target.value }))}
                    className="pl-10"
                    placeholder="Farm location"
                  />
                </div>
              </div>

              {/* Processing Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Processing Method</label>
                <Input
                  placeholder="e.g., Sun-dried, Ground using stone mills"
                  value={formData.processingMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, processingMethod: e.target.value }))}
                />
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableCertifications.map(cert => (
                    <Button
                      key={cert}
                      variant={formData.certifications.includes(cert) ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => toggleCertification(cert)}
                    >
                      {cert}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.herbId || !formData.quantity || !formData.harvestDate || !formData.price}
                  className="w-full"
                >
                  {isSubmitting ? 'Creating Batch...' : 'Create Batch'}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Your batch will be submitted for admin approval before being visible to consumers
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}