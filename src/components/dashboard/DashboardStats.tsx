import React from 'react';
import { Users, UserCheck, UserMinus, Calendar } from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '../../types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
  );
};

export default DashboardStats;