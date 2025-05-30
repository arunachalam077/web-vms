import React, { useState, useEffect } from 'react';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentVisitors from '../components/dashboard/RecentVisitors';
import { getRecentVisitors, getAllVisitors} from '../services/visitorService';
import { Visitor, DashboardStats as DashboardStatsType } from '../types';
import {  Users, UserPlus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
// import VisitorList from '../components/visitors/VisitorList';
// import StatsCard from '../components/dashboard/StatsCard';
// import { UserCheck, UserX } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
  const [stats, setStats] = useState<DashboardStatsType>({
    totalVisitors: 0,
    checkedIn: 0,
    checkedOut: 0,
    todayVisitors: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching dashboard data...');

      // Fetch visitors with pagination
      const visitorsResult = await getAllVisitors(1, 10);
      console.log('Fetched visitors:', visitorsResult);
      
      if (!visitorsResult.data || !Array.isArray(visitorsResult.data)) {
        console.error('Invalid visitor data:', visitorsResult);
        setError('Failed to load visitor data');
        return;
      }

      setVisitors(visitorsResult.data);
      
      // Get recent visitors from the fetched data
      const recent = getRecentVisitors(visitorsResult.data);
      setRecentVisitors(recent);

      // Calculate stats from the fetched data
      const today = new Date().toISOString().slice(0, 10);
      const statsData = {
        totalVisitors: visitorsResult.pagination.total,
        checkedIn: visitorsResult.data.filter(v => v.status === 'checked-in').length,
        checkedOut: visitorsResult.data.filter(v => v.status === 'checked-out').length,
        todayVisitors: visitorsResult.data.filter(v => {
          const visitDate = v.visitDate ? v.visitDate.slice(0, 10) : '';
          return visitDate === today;
        }).length
      };
      setStats(statsData);

      console.log('Current dashboard state - visitors:', visitorsResult.data.length, 'recent:', recent.length);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen md:h-64">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
              <button 
                className="ml-2 font-medium text-red-700 underline hover:text-red-600"
                onClick={fetchData}
              >
                Retry
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const today = formatDate(new Date().toISOString());
  
  return (
    <div className="space-y-6">
      {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon={<Users className="h-5 w-5 md:h-6 md:w-6" />}
          trend={null}
        />
        <StatsCard
          title="Checked In"
          value={stats.checkedIn}
          icon={<UserCheck className="h-5 w-5 md:h-6 md:w-6" />}
          trend={null}
        />
        <StatsCard
          title="Checked Out"
          value={stats.checkedOut}
          icon={<UserX className="h-5 w-5 md:h-6 md:w-6" />}
          trend={null}
        />
        <StatsCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          icon={<Calendar className="h-5 w-5 md:h-6 md:w-6" />}
          trend={null}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-3 py-3 sm:px-6 sm:py-5">
          <h3 className="text-md sm:text-lg leading-6 font-medium text-gray-900">Recent Visitors</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">Latest visitor check-ins and check-outs</p>
        </div>
        <div className="border-t border-gray-200 overflow-x-auto">
          <VisitorList 
            visitors={recentVisitors} 
            onVisitorUpdate={fetchData}
            showActions={true}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <div className="flex items-center">
            <Calendar size={18} className="text-primary-500 mr-2" />
            <h2 className="text-md md:text-lg font-medium text-gray-900">{today}</h2>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Welcome to the Visitor Management Dashboard</p>
        </div>
        
        <div className="mt-3 md:mt-0 w-full md:w-auto">
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Register New Visitor
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div> */}
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <RecentVisitors visitors={recentVisitors} />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
            <h3 className="text-md md:text-lg font-semibold text-gray-800">Quick Links</h3>
          </div>
          
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            <Link 
              to="/visitors" 
              className="block p-3 md:p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3 md:mr-4">
                  <Users size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-900">View Visitor Log</p>
                  <p className="text-xs text-gray-500 hidden sm:block">Browse all visitor records</p>
                </div>
              </div>
            </Link>
            
            <Link 
              to="/register" 
              className="block p-3 md:p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3 md:mr-4">
                  <UserPlus size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-900">Register Visitor</p>
                  <p className="text-xs text-gray-500 hidden sm:block">Add a new visitor to the system</p>
                </div>
              </div>
            </Link>
            
            <a 
              href="#" 
              className="block p-3 md:p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3 md:mr-4">
                  <FileText size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-900">Export Reports</p>
                  <p className="text-xs text-gray-500 hidden sm:block">Generate and download reports</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;