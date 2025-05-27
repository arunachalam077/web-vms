import React, { useState, useEffect } from 'react';
import { getVisitors, exportVisitors, Visitor } from '../../services/visitorService';
import { format } from 'date-fns';
import Button from '../ui/button';
import { Download } from 'lucide-react';

const VisitorDashboard: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await getVisitors(page);
      setVisitors(response.data as Visitor[]);
      setTotalPages(response.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch visitors');
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [page]);

  const handleExport = async () => {
    try {
      const blob = await exportVisitors();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitors-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting visitors:', err);
      setError('Failed to export visitors');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Visitor Dashboard</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visitors.map((visitor) => (
              <tr key={visitor._id}>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.hostName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(visitor.checkInTime), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    visitor.status === 'checked-in' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {visitor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{visitor.exitCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-4">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default VisitorDashboard; 