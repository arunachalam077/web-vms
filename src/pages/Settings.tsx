import React, { useState } from 'react';
import { Bell, Mail, Lock, Globe, Moon, Sun, LogOut, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    // Clear any auth tokens or user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Settings</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Manage your application preferences</p>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Account */}
          <div>
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2" />
              Account
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors w-full sm:w-auto"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
              {darkMode ? 
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2" /> : 
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2" />
              }
              Appearance
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-0">
              <div class="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-700">Dark Mode</p>
                <p className="text-xs text-gray-500">Switch between light and dark themes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2" />
              Notifications
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-0">
                <div class="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive email updates about visitor activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-0">
                <div class="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Push Notifications</p>
                  <p className="text-xs text-gray-500">Get real-time push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={pushNotifications}
                    onChange={() => setPushNotifications(!pushNotifications)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2" />
              Language & Region
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <label htmlFor="language" className="block text-xs sm:text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                className="mt-1 block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 flex items-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mr-2" />
              Security
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4">
              <button
                className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Confirm Logout</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;