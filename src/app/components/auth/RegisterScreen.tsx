import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, User, Phone, Mail, MapPin, CreditCard, Tractor, ShoppingBag, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
}

export function RegisterScreen({ onBack, onLogin }: RegisterScreenProps) {
  const { register, t, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  
  const [formData, setFormData] = useState({
    role: 'consumer' as 'farmer' | 'consumer',
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    aadhaarId: '',
    farmSize: '',
    herbsGrown: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.mobile || !formData.email || !formData.password || !formData.confirmPassword || !formData.location) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        if (formData.role === 'farmer') {
          setStep(2);
        } else {
          handleSubmit();
        }
      }
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      mobile: formData.mobile,
      location: formData.location,
      ...(formData.role === 'farmer' && {
        aadhaarId: formData.aadhaarId,
        farmSize: formData.farmSize,
        herbsGrown: formData.herbsGrown ? formData.herbsGrown.split(',').map(h => h.trim()) : []
      })
    };

    const result = await register(userData);
    
    if (result.success) {
      setSuccess(true);
      setNeedsApproval(result.needsApproval || false);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
        <div className="max-w-sm sm:max-w-md mx-auto pt-6 sm:pt-8">
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <h2 className="text-xl font-semibold">Registration Successful!</h2>
              
              {needsApproval ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Your farmer account has been created and is pending approval. 
                    You will be notified once an admin approves your account.
                  </p>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      Farmer accounts require verification to ensure authenticity and quality standards.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Your account has been created successfully. You can now sign in to start using AyurTrace.
                </p>
              )}
              
              <Button 
                onClick={onLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
      <div className="max-w-sm sm:max-w-md mx-auto pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" onClick={step === 1 ? onBack : () => setStep(1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-xl font-semibold text-gray-800">{t('register')}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 ? 'Create Your Account' : 'Farmer Details'}
            </CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-green-600' : 'bg-green-300'}`} />
              <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-green-600' : 'bg-gray-300'}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Button
                      variant={formData.role === 'farmer' ? "default" : "outline"}
                      className={`h-14 sm:h-16 flex-col gap-1 sm:gap-2 ${
                        formData.role === 'farmer' 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "hover:bg-green-50"
                      }`}
                      onClick={() => handleInputChange('role', 'farmer')}
                    >
                      <Tractor className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-xs">{t('farmer')}</span>
                    </Button>
                    <Button
                      variant={formData.role === 'consumer' ? "default" : "outline"}
                      className={`h-14 sm:h-16 flex-col gap-1 sm:gap-2 ${
                        formData.role === 'consumer' 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "hover:bg-green-50"
                      }`}
                      onClick={() => handleInputChange('role', 'consumer')}
                    >
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="text-xs">{t('consumer')}</span>
                    </Button>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Mobile Number *"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Location (City, State) *"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password *"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
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

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password *"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && formData.role === 'farmer' && (
              <div className="space-y-4">
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Aadhaar ID (XXXX-XXXX-XXXX)"
                    value={formData.aadhaarId}
                    onChange={(e) => handleInputChange('aadhaarId', e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Input
                  placeholder="Farm Size (e.g., 5 acres)"
                  value={formData.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                />
                
                <Input
                  placeholder="Herbs Grown (comma separated)"
                  value={formData.herbsGrown}
                  onChange={(e) => handleInputChange('herbsGrown', e.target.value)}
                />

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Farmer accounts require admin approval before activation. 
                    This ensures authenticity and maintains quality standards in our traceability system.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800">
                    Your information is secure and will only be used for traceability and verification purposes.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button 
              onClick={handleNext}
              disabled={isLoading || loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading || loading ? 'Creating Account...' : (
                step === 1 && formData.role === 'farmer' ? 'Next' : 
                step === 1 && formData.role === 'consumer' ? 'Create Account' :
                'Create Farmer Account'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Button variant="link" onClick={onLogin} className="text-green-600 p-0">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}