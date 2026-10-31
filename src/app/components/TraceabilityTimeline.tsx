import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, MapPin, Truck, Package, Leaf, Factory, ShoppingBag } from "lucide-react";

interface TimelineEvent {
  id: string;
  stage: string;
  date: string;
  location: string;
  description: string;
  completed: boolean;
  details?: Record<string, string>;
}

interface TraceabilityTimelineProps {
  events: TimelineEvent[];
  herbId: string;
}

export function TraceabilityTimeline({ events, herbId }: TraceabilityTimelineProps) {
  const getStageIcon = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "cultivation": return <Leaf className="w-4 h-4" />;
      case "harvest": return <Package className="w-4 h-4" />;
      case "processing": return <Factory className="w-4 h-4" />;
      case "quality_check": return <CheckCircle className="w-4 h-4" />;
      case "packaging": return <Package className="w-4 h-4" />;
      case "shipping": return <Truck className="w-4 h-4" />;
      case "retail": return <ShoppingBag className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Traceability Journey</span>
          <Badge variant="outline">ID: {herbId}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    event.completed
                      ? "bg-green-100 border-green-500 text-green-600"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {getStageIcon(event.stage)}
                </div>
                {index < events.length - 1 && (
                  <div
                    className={`w-0.5 h-8 ${
                      event.completed ? "bg-green-200" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium ${event.completed ? "text-gray-900" : "text-gray-500"}`}>
                    {event.stage.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </h4>
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{event.location}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                
                {event.details && (
                  <div className="space-y-1">
                    {Object.entries(event.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-500 capitalize">{key.replace("_", " ")}:</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}