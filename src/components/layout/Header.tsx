import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/visitors':
        return 'Visitor Log';
      case '/register':
        return 'Register Visitor';
      default:
        return 'Visitor Management System';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <Menu size={24} />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-error-500 rounded-full">
              3
            </span>
          </button>
          
          <div className="flex items-center border-l border-gray-200 pl-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Front Desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;