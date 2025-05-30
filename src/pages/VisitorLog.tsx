import React, { useState, useEffect } from 'react';
import VisitorList from '../components/visitors/VisitorList';
import VisitorFilters from '../components/visitors/VisitorFilters';
import { getAllVisitors, filterVisitors, getUniqueHosts } from '../services/visitorService';
import { Visitor, VisitorFilters as VisitorFiltersType } from '../types';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VisitorLog: React.FC = () => {
  const [filters, setFilters] = useState<VisitorFiltersType>({
    search: '',
    status: 'all',
    dateRange: {
      from: null,
      to: null
    },
    host: ''
  });
  
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [hosts, setHosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  // Fetch visitors from the backend
  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching visitors...');
      const result = await getAllVisitors(currentPage, pageSize);
      console.log('Fetched visitors data:', result);
      
      // Check if we have valid visitor data
      if (!result.data || !Array.isArray(result.data)) {
        console.error('Invalid visitor data returned from API:', result);
        setError('Received invalid data from the server');
        setVisitors([]);
        setFilteredVisitors([]);
        return;
      }
      
      // Update pagination info
      setTotalPages(result.pagination.totalPages);
      setTotalVisitors(result.pagination.total);
      
      // Check for missing IDs in visitor data
      const invalidVisitors = result.data.filter(v => !v.id);
      if (invalidVisitors.length > 0) {
        console.warn("Some visitors are missing IDs:", invalidVisitors);
      }
      
      // Update state with visitor data
      setVisitors(result.data);
      
      // Get unique hosts
      const uniqueHosts = getUniqueHosts(result.data);
      setHosts(uniqueHosts);
      
      // Apply current filters
      const filtered = filterVisitors(filters, result.data);
      console.log('Filtered visitors:', filtered);
      setFilteredVisitors(filtered);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError(`Failed to load visitors: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    fetchVisitors();
  }, [currentPage, pageSize]); // Refetch when page or page size changes
  
  // Apply filters when they change
  useEffect(() => {
    if (visitors.length > 0) {
      console.log("Applying filters to visitors:", filters);
      const filtered = filterVisitors(filters, visitors);
      setFilteredVisitors(filtered);
    }
  }, [filters, visitors]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: VisitorFiltersType) => {
    console.log('Filter changed to:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Handle visitor updates (checkout, delete)
  const handleVisitorUpdate = () => {
    console.log('Visitor update triggered, refreshing list');
    fetchVisitors(); // Refresh the visitor list
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen md:h-64">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
                  onClick={() => fetchVisitors()}
                >
                  Retry
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-md sm:text-lg font-semibold text-gray-900">Visitor Log</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">View and manage all visitor records</p>
        </div>
        
        <div className="mt-3 md:mt-0 w-full md:w-auto">
          <Link 
            to="/register" 
            className="inline-flex w-full md:w-auto items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <UserPlus size={16} className="mr-2" />
            New Visitor
          </Link>
        </div>
      </div>
      
      <VisitorFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        hosts={hosts}
      />
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <VisitorList 
            visitors={filteredVisitors} 
            onVisitorUpdate={handleVisitorUpdate} 
          />
        </div>
        
        {/* Pagination Controls */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center sm:hidden p-2">
            <div className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalVisitors)}
                </span>{' '}
                of <span className="font-medium">{totalVisitors}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="mt-1 block w-full pl-2 pr-8 md:pl-3 md:pr-10 py-1 md:py-2 text-sm md:text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm rounded-md"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-1 sm:px-2 py-1 sm:py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
                
                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border text-xs sm:text-sm font-medium ${
                          pageNumber === currentPage
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="relative inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-1 sm:px-2 py-1 sm:py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorLog;