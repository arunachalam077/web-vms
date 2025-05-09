import React, { useState } from 'react';
import api from '../services/api';

interface VisitorFormData {
  name: string;
  phoneNumber: string;
  purpose: string;
  visitingWhom: string;
  guardName: string;
  guardId: string;
}

const VisitorRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    phoneNumber: '',
    purpose: '',
    visitingWhom: '',
    guardName: '',
    guardId: ''
  });
  const [exitCode, setExitCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/visitors/register', formData);
      setExitCode(response.data.data.exitCode);
      setFormData({
        name: '',
        phoneNumber: '',
        purpose: '',
        visitingWhom: '',
        guardName: '',
        guardId: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering visitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Visitor Registration</h2>
      
      {exitCode && (
        <div className="mb-6 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-semibold">Visitor registered successfully!</p>
          <p className="text-green-700">Exit Code: {exitCode}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Visitor Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose of Visit</label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Visiting Whom</label>
          <input
            type="text"
            name="visitingWhom"
            value={formData.visitingWhom}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Guard Name</label>
          <input
            type="text"
            name="guardName"
            value={formData.guardName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Guard ID</label>
          <input
            type="text"
            name="guardId"
            value={formData.guardId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Visitor'}
        </button>
      </form>
    </div>
  );
};

export default VisitorRegistrationForm; 