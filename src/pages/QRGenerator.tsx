import React, { useState } from 'react';
import QRCode from 'qrcode';
import { Download, RefreshCw } from 'lucide-react';

const QRGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#4F46E5', // Primary color
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Generator</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Text or URL
              </label>
              <input
                type="text"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter text to generate QR code"
              />
            </div>
            
            <button
              onClick={generateQRCode}
              disabled={!text.trim() || isGenerating}
              className={`w-full px-4 py-2 rounded-lg text-white flex items-center justify-center ${
                text.trim() && !isGenerating
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </button>
            
            {qrCodeUrl && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="w-64 h-64"
                  />
                </div>
                
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;