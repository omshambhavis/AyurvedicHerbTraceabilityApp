import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Share, MapPin, Calendar, Leaf, Shield, Award, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { TraceabilityTimeline } from "./TraceabilityTimeline";

interface HerbDetailProps {
  herb: {
    id: string;
    name: string;
    scientificName: string;
    image: string;
    farmImage: string;
    origin: string;
    harvestDate: string;
    certifications: string[];
    quality: "premium" | "organic" | "standard";
    farmer: string;
    farmLocation: string;
    description: string;
    benefits: string[];
    processingMethod: string;
    expiryDate: string;
  };
  onBack: () => void;
}

export function HerbDetail({ herb, onBack }: HerbDetailProps) {
  const timelineEvents = [
    {
      id: "1",
      stage: "cultivation",
      date: "2024-01-15",
      location: herb.farmLocation,
      description: `Organic cultivation started by ${herb.farmer}`,
      completed: true,
      details: {
        farmer: herb.farmer,
        soil_type: "Red laterite soil",
        irrigation: "Drip irrigation",
        fertilizer: "Organic compost"
      }
    },
    {
      id: "2", 
      stage: "harvest",
      date: herb.harvestDate,
      location: herb.farmLocation,
      description: "Herbs harvested at optimal maturity",
      completed: true,
      details: {
        harvest_time: "Early morning",
        moisture_content: "12%",
        quality_grade: "Grade A"
      }
    },
    {
      id: "3",
      stage: "processing",
      date: "2024-03-20",
      location: "Ayurvedic Processing Unit, Kerala",
      description: herb.processingMethod,
      completed: true,
      details: {
        method: herb.processingMethod,
        temperature: "Below 40°C",
        duration: "Natural drying"
      }
    },
    {
      id: "4",
      stage: "quality_check",
      date: "2024-03-25",
      location: "AYUSH Certified Lab, Mumbai",
      description: "Quality testing and certification completed",
      completed: true,
      details: {
        lab_name: "AYUSH Certified Lab",
        test_results: "Passed all parameters",
        certification: "AYUSH Approved"
      }
    },
    {
      id: "5",
      stage: "packaging",
      date: "2024-04-01",
      location: "Packaging Unit, Bangalore",
      description: "Sealed in food-grade packaging",
      completed: true,
      details: {
        package_type: "Vacuum sealed",
        batch_number: "AYU-TUR-2024-001234",
        expiry_date: herb.expiryDate
      }
    },
    {
      id: "6",
      stage: "shipping",
      date: "2024-04-05",
      location: "Distribution Center",
      description: "Shipped to retail partner",
      completed: true
    },
    {
      id: "7",
      stage: "retail",
      date: "2024-04-08",
      location: "Ayurvedic Store, Delhi",
      description: "Available for purchase",
      completed: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Herb Image & Basic Info */}
        <Card>
          <CardContent className="p-4">
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <ImageWithFallback
                src={herb.image}
                alt={herb.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{herb.name}</h1>
                  <p className="text-gray-600 italic">{herb.scientificName}</p>
                </div>
                <Badge className={`
                  ${herb.quality === 'premium' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                  ${herb.quality === 'organic' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                  ${herb.quality === 'standard' ? 'bg-slate-50 text-slate-700 border-slate-200' : ''}
                `}>
                  {herb.quality}
                </Badge>
              </div>
              
              <p className="text-gray-700">{herb.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{herb.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{herb.harvestDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{herb.farmer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Expires {herb.expiryDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Ayurvedic Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {herb.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {herb.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farm Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Source Farm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden mb-3">
              <ImageWithFallback
                src={herb.farmImage}
                alt="Source farm"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Farmer:</span> {herb.farmer}</p>
              <p><span className="font-medium">Location:</span> {herb.farmLocation}</p>
              <p><span className="font-medium">Farming Method:</span> Organic, Traditional Ayurvedic practices</p>
            </div>
          </CardContent>
        </Card>

        {/* Traceability Timeline */}
        <TraceabilityTimeline events={timelineEvents} herbId={herb.id} />
      </div>
    </div>
  );
}