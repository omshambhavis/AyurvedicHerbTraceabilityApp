import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { QrCode, Camera, Upload, Search } from "lucide-react";
import { useState } from "react";

interface QRScannerProps {
  onScan: (code: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      // Simulate scanned QR code
      onScan("AYU-TUR-2024-001234");
    }, 2000);
  };

  const handleManualEntry = () => {
    const code = prompt("Enter herb traceability ID:");
    if (code) {
      onScan(code);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Scan Herb Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Scanning...</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Point your camera at the QR code on the herb package
              </p>
              <Button onClick={handleScan} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" onClick={handleManualEntry} className="w-full">
            <Search className="w-4 h-4 mr-2" />
            Enter Code Manually
          </Button>
          
          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload QR Image
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Scan or enter the unique code found on your Ayurvedic herb package to view its complete journey from farm to you.
        </div>
      </CardContent>
    </Card>
  );
}