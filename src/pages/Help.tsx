import React from 'react';
import { Mail, Phone, MessageSquare, FileText, ExternalLink } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Help &amp; Support</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Get help with VisiTrack Visitor Management System</p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Quick Help Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Getting Started</h4>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Learn the basics of using VisiTrack</p>
                <button className="text-primary-600 text-xs sm:text-sm font-medium inline-flex items-center">
                  Learn More
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
              </div>
              
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">FAQs</h4>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Find answers to common questions</p>
                <button className="text-primary-600 text-xs sm:text-sm font-medium inline-flex items-center">
                  View FAQs
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Contact Support</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mx-auto mb-1 sm:mb-2" />
                <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Email Support</h4>
                <p className="text-xs sm:text-sm text-gray-500">support@visitrackapp.com</p>
              </div>
              
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mx-auto mb-1 sm:mb-2" />
                <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Phone Support</h4>
                <p className="text-xs sm:text-sm text-gray-500">1-800-VISITRK</p>
              </div>
              
              <div className="p-3 sm:p-4 border border-gray-200 rounded-lg text-center">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mx-auto mb-1 sm:mb-2" />
                <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Live Chat</h4>
                <p className="text-xs sm:text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div>
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Documentation</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mr-3 sm:mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">User Guide</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Complete documentation for using VisiTrack</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mr-3 sm:mr-4" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">API Documentation</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Technical documentation for developers</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
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