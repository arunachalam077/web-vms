// types.ts - update with your actual structure from the API
export interface Visitor {
  _id?: string;
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  hostName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'checked-in' | 'checked-out';
  visitDate: string;
}

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface VisitorFilters {
  search: string;
  status: 'all' | 'checked-in' | 'checked-out' | string;
  dateRange: DateRange;
  host: string;
}

export interface DashboardStats {
  totalVisitors: number;
  checkedIn: number;
  checkedOut: number;
  todayVisitors: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}