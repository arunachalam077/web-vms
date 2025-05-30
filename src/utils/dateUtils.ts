import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date to localized string
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

// Format time to 12-hour format
export const formatTime = (dateString: string): string => {
  return format(parseISO(dateString), 'h:mm a');
};

// Format date and time together
export const formatDateTime = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
};

// Get current formatted date as YYYY-MM-DD
export const getCurrentFormattedDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

// Format duration between two ISO date strings as H:mm:ss
export const formatDuration = (start: string, end: string): string => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  let diff = Math.abs(endDate.getTime() - startDate.getTime()) / 1000; // in seconds
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = Math.floor(diff % 60);
  return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
};