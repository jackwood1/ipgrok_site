import { useState } from "react";
import { Card, Button, Badge } from "./ui";

interface PingResult {
  host: string;
  time: number;
  status: 'success' | 'error';
  error?: string;
}

export function PingTest() {
  const [host, setHost] = useState("www.microsoft.com");
  const [results, setResults] = useState<PingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pingCount, setPingCount] = useState(4);

  const pingHost = async (targetHost: string): Promise<PingResult> => {
    const start = performance.now();
    try {
      // Use a simple GET request to measure round-trip time
      // We'll try to fetch a small resource or just test connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`https://${targetHost}`, {
        method: 'HEAD', // Use HEAD to minimize data transfer
        mode: 'no-cors', // Allow cross-origin requests
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const end = performance.now();
      
      return {
        host: targetHost,
        time: Math.round(end - start),
        status: 'success'
      };
    } catch (error) {
      return {
        host: targetHost,
        time: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runPingTest = async () => {
    setLoading(true);
    setResults([]);
    
    const newResults: PingResult[] = [];
    
    for (let i = 0; i < pingCount; i++) {
      const result = await pingHost(host);
      newResults.push(result);
      setResults([...newResults]); // Update results after each ping
      
      // Small delay between pings
      if (i < pingCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setLoading(false);
  };

  const getAverageTime = () => {
    const successfulPings = results.filter(r => r.status === 'success');
    if (successfulPings.length === 0) return 0;
    const total = successfulPings.reduce((sum, r) => sum + r.time, 0);
    return Math.round(total / successfulPings.length);
  };

  const getSuccessRate = () => {
    if (results.length === 0) return 0;
    const successful = results.filter(r => r.status === 'success').length;
    return Math.round((successful / results.length) * 100);
  };

  const getStatusBadge = () => {
    const successRate = getSuccessRate();
    if (successRate === 100) return <Badge variant="success">Excellent</Badge>;
    if (successRate >= 75) return <Badge variant="warning">Good</Badge>;
    return <Badge variant="danger">Poor</Badge>;
  };

  return (
    <Card title="Ping Test" subtitle="Test connectivity and response time to a host">
      <div className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Host
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="www.microsoft.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Pings
            </label>
            <select
              value={pingCount}
              onChange={(e) => setPingCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 ping</option>
              <option value={4}>4 pings</option>
              <option value={8}>8 pings</option>
              <option value={10}>10 pings</option>
            </select>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <Button
            onClick={runPingTest}
            loading={loading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? "Pinging..." : `Ping ${host}`}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getSuccessRate()}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getAverageTime()}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Time</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  {getStatusBadge()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Status</div>
              </div>
            </div>

            {/* Individual Results */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Ping Results
              </h4>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Ping #{index + 1}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {result.host}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.status === 'success' ? (
                        <>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.time}ms
                          </span>
                          <Badge variant="success" size="sm">OK</Badge>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-500">timeout</span>
                          <Badge variant="danger" size="sm">Failed</Badge>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretation */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Interpretation
              </h5>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• <strong>0-50ms:</strong> Excellent connection</p>
                <p>• <strong>50-100ms:</strong> Good connection</p>
                <p>• <strong>100-200ms:</strong> Fair connection</p>
                <p>• <strong>200ms+:</strong> Poor connection</p>
                <p className="mt-2 text-xs">
                  Note: This test uses HTTP requests to simulate ping. Results may vary from traditional ICMP ping.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 