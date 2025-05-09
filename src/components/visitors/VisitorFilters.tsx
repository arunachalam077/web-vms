import React, { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { VisitorFilters as VisitorFiltersType } from '../../types';

interface VisitorFiltersProps {
  filters: VisitorFiltersType;
  onFilterChange: (filters: VisitorFiltersType) => void;
  hosts: string[];
}

const VisitorFilters: React.FC<VisitorFiltersProps> = ({ filters, onFilterChange, hosts }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value
    });
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      status: e.target.value as 'all' | 'checked-in' | 'checked-out'
    });
  };
  
  const handleHostChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      host: e.target.value
    });
  };
  
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value || null
      }
    });
  };
  
  const resetFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      dateRange: {
        from: null,
        to: null
      },
      host: ''
    });
  };
  
  const hasActiveFilters = () => {
    return filters.status !== 'all' || 
      filters.dateRange.from !== null || 
      filters.dateRange.to !== null ||
      filters.host !== '';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search visitors..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              showFilters ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
          
          {hasActiveFilters() && (
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
              onClick={resetFilters}
            >
              <X size={16} className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              value={filters.status}
              onChange={handleStatusChange}
            >
              <option value="all">All Visitors</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
              Host
            </label>
            <select
              id="host"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              value={filters.host}
              onChange={handleHostChange}
            >
              <option value="">All Hosts</option>
              {hosts.map((host, index) => (
                <option key={index} value={host}>{host}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="fromDate"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.dateRange.from || ''}
                onChange={(e) => handleDateChange('from', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="toDate"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                value={filters.dateRange.to || ''}
                onChange={(e) => handleDateChange('to', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorFilters;