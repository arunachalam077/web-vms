// components/VisitorForm.tsx
import React, { useState, useRef } from 'react';
import { Shield } from 'lucide-react';
import api from '../../services/api';

interface VisitorFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  hostName: string;
  company: string;
  vehicleNumber: string;
  modeOfEntry: string;
  visitDate: string;
}

interface VisitorData {
  fullName: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  hostName: string;
  company: string;
  vehicleNumber: string;
  modeOfEntry: string;
  visitDate: string;
  checkInTime: string;
  exitCode: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message: string;
}

const VisitorForm: React.FC = () => {
  const [formData, setFormData] = useState<VisitorFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    purpose: '',
    hostName: '',
    company: '',
    vehicleNumber: '',
    modeOfEntry: '',
    visitDate: new Date().toISOString().split('T')[0],
  });
  
  const [errors, setErrors] = useState<Partial<VisitorFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [exitCode, setExitCode] = useState<string>('');
  const [printData, setPrintData] = useState<VisitorData | null>(null);
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const validateForm = () => {
    const newErrors: Partial<VisitorFormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.hostName.trim()) newErrors.hostName = 'Host name is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.modeOfEntry) newErrors.modeOfEntry = 'Mode of entry is required';
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof VisitorFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form data before validation:", formData);
    
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    setShowSuccessMessage(false);

    try {
      // Ensure all required fields are present
      const visitorData = {
        ...formData,
        company: formData.company || '',
        vehicleNumber: formData.vehicleNumber || '',
        modeOfEntry: formData.modeOfEntry || ''
      };

      console.log("Sending data to API:", visitorData);
      
      const response = await api.post('/visitors/register', visitorData);
      console.log("API response:", response);
      
      if (response.data.success) {
        setExitCode(response.data.data.exitCode);
        setShowSuccessMessage(true);
        setPrintData(response.data.data);
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          purpose: '',
          hostName: '',
          company: '',
          vehicleNumber: '',
          modeOfEntry: '',
          visitDate: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error registering visitor:', error);
      const apiError = error as ApiError;
      console.log('Error details:', apiError.response?.data);
      const errorMessage = apiError.response?.data?.message || 
                          apiError.response?.data?.error || 
                          apiError.message || 
                          'Failed to register visitor. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank', 'width=400,height=300');
      if (!printWindow) {
        alert("Please allow pop-ups to print the visitor pass");
        return;
      }

      const printContent = `
        <html>
          <head>
            <title>Visitor Pass</title>
            <style>
              @media print {
                @page {
                  size: 50mm 80mm;
                  margin: 0;
                }
                body {
                  width: 50mm;
                  height: 80mm;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  text-align: left;
                }
                .ticket-container {
                  width: 50mm;
                  height: 80mm;
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: flex-start;
                  text-align: left;
                }
              }
              body {
                font-family: Arial, sans-serif;
                width: 50mm;
                height: 80mm;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                text-align: left;
              }
              .ticket-container {
                width: 50mm;
                height: 80mm;
                padding: 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                text-align: left;
              }
              .header {
                text-align: center;
                font-weight: bold;
                font-size: 18px;
                margin-top: 4px;
                margin-bottom: 8px;
                letter-spacing: 1px;
                width: 100%;
              }
              .grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                row-gap: 4px;
                column-gap: 6px;
                font-size: 11px;
                margin-bottom: 8px;
                width: 100%;
                text-align: left;
              }
              .label {
                font-weight: bold;
                text-align: left;
              }
              .value {
                text-align: left;
              }
              .disclaimer {
                font-size: 7px;
                margin-top: 8px;
                border-top: 1px solid #eee;
                padding-top: 3px;
                line-height: 1.2;
                width: 100%;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="ticket-container">
              <div class="header">JACIN SECURIall TY VMS</div>
              <div class="grid">
                <div class="label">Name</div>
                <div class="value">${printData?.fullName || ''}</div>
                <div class="label">Date</div>
                <div class="value">${printData?.visitDate ? new Date(printData.visitDate).toLocaleDateString() : ''}</div>
                <div class="label">Time</div>
                <div class="value">${printData?.checkInTime ? new Date(printData.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                <div class="label">Mobile no</div>
                <div class="value">${printData?.phoneNumber ? printData.phoneNumber.replace(/(\d{2})\d{4}(\d{2})/, '$1****$2') : ''}</div>
                <div class="label">Exit Code</div>
                <div class="value">${exitCode}</div>
              </div>
              <div class="disclaimer">
                <b>Disclaimer Notice:</b> The management is not responsible for any theft, damage, or other misdemeanor howsoever caused to vehicles and their equipment contents therein parked in the basement in a manner that does not disrupt the flow of traffic.
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Register New Visitor</h2>
        </div>
      
        {showSuccessMessage && printData && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            Visitor registered successfully!
            {exitCode && (
              <>
                <p className="mt-2 font-semibold">Exit Code: {exitCode}</p>
                <div ref={printRef} className="hidden">
                  <div className="header">PARKWOOD</div>
                  <div className="grid">
                    <div className="label">Name</div>
                    <div className="value">{printData?.fullName || ''}</div>
                    <div className="label">Date</div>
                    <div className="value">{printData?.visitDate ? new Date(printData.visitDate).toLocaleDateString() : ''}</div>
                    <div className="label">Time</div>
                    <div className="value">{printData?.checkInTime ? new Date(printData.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                    <div className="label">Mobile no</div>
                    <div className="value">{printData?.phoneNumber ? printData.phoneNumber.replace(/(\d{2})\d{4}(\d{2})/, '$1****$2') : ''}</div>
                    <div className="label">Exit Code</div>
                    <div className="value">{exitCode}</div>
                  </div>
                  <div className="disclaimer">
                    <b>Disclaimer Notice:</b> The management is not responsible for any theft, damage, or other misdemeanor howsoever caused to vehicles and their equipment contents therein parked in the basement in a manner that does not disrupt the flow of traffic.
                  </div>
                </div>
                <button onClick={handlePrint} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Print</button>
              </>
            )}
          </div>
        )}
      
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-6 animate-slide-in">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.fullName ? 'border-red-300' : ''
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.phoneNumber ? 'border-red-300' : ''
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.email ? 'border-red-300' : ''
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Purpose of Visit
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.purpose ? 'border-red-300' : ''
              }`}
            />
            {errors.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
            )}
          </div>

          <div>
            <label htmlFor="hostName" className="block text-sm font-medium text-gray-700">
              Host Name
            </label>
            <input
              type="text"
              id="hostName"
              name="hostName"
              value={formData.hostName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.hostName ? 'border-red-300' : ''
              }`}
            />
            {errors.hostName && (
              <p className="mt-1 text-sm text-red-600">{errors.hostName}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.company ? 'border-red-300' : ''
              }`}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>

          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
              Vehicle Number
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.vehicleNumber ? 'border-red-300' : ''
              }`}
            />
            {errors.vehicleNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="modeOfEntry" className="block text-sm font-medium text-gray-700">
              Mode of Entry
            </label>
            <select
              id="modeOfEntry"
              name="modeOfEntry"
              value={formData.modeOfEntry}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.modeOfEntry ? 'border-red-300' : ''
              }`}
            >
              <option value="">Select mode of entry</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Van">Van</option>
              <option value="Lorry">Lorry</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
            {errors.modeOfEntry && (
              <p className="mt-1 text-sm text-red-600">{errors.modeOfEntry}</p>
            )}
          </div>

          <div>
            <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">
              Visit Date
            </label>
            <input
              type="date"
              id="visitDate"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.visitDate ? 'border-red-300' : ''
              }`}
            />
            {errors.visitDate && (
              <p className="mt-1 text-sm text-red-600">{errors.visitDate}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register Visitor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitorForm;