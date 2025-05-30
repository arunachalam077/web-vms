import React, { useState, useEffect } from 'react';
import { Visitor } from '../../types';
import { ArrowUp, ArrowDown, MoreVertical, UserMinus, Trash, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { checkOutVisitor, deleteVisitor } from '../../services/visitorService';
import { format } from 'date-fns';
import Button from '../ui/button';
import { toast } from 'react-hot-toast';

interface VisitorListProps {
  visitors: Visitor[];
  onVisitorUpdate: () => void;
  showActions?: boolean;
}

interface LoadingState {
  [key: string]: boolean;
}

const VisitorList: React.FC<VisitorListProps> = ({ visitors, onVisitorUpdate, showActions = true }) => {
  const [sortField, setSortField] = useState<keyof Visitor>('checkInTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(true); // Set to true for debugging
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Debug function to inspect the visitor data structure
  useEffect(() => {
    if (debugMode) {
      console.log("== DEBUG: Visitor Data Structure ==");
      if (visitors.length > 0) {
        const sampleVisitor = visitors[0];
        console.log("Sample visitor object:", sampleVisitor);
        console.log("Visitor ID type:", typeof sampleVisitor.id);
        console.log("Visitor ID value:", sampleVisitor.id);
        
        // Check if ID exists but is in a different property
        const allKeys = Object.keys(sampleVisitor);
        console.log("All visitor object keys:", allKeys);
        
        // Check for ID-like properties
        const idLikeKeys = allKeys.filter(key => 
          key.toLowerCase().includes('id') || 
          key === '_id' || 
          key === 'key' || 
          key === 'visitorId'
        );
        if (idLikeKeys.length > 0) {
          console.log("Potential ID fields found:", idLikeKeys);
          idLikeKeys.forEach(key => {
            console.log(`  ${key}:`, (sampleVisitor as any)[key]);
          });
        }
      } else {
        console.log("No visitors data available for inspection");
      }
    }
  }, [visitors, debugMode]);
  
  const handleSort = (field: keyof Visitor) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Helper function to get a valid ID from visitor object
  const getVisitorId = (visitor: Visitor): string | null => {
    // Try standard id property
    if (visitor.id) return visitor.id;
    
    // Check if ID is in a different property
    if ((visitor as any)._id) return (visitor as any)._id;
    if ((visitor as any).visitorId) return (visitor as any).visitorId;
    if ((visitor as any).visitor_id) return (visitor as any).visitor_id;
    
    // Check for any property that might contain an ID
    const keys = Object.keys(visitor);
    for (const key of keys) {
      if (key.toLowerCase().includes('id') && typeof (visitor as any)[key] === 'string') {
        return (visitor as any)[key];
      }
    }
    
    return null;
  };
  
  const sortedVisitors = [...visitors].sort((a, b) => {
    if (sortField === 'checkInTime' || sortField === 'checkOutTime') {
      const aTime = a[sortField] ? new Date(a[sortField] as string).getTime() : 0;
      const bTime = b[sortField] ? new Date(b[sortField] as string).getTime() : 0;
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    } else {
      const aValue = (a[sortField] as string) || '';
      const bValue = (b[sortField] as string) || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });
  
  const toggleDropdown = (visitorId: string) => {
    setActiveDropdown(activeDropdown === visitorId ? null : visitorId);
  };
  
  const handleCheckOut = async (exitCode: string) => {
    if (!exitCode) {
      toast.error('Exit code is required');
      return;
    }
    try {
      console.log('Attempting to check out visitor with exit code:', exitCode);
      const updatedVisitor = await checkOutVisitor(exitCode);
      console.log('Visitor checked out successfully:', updatedVisitor);
      
      // Update the visitor in the list
      onVisitorUpdate();
      toast.success('Visitor checked out successfully');
    } catch (err) {
      console.error('Error checking out visitor:', err);
      toast.error('Failed to check out visitor');
    }
  };
  
  const handleDelete = async (visitor: Visitor) => {
    const visitorId = getVisitorId(visitor) || `visitor-${index}`;
    if (!visitorId) {
      setError('Visitor ID not found');
      return;
    }

    if (window.confirm('Are you sure you want to delete this visitor?')) {
      setLoading(prev => ({ ...prev, [visitorId]: true }));
      try {
        await deleteVisitor(visitorId);
        onVisitorUpdate();
      } catch (error) {
        console.error('Error deleting visitor:', error);
        setError('Failed to delete visitor');
      } finally {
        setLoading(prev => ({ ...prev, [visitorId]: false }));
      }
    }
  };
  
  if (visitors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-fade-in">
        <p className="text-gray-500">No visitors found matching your criteria.</p>
      </div>
    );
  }
  
  // MOBILE CARD VIEW
  const MobileVisitorCard = ({ visitor, localId, index }: { visitor: Visitor, localId: string, index: number }) => (
    <div className="block md:hidden bg-white rounded-lg shadow-sm mb-4 p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-900 text-base">{visitor.fullName}</div>
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          visitor.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
        </span>
      </div>
      <div className="text-xs text-gray-500 mb-1">{visitor.email} | {visitor.phoneNumber}</div>
      <div className="text-xs text-gray-500 mb-1">Host: <span className="font-medium text-gray-700">{visitor.hostName}</span></div>
      <div className="text-xs text-gray-500 mb-1">Purpose: <span className="font-medium text-gray-700">{visitor.purpose}</span></div>
      <div className="text-xs text-gray-500 mb-1">Visit Date: {formatDate(visitor.visitDate)}</div>
      <div className="text-xs text-gray-500 mb-1">Check In: {formatTime(visitor.checkInTime)}</div>
      <div className="text-xs text-gray-500 mb-1">Vehicle: {visitor.vehicleNumber}</div>
      {showActions && (
        <div className="flex justify-end mt-2">
          {loading[localId] ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          ) : (
            <>
              <button
                onClick={() => toggleDropdown(localId)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <MoreVertical size={18} />
              </button>
              {(activeDropdown === localId) && (
                <div className="absolute right-4 top-10 w-48 bg-white rounded-md shadow-lg z-10 animate-fade-in">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {visitor.status === 'checked-in' && (
                      <button
                        onClick={() => handleCheckOut(visitor.exitCode)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <UserMinus size={16} className="mr-2" />
                        Check Out
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(visitor)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                    >
                      <Trash size={16} className="mr-2" />
                      Delete Record
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                className="mt-2 text-xs font-medium text-red-700 hover:text-red-600"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Card List */}
      <div className="md:hidden">
        {sortedVisitors.map((visitor, index) => {
          const localId = getVisitorId(visitor) || `visitor-${index}`;
          return (
            <MobileVisitorCard
              key={localId}
              visitor={visitor}
              localId={localId}
              index={index}
            />
          );
        })}
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('fullName')}
                >
                  <div className="flex items-center">
                    Visitor
                    {sortField === 'fullName' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('hostName')}
                >
                  <div className="flex items-center">
                    Host
                    {sortField === 'hostName' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purpose')}
                >
                  <div className="flex items-center">
                    Purpose
                    {sortField === 'purpose' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('visitDate')}
                >
                  <div className="flex items-center">
                    Visit Date
                    {sortField === 'visitDate' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('checkInTime')}
                >
                  <div className="flex items-center">
                    Check In
                    {sortField === 'checkInTime' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ArrowUp size={16} className="ml-1" /> : <ArrowDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vehicle Number
                </th>
                {showActions && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedVisitors.map((visitor, index) => {
                const visitorId = getVisitorId(visitor) || `visitor-${index}`;
                return (
                  <tr key={visitorId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{visitor.fullName}</div>
                      {debugMode && (
                        <div className="text-xs text-gray-500">
                          ID: {visitorId || 'missing'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{visitor.email}</div>
                      <div className="text-sm text-gray-500">{visitor.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{visitor.hostName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {visitor.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(visitor.visitDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(visitor.checkInTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        visitor.status === 'checked-in' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {visitor.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visitor.vehicleNumber}
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        {loading[visitorId] ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                        ) : (
                          <>
                            <button 
                              onClick={() => toggleDropdown(visitorId)}
                              className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                              <MoreVertical size={18} />
                            </button>
                            {activeDropdown === visitorId && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 animate-fade-in">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  {visitor.status === 'checked-in' && (
                                    <button
                                      onClick={() => handleCheckOut(visitor.exitCode)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                      role="menuitem"
                                    >
                                      <UserMinus size={16} className="mr-2" />
                                      Check Out
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDelete(visitor)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                    role="menuitem"
                                  >
                                    <Trash size={16} className="mr-2" />
                                    Delete Record
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    
    </div>
  );
};

export default VisitorList;