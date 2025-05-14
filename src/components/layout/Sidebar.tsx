import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Clock, Settings, HelpCircle, QrCode, Scan } from 'lucide-react';
import PreRegistrationForm from '../visitors/PreRegistrationForm';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside 
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 bg-primary-950 text-white`}
    >
      <div className="h-full px-3 py-6 flex flex-col">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white p-2 rounded-lg">
          <img src="https://res.cloudinary.com/dtoul17rs/image/upload/v1746157615/lnb3ibyq837jn1zaoyi4.png" alt="jss" className='w-10 h-10 rounded-full'/>
          </div>
          <span className="ml-3 self-center text-xl font-semibold whitespace-nowrap">JSS</span>
        </div>
        
        <ul className="space-y-2 font-medium flex-1">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-gray-300 hover:bg-primary-900'
                }`
              }
              end
              onClick={onClose}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/visitors" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-gray-300 hover:bg-primary-900'
                }`
              }
              onClick={onClose}
            >
              <Users className="w-5 h-5" />
              <span className="ml-3">Visitor Log</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/register" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-gray-300 hover:bg-primary-900'
                }`
              }
              onClick={onClose}
            >
              <UserPlus className="w-5 h-5" />
              <span className="ml-3">Register Visitor</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/scan" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-gray-300 hover:bg-primary-900'
                }`
              }
              onClick={onClose}
            >
              <Scan className="w-5 h-5" />
              <span className="ml-3">QR Scanner</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/qr-generator" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive 
                    ? 'bg-primary-800 text-white' 
                    : 'text-gray-300 hover:bg-primary-900'
                }`
              }
              onClick={onClose}
            >
              <QrCode className="w-5 h-5" />
              <span className="ml-3">QR Generator</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pre-registration"
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg ${
                  isActive ? 'bg-primary-800 text-white' : 'text-gray-300 hover:bg-primary-900'
                }`
              }
              onClick={onClose}
            >
              <UserPlus className="w-5 h-5" />
              <span className="ml-3">Pre-Registration</span>
            </NavLink>
          </li>
        </ul>
        
        <div className="pt-6 mt-6 space-y-2 border-t border-primary-800">
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg ${
                isActive 
                  ? 'bg-primary-800 text-white' 
                  : 'text-gray-300 hover:bg-primary-900'
              }`
            }
            onClick={onClose}
          >
            <Settings className="w-5 h-5" />
            <span className="ml-3">Settings</span>
          </NavLink>
          <NavLink 
            to="/help" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg ${
                isActive 
                  ? 'bg-primary-800 text-white' 
                  : 'text-gray-300 hover:bg-primary-900'
              }`
            }
            onClick={onClose}
          >
            <HelpCircle className="w-5 h-5" />
            <span className="ml-3">Help &amp; Support</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;