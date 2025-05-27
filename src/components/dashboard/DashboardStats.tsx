import React from 'react';
import { Users, UserCheck, UserMinus, Calendar, Download } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '../../types';
import Button from '../ui/button';
import { exportVisitors } from '../../services/visitorService';
import { format } from 'date-fns';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
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
      icon: <Users size={24} className="text-primary-500" />,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
    },
    {
      title: 'Currently Checked In',
      value: stats.checkedIn,
      icon: <UserCheck size={24} className="text-success-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Checked Out',
      value: stats.checkedOut,
      icon: <UserMinus size={24} className="text-accent-500" />,
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      title: 'Today\'s Visitors',
      value: stats.todayVisitors,
      icon: <Calendar size={24} className="text-warning-500" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
