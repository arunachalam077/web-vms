import React from 'react';
import { Users, UserCheck, UserMinus, Calendar, Download } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '../../types';
import Button from '../ui/button';
import { useEffect, useState } from 'react';
import { exportVisitors } from '../../services/visitorService';
import { format } from 'date-fns';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleExport = async () => {
    try {
      const blob = await exportVisitors();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitors-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting visitors:', err);
    }
  };

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.totalVisitors,
      icon: <Users size={18} className="text-primary-500 sm:w-[20px] sm:h-[20px] md:w-6 md:h-6" />,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
    },
    {
      title: 'Currently Checked In',
      value: stats.checkedIn,
      icon: <UserCheck size={18} className="text-success-500 sm:w-[20px] sm:h-[20px] md:w-6 md:h-6" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Checked Out',
      value: stats.checkedOut,
      icon: <UserMinus size={18} className="text-accent-500 sm:w-[20px] sm:h-[20px] md:w-6 md:h-6" />,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      title: 'Today\'s Visitors',
      value: stats.todayVisitors,
      icon: <Calendar size={18} className="text-warning-500 sm:w-[20px] sm:h-[20px] md:w-6 md:h-6" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Dashboard Overview</h2>
        <Button 
          onClick={handleExport} 
          className="flex items-center gap-2 justify-center"
          size="sm"
          fullWidth={true}
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Export CSV</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-3 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-full bg-white shadow-sm mr-3 sm:mr-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
