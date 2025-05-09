import { Visitor, VisitorFilters, DashboardStats } from '../types';
import api from './api';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : 'http://192.168.1.61:3001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Get all visitors from backend with pagination
export const getAllVisitors = async (page: number = 1, limit: number = 10): Promise<{ data: Visitor[], pagination: { total: number, page: number, limit: number, totalPages: number } }> => {
  try {
    console.log('Fetching visitors with pagination:', { page, limit });
    const response = await api.get(`/visitors?page=${page}&limit=${limit}`);
    
    console.log('Fetched visitors with pagination:', response.data);
    
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    };
  } catch (error) {
    console.error('Error in getAllVisitors:', error);
    throw error;
  }
};

// Add a new visitor
export const addVisitor = async (visitorData: Omit<Visitor, 'id' | 'checkInTime' | 'checkOutTime' | 'status'>): Promise<Visitor> => {
  try {
    console.log('Adding new visitor:', visitorData);
    const response = await api.post('/visitors', visitorData);
    
    console.log('Visitor added successfully:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error in addVisitor:', error);
    throw error;
  }
};

// Check out a visitor
export const checkOutVisitor = async (visitorId: string): Promise<Visitor> => {
  try {
    console.log(`Checking out visitor with ID: ${visitorId}`);
    const response = await api.put(`/visitors/${visitorId}/checkout`);
    
    console.log('Visitor checked out successfully:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error checking out visitor:', error);
    throw error;
  }
};

// Delete a visitor
export const deleteVisitor = async (visitorId: string): Promise<void> => {
  try {
    console.log(`Deleting visitor with ID: ${visitorId}`);
    await api.delete(`/visitors/${visitorId}`);
    
    console.log('Visitor deleted successfully');
  } catch (error) {
    console.error('Error deleting visitor:', error);
    throw error;
  }
};

// Filter visitors (client-side, after fetching all)
export const filterVisitors = (filters: VisitorFilters, visitors: Visitor[]): Visitor[] => {
  // Add console logs to debug
  console.log('Filtering visitors with filters:', filters);
  console.log('Visitors to filter:', visitors);
  
  if (!visitors || !Array.isArray(visitors) || visitors.length === 0) {
    console.log('No visitors to filter, returning empty array');
    return [];
  }
  
  return visitors.filter(visitor => {
    // Search filter (name, email, phone, host)
    const searchTerms = filters.search?.toLowerCase() || '';
    const searchMatch = !filters.search || 
      visitor.fullName?.toLowerCase().includes(searchTerms) ||
      visitor.email?.toLowerCase().includes(searchTerms) ||
      visitor.phoneNumber?.toLowerCase().includes(searchTerms) ||
      visitor.hostName?.toLowerCase().includes(searchTerms);
    
    // Status filter
    const statusMatch = filters.status === 'all' || visitor.status === filters.status;
    
    // Host filter
    const hostMatch = !filters.host || visitor.hostName?.toLowerCase().includes(filters.host.toLowerCase());
    
    // Date range filter
    let dateMatch = true;
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const visitDate = new Date(visitor.visitDate);
      if (filters.dateRange.from && filters.dateRange.to) {
        const fromDate = new Date(filters.dateRange.from);
        const toDate = new Date(filters.dateRange.to);
        dateMatch = visitDate >= fromDate && visitDate <= toDate;
      } else if (filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from);
        dateMatch = visitDate >= fromDate;
      } else if (filters.dateRange.to) {
        const toDate = new Date(filters.dateRange.to);
        dateMatch = visitDate <= toDate;
      }
    }
    
    const result = searchMatch && statusMatch && hostMatch && dateMatch;
    return result;
  });
};

// Get unique host names for filtering (client-side, after fetching all)
export const getUniqueHosts = (visitors: Visitor[]): string[] => {
  if (!visitors || !Array.isArray(visitors)) {
    return [];
  }
  
  const hosts = new Set(visitors.map(v => v.hostName).filter(Boolean));
  return Array.from(hosts);
};

// Get recent visitors (last 5, client-side)
export const getRecentVisitors = (visitors: Visitor[]): Visitor[] => {
  if (!visitors || !Array.isArray(visitors) || visitors.length === 0) {
    return [];
  }
  
  return [...visitors]
    .sort((a, b) => new Date(b.checkInTime || 0).getTime() - new Date(a.checkInTime || 0).getTime())
    .slice(0, 5);
};

// Get dashboard stats
export const getVisitorStats = async (): Promise<DashboardStats> => {
  try {
    // First try the stats endpoint
    console.log('Attempting to fetch stats from endpoint');
    try {
      const statsUrl = `${API_URL}/stats/overview`;
      const response = await fetch(statsUrl, {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched stats from endpoint:', data);
        return data.data || data;
      } else {
        console.log('Stats endpoint returned error:', response.status, response.statusText);
      }
    } catch (err) {
      console.log('Stats endpoint not available, calculating from visitors');
    }
    
    // If stats endpoint fails, calculate from visitors
    const visitors = await getAllVisitors();
    console.log('Calculating stats from', visitors.data.length, 'visitors');
    
    const today = new Date().toISOString().slice(0, 10);
    return {
      totalVisitors: visitors.data.length,
      checkedIn: visitors.data.filter(v => v.status === 'checked-in').length,
      checkedOut: visitors.data.filter(v => v.status === 'checked-out').length,
      todayVisitors: visitors.data.filter(v => {
        const visitDate = v.visitDate ? v.visitDate.slice(0, 10) : '';
        return visitDate === today;
      }).length
    };
  } catch (error) {
    console.error('Error in getVisitorStats:', error);
    
    // Return default stats if all else fails
    return {
      totalVisitors: 0,
      checkedIn: 0,
      checkedOut: 0,
      todayVisitors: 0
    };
  }
};