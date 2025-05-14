import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import api from '../../services/api';

interface PreRegFormData {
  fullName: string;
  phoneNumber: string;
  purpose: string;
  hostName: string;
  visitDate: string;
  modeOfEntry: string;
}

const PreRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<PreRegFormData>({
    fullName: '',
    phoneNumber: '',
    purpose: '',
    hostName: '',
    visitDate: new Date().toISOString().split('T')[0],
    modeOfEntry: '',
  });
  const [errors, setErrors] = useState<Partial<PreRegFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<PreRegFormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.hostName.trim()) newErrors.hostName = 'Host name is required';
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.modeOfEntry) newErrors.modeOfEntry = 'Mode of entry is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof PreRegFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setApiError(null);
    setShowSuccessMessage(false);
    try {
      const response = await api.post('/visitors/register', formData);
      if (response.data.success) {
        setShowSuccessMessage(true);
        setFormData({
          fullName: '',
          phoneNumber: '',
          purpose: '',
          hostName: '',
          visitDate: new Date().toISOString().split('T')[0],
          modeOfEntry: '',
        });
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to pre-register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Visitor Pre-Registration</h2>
        </div>
        {showSuccessMessage && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            Pre-registration successful! Please check in at the security desk on arrival.
          </div>
        )}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-6 animate-slide-in">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.fullName ? 'border-red-300' : ''}`} />
            {errors.fullName && (<p className="mt-1 text-sm text-red-600">{errors.fullName}</p>)}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.phoneNumber ? 'border-red-300' : ''}`} />
            {errors.phoneNumber && (<p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>)}
          </div>
          <div>
            <label htmlFor="modeOfEntry" className="block text-sm font-medium text-gray-700">Mode of Entry</label>
            <select id="modeOfEntry" name="modeOfEntry" value={formData.modeOfEntry} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.modeOfEntry ? 'border-red-300' : ''}`}> <option value="">Select mode of entry</option> <option value="Walk-in">Walk-in</option> <option value="Van">Van</option> <option value="Lorry">Lorry</option> <option value="Car">Car</option> <option value="Bike">Bike</option> </select>
            {errors.modeOfEntry && (<p className="mt-1 text-sm text-red-600">{errors.modeOfEntry}</p>)}
          </div>
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose of Visit</label>
            <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} rows={3} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.purpose ? 'border-red-300' : ''}`} />
            {errors.purpose && (<p className="mt-1 text-sm text-red-600">{errors.purpose}</p>)}
          </div>
          <div>
            <label htmlFor="hostName" className="block text-sm font-medium text-gray-700">Host Name</label>
            <input type="text" id="hostName" name="hostName" value={formData.hostName} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.hostName ? 'border-red-300' : ''}`} />
            {errors.hostName && (<p className="mt-1 text-sm text-red-600">{errors.hostName}</p>)}
          </div>
          <div>
            <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700">Visit Date</label>
            <input type="date" id="visitDate" name="visitDate" value={formData.visitDate} onChange={handleChange} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.visitDate ? 'border-red-300' : ''}`} />
            {errors.visitDate && (<p className="mt-1 text-sm text-red-600">{errors.visitDate}</p>)}
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Pre-Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default PreRegistrationForm; 