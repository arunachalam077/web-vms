import React, { useState } from 'react';
import { User, Phone, Mail, MessageSquare, UserCheck, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addVisitor } from '../../services/visitorService';
import { getCurrentFormattedDate } from '../../utils/dateUtils';

const VisitorForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    purpose: '',
    hostName: '',
    visitDate: getCurrentFormattedDate(),
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    if (!formData.hostName.trim()) {
      newErrors.hostName = 'Host name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error when form is edited
    if (apiError) {
      setApiError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Add visitor to the system
      const response = await addVisitor(formData);
      
      if (response) {
        // Show success message and reset form
        setShowSuccessMessage(true);
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          purpose: '',
          hostName: '',
          visitDate: getCurrentFormattedDate(),
        });
        
        // Redirect to visitor log after a delay
        setTimeout(() => {
          navigate('/visitors');
        }, 2000);
      }
    } catch (error) {
      console.error('Error registering visitor:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to register visitor. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Register New Visitor</h2>
      
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative mb-6 animate-slide-in">
          <span className="block sm:inline">Visitor successfully registered and checked in!</span>
        </div>
      )}
      
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-6 animate-slide-in">
          <span className="block sm:inline">{apiError}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                value={formData.fullName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>
          
          <div className="col-span-1">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>
          
          <div className="col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="col-span-1">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Visit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="purpose"
                name="purpose"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.purpose ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                value={formData.purpose}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>}
          </div>
          
          <div className="col-span-1">
            <label htmlFor="hostName" className="block text-sm font-medium text-gray-700 mb-1">
              Host Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCheck size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="hostName"
                name="hostName"
                className={`block w-full pl-10 pr-3 py-2 border ${errors.hostName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500`}
                value={formData.hostName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            {errors.hostName && <p className="mt-1 text-sm text-red-500">{errors.hostName}</p>}
          </div>
          
          <div className="col-span-1">
            <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
              Visit Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarClock size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="visitDate"
                name="visitDate"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={formData.visitDate}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => navigate('/visitors')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register & Check In'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisitorForm;