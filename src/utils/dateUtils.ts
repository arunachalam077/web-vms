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