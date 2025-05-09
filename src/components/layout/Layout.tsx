import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      <div className="flex flex-col flex-1 lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto" onClick={closeSidebar}>
          {children}
        </main>
        
        <footer className="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
         JSS Visitor Management System &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Layout;