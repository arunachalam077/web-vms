import React, { useEffect, useState } from 'react';

const ApiTester: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('Testing API connectivity...');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [responseDetails, setResponseDetails] = useState<any>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/visitors');
        setStatusCode(response.status);
        
        if (response.ok) {
          const data = await response.json();
          setTestResult('API connection successful!');
          setResponseDetails(data);
        } else {
          setTestResult(`API Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setTestResult(`API Connection Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testApi();
  }, []);

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-md font-semibold mb-2 flex items-center">
        API Connection Test 
        {statusCode && (
          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusCode >= 200 && statusCode < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {statusCode}
          </span>
        )}
      </h3>
      <p className="text-sm">{testResult}</p>
      
      {responseDetails && (
        <div className="mt-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          {showDetails && (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs" style={{ maxHeight: '150px' }}>
              {JSON.stringify(responseDetails, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTester;