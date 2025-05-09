import React from 'react';
import { Mail, Phone, MessageSquare, FileText, ExternalLink } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Help &amp; Support</h2>
          <p className="mt-1 text-sm text-gray-500">Get help with VisiTrack Visitor Management System</p>
        </div>

        <div className="p-6">
          {/* Quick Help Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
                <p className="text-sm text-gray-500 mb-3">Learn the basics of using VisiTrack</p>
                <button className="text-primary-600 text-sm font-medium inline-flex items-center">
                  Learn More
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">FAQs</h4>
                <p className="text-sm text-gray-500 mb-3">Find answers to common questions</p>
                <button className="text-primary-600 text-sm font-medium inline-flex items-center">
                  View FAQs
                  <ExternalLink className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Mail className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
                <p className="text-sm text-gray-500">support@visitrackapp.com</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Phone className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Phone Support</h4>
                <p className="text-sm text-gray-500">1-800-VISITRK</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <MessageSquare className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 mb-1">Live Chat</h4>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <FileText className="w-6 h-6 text-primary-600 mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">User Guide</h4>
                  <p className="text-sm text-gray-500">Complete documentation for using VisiTrack</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <FileText className="w-6 h-6 text-primary-600 mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">API Documentation</h4>
                  <p className="text-sm text-gray-500">Technical documentation for developers</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;