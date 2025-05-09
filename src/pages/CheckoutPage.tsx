import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import api from '../services/api';

const CheckoutPage: React.FC = () => {
  const [exitCode, setExitCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Use local network IP address for QR code
  const qrCodeUrl = `http://192.168.1.61:5173/checkout`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post('/visitors/checkout', { exitCode });
      if (response.data.success) {
        setSuccess(true);
        setExitCode('');
      }
    } catch (error) {
      setError('Invalid exit code or visitor already checked out');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <QrCode className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Visitor Checkout</h2>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            Checkout successful! Thank you for visiting.
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Scan QR Code</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
              alt="Checkout QR Code"
              className="mx-auto"
            />
            <p className="mt-2 text-sm text-gray-600">
              Scan this QR code to access the checkout page
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Make sure your mobile device is connected to the same WiFi network
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="exitCode" className="block text-sm font-medium text-gray-700">
              Enter Exit Code
            </label>
            <input
              type="text"
              id="exitCode"
              value={exitCode}
              onChange={(e) => setExitCode(e.target.value)}
              placeholder="Enter your 3-digit exit code"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              maxLength={3}
              pattern="[0-9]{3}"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Check Out'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage; 