import React from 'react';
import { Visitor } from '../../types';
import { UserCheck, UserMinus } from 'lucide-react';
import { formatTime, getRelativeTime } from '../../utils/dateUtils';

interface RecentVisitorsProps {
  visitors: Visitor[];
}

const RecentVisitors: React.FC<RecentVisitorsProps> = ({ visitors }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Visitors</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {visitors.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            No recent visitors found.
          </div>
        ) : (
          visitors.map((visitor, index) => (
            <div 
              key={visitor.id} 
              className="px-6 py-4 flex items-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-full mr-4 ${
                visitor.status === 'checked-in' 
                  ? 'bg-green-100 text-success-500' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {visitor.status === 'checked-in' 
                  ? <UserCheck size={20} /> 
                  : <UserMinus size={20} />
                }
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {visitor.fullName}
                </p>
                <div className="flex items-center">
                  <p className="text-xs text-gray-500 mr-2">
                    Visiting {visitor.hostName}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {visitor.purpose}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-xs font-medium ${
                  visitor.status === 'checked-in' 
                    ? 'text-success-500' 
                    : 'text-gray-500'
                }`}>
                  {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                </div>
                <p className="text-xs text-gray-500">
                  {visitor.status === 'checked-in' 
                    ? formatTime(visitor.checkInTime) 
                    : getRelativeTime(visitor.checkOutTime || visitor.checkInTime)
                  }
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentVisitors;