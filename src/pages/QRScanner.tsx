import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkOutVisitor } from '../services/visitorService';

const QRScanner: React.FC = () => {
  const [hasCamera, setHasCamera] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  useEffect(() => {
    let scanner: QrScanner | null = null;

    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Devices:', devices);
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoDevice);
        
        if (hasVideoDevice && videoRef.current) {
          scanner = new QrScanner(
            videoRef.current,
            result => {
              setScanResult(result.data);
              scanner?.stop();
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
            }
          );
          scannerRef.current = scanner;
          await scanner.start();
          console.log('Camera started');
        }
      } catch (err) {
        setError('Failed to access camera. Please ensure camera permissions are granted.');
        console.error('Camera access error:', err);
      }
    };

    checkCamera();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (scanResult) {
      setCheckoutLoading(true);
      checkOutVisitor(scanResult)
        .then(visitor => {
          setCheckoutResult({ success: true, visitor });
        })
        .catch(err => {
          setCheckoutResult({ success: false, error: err.message });
        })
        .finally(() => setCheckoutLoading(false));
    }
  }, [scanResult]);

  const handleReset = async () => {
    setScanResult(null);
    setCheckoutResult(null);
    setCheckoutLoading(false);

    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }

    if (videoRef.current) {
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
      scannerRef.current = scanner;
      await scanner.start();
      console.log('Camera restarted');
    }
  };

  if (!hasCamera) {
    return (
      <div className="max-w-2xl mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center text-error-500 mb-3 sm:mb-4">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <h2 className="text-lg sm:text-xl font-semibold">No Camera Available</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          A camera is required to scan QR codes. Please ensure your device has a camera and you've granted the necessary permissions.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center text-error-500 mb-3 sm:mb-4">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <h2 className="text-lg sm:text-xl font-semibold">Error</h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8 px-3 sm:px-0">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">QR Code Scanner</h2>
          
          {scanResult ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center text-success-500">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-base sm:text-lg font-medium">QR Code Detected!</span>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm sm:text-base text-gray-600 font-medium">Scanned Content:</p>
                <p className="mt-2 text-sm sm:text-base text-gray-800">{scanResult}</p>
              </div>
              {scanResult && checkoutLoading && (
                <div className="text-center text-blue-600">Checking out visitor...</div>
              )}
              {scanResult && checkoutResult && checkoutResult.success && (
                <div className="text-center text-green-600">
                  Visitor checked out: {checkoutResult.visitor.fullName}<br/>
                  Time: {new Date(checkoutResult.visitor.checkOutTime).toLocaleString()}
                </div>
              )}
              {scanResult && checkoutResult && !checkoutResult.success && (
                <div className="text-center text-red-600">
                  Checkout failed: {checkoutResult.error}
                </div>
              )}
              <button
                onClick={handleReset}
                className="w-full px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                Scan Another Code
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-gray-600">
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