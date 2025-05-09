import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [hasCamera, setHasCamera] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoDevice);
        
        if (hasVideoDevice && videoRef.current) {
          const scanner = new QrScanner(
            videoRef.current,
            result => {
              setScanResult(result.data);
              scanner.stop();
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          );
          
          setQrScanner(scanner);
          await scanner.start();
        }
      } catch (err) {
        setError('Failed to access camera. Please ensure camera permissions are granted.');
        console.error('Camera access error:', err);
      }
    };

    checkCamera();

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, []);

  const handleReset = () => {
    setScanResult(null);
    if (qrScanner) {
      qrScanner.start();
    }
  };

  if (!hasCamera) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center text-error-500 mb-4">
          <AlertCircle className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">No Camera Available</h2>
        </div>
        <p className="text-gray-600">
          A camera is required to scan QR codes. Please ensure your device has a camera and you've granted the necessary permissions.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center text-error-500 mb-4">
          <AlertCircle className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
          
          {scanResult ? (
            <div className="space-y-4">
              <div className="flex items-center text-success-500">
                <CheckCircle2 className="w-6 h-6 mr-2" />
                <span className="text-lg font-medium">QR Code Detected!</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 font-medium">Scanned Content:</p>
                <p className="mt-2 text-gray-800">{scanResult}</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Scan Another Code
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-gray-600">
                Position the QR code within the camera view to scan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;