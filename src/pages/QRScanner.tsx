import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig, CameraDevice } from 'html5-qrcode';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { checkOutVisitor } from '../services/visitorService';

const QRScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<{ success: boolean; visitor?: unknown; error?: string } | null>(null);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = 'qr-scanner-html5';

  // Fetch available cameras on mount
  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      setCameras(devices);
      if (devices.length > 0) {
        setSelectedCameraId(devices[0].id);
      }
    }).catch(err => {
      setError('No camera found or camera access denied.');
      console.error('Camera error:', err);
    });
  }, []);

  // Start scanner when camera is selected
  useEffect(() => {
    if (!selectedCameraId) return;
    if (html5QrcodeRef.current) {
      html5QrcodeRef.current.stop();
      html5QrcodeRef.current.clear();
      startScanner();
    } else {
      startScanner();
    }
    // Cleanup on unmount
    return () => {
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop();
        html5QrcodeRef.current.clear();
      }
    };
    // eslint-disable-next-line
  }, [selectedCameraId]);

  const startScanner = () => {
    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };
    html5QrcodeRef.current = new Html5Qrcode(scannerId);
    html5QrcodeRef.current.start(
      selectedCameraId!,
      config,
      (decodedText) => {
        setScanResult(decodedText);
        html5QrcodeRef.current?.stop();
      },
      () => {
        // Optionally handle scan errors
      }
    ).catch(err => {
      setError('Failed to start camera.');
      console.error('Start error:', err);
    });
  };

  // Handle visitor checkout after scan
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

  const handleReset = () => {
    setScanResult(null);
    setCheckoutResult(null);
    setCheckoutLoading(false);
    if (selectedCameraId) {
      startScanner();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8 px-3 sm:px-0">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">QR Code Scanner</h2>
          {cameras.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Camera:</label>
              <select
                className="w-full border rounded p-2"
                value={selectedCameraId || ''}
                onChange={e => setSelectedCameraId(e.target.value)}
              >
                {cameras.map(cam => (
                  <option key={cam.id} value={cam.id}>{cam.label || cam.id}</option>
                ))}
              </select>
            </div>
          )}
          {error && (
            <div className="flex items-center text-error-500 mb-3 sm:mb-4">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span>{error}</span>
            </div>
          )}
          {!scanResult ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <div id={scannerId} className="w-full h-full" />
              </div>
              <p className="text-center text-xs sm:text-sm text-gray-600">
                Position the QR code within the camera view to scan
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center text-success-500">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-base sm:text-lg font-medium">QR Code Detected!</span>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-sm sm:text-base text-gray-600 font-medium">Scanned Content:</p>
                <p className="mt-2 text-sm sm:text-base text-gray-800 break-all">{scanResult}</p>
              </div>
              {checkoutLoading && (
                <div className="text-center text-blue-600">Checking out visitor...</div>
              )}
              {checkoutResult && checkoutResult.success && (
                <div className="text-center text-green-600">
                  Visitor checked out: {typeof checkoutResult.visitor === 'object' && checkoutResult.visitor && 'fullName' in checkoutResult.visitor ? (checkoutResult.visitor as { fullName?: string }).fullName : ''}<br/>
                  Time: {typeof checkoutResult.visitor === 'object' && checkoutResult.visitor && 'checkOutTime' in checkoutResult.visitor ? new Date((checkoutResult.visitor as { checkOutTime?: string }).checkOutTime ?? '').toLocaleString() : ''}
                </div>
              )}
              {checkoutResult && !checkoutResult.success && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;