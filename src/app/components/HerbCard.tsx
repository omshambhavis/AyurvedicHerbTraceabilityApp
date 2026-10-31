import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { MapPin, Leaf, Calendar, Shield } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HerbCardProps {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  origin: string;
  harvestDate: string;
  certifications: string[];
  quality: "premium" | "organic" | "standard";
  onClick: () => void;
}

export function HerbCard({
  id,
  name,
  scientificName,
  image,
  origin,
  harvestDate,
  certifications,
  quality,
  onClick
}: HerbCardProps) {
  const qualityColors = {
    premium: "bg-emerald-50 text-emerald-700 border-emerald-200",
    organic: "bg-green-50 text-green-700 border-green-200", 
    standard: "bg-slate-50 text-slate-700 border-slate-200"
  };

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 italic truncate">{scientificName}</p>
              </div>
              <Badge className={`ml-1 sm:ml-2 flex-shrink-0 text-xs ${qualityColors[quality]}`}>
                {quality}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{origin}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">Harvested {harvestDate}</span>
              </div>
              
              {certifications.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Shield className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{certifications.slice(0, 2).join(", ")}{certifications.length > 2 ? '...' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}