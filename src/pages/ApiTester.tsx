import React, { useEffect, useState } from 'react';

const ApiTester: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('Testing API connectivity...');
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [responseDetails, setResponseDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testApi = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="mb-6 p-3 sm:p-4 border rounded-lg bg-gray-50">
      <h3 className="text-sm sm:text-md font-semibold mb-2 flex items-center">
        API Connection Test 
        {!isLoading && statusCode && (
          <span className={`ml-2 px-2 py-0.5 sm:py-1 text-xs rounded-full ${statusCode >= 200 && statusCode < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {statusCode}
          </span>
        )}
      </h3>
      
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-t-primary-500 border-r-primary-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-xs sm:text-sm">Testing connection...</p>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm">{testResult}</p>
          
          {responseDetails && (
            <div className="mt-2">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
              
              {showDetails && (
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs" style={{ maxHeight: '120px', fontSize: '10px' }}>
                  {JSON.stringify(responseDetails, null, 2)}
                </pre>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApiTester;