import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";

interface TracerouteHop {
  hop: number;
  host: string;
  ip: string;
  fqdn: string;
  time: number;
  status: 'success' | 'timeout' | 'error';
}

interface TracerouteTestProps {
  onDataUpdate?: (data: any) => void;
}

export function TracerouteTest({ onDataUpdate }: TracerouteTestProps) {
  const [host, setHost] = useState("www.microsoft.com");
  const [results, setResults] = useState<TracerouteHop[]>([]);
  const [loading, setLoading] = useState(false);
  const [maxHops, setMaxHops] = useState(15);

  // Update export data when results change
  useEffect(() => {
    if (onDataUpdate && results.length > 0) {
      const successfulHops = results.filter(r => r.status === 'success').length;
      onDataUpdate({
        host,
        results,
        totalHops: results.length,
        successfulHops,
      });
    }
  }, [results, host, onDataUpdate]);

  const resolveIP = async (hostname: string): Promise<string> => {
    try {
      // Try to resolve IP using a DNS lookup service
      const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
      const data = await response.json();
      
      if (data.Answer && data.Answer.length > 0) {
        return data.Answer[0].data;
      }
      
      // Fallback: try to get IP from the hostname itself
      return hostname;
    } catch {
      // If DNS resolution fails, return the hostname
      return hostname;
    }
  };

  const getFQDN = async (ip: string, originalHost: string): Promise<string> => {
    try {
      // Try reverse DNS lookup
      const response = await fetch(`https://dns.google/resolve?name=${ip}&type=PTR`);
      const data = await response.json();
      
      if (data.Answer && data.Answer.length > 0) {
        return data.Answer[0].data.replace(/\.$/, ''); // Remove trailing dot
      }
      
      // If no PTR record, return the original hostname or IP
      return originalHost !== ip ? originalHost : ip;
    } catch {
      // If reverse lookup fails, return the original hostname or IP
      return originalHost !== ip ? originalHost : ip;
    }
  };

  const simulateHop = async (targetHost: string, hopNumber: number): Promise<TracerouteHop> => {
    const start = performance.now();
    const timeout = hopNumber * 1000; // Increase timeout for each hop
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`https://${targetHost}`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const end = performance.now();
      
      // Resolve IP and FQDN
      const ip = await resolveIP(targetHost);
      const fqdn = await getFQDN(ip, targetHost);
      
      return {
        hop: hopNumber,
        host: targetHost,
        ip,
        fqdn,
        time: Math.round(end - start),
        status: 'success'
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // For timeout, still try to resolve IP and FQDN
        const ip = await resolveIP(targetHost);
        const fqdn = await getFQDN(ip, targetHost);
        
        return {
          hop: hopNumber,
          host: targetHost,
          ip,
          fqdn,
          time: timeout,
          status: 'timeout'
        };
      }
      
      // For other errors, still try to resolve IP and FQDN
      const ip = await resolveIP(targetHost);
      const fqdn = await getFQDN(ip, targetHost);
      
      return {
        hop: hopNumber,
        host: targetHost,
        ip,
        fqdn,
        time: 0,
        status: 'error'
      };
    }
  };

  const runTraceroute = async () => {
    setLoading(true);
    setResults([]);
    
    const newResults: TracerouteHop[] = [];
    
    // Simulate traceroute by testing with different timeout values
    // This is a simplified version that simulates the concept
    for (let hop = 1; hop <= maxHops; hop++) {
      const result = await simulateHop(host, hop);
      newResults.push(result);
      setResults([...newResults]); // Update results after each hop
      
      // If we reach the destination, stop
      if (result.status === 'success' && hop > 1) {
        break;
      }
      
      // Small delay between hops
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setLoading(false);
  };

  const getTotalTime = () => {
    const successfulHops = results.filter(r => r.status === 'success');
    if (successfulHops.length === 0) return 0;
    return successfulHops.reduce((sum, r) => sum + r.time, 0);
  };

  const getHopsReached = () => {
    return results.filter(r => r.status === 'success').length;
  };

  const getStatusBadge = () => {
    const successfulHops = results.filter(r => r.status === 'success').length;
    if (successfulHops === 0) return <Badge variant="danger">Failed</Badge>;
    if (successfulHops >= maxHops) return <Badge variant="success">Complete</Badge>;
    return <Badge variant="warning">Partial</Badge>;
  };

  const formatTime = (time: number) => {
    if (time === 0) return '--';
    return `${time}ms`;
  };

  const getHopStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'timeout': return '⏱️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const isIPAddress = (str: string): boolean => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(str);
  };

  return (
    <Card title="Traceroute Test" subtitle="Trace the network path to a host">
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
              Max Hops
            </label>
            <select
              value={maxHops}
              onChange={(e) => setMaxHops(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10 hops</option>
              <option value={15}>15 hops</option>
              <option value={20}>20 hops</option>
              <option value={30}>30 hops</option>
            </select>
          </div>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <Button
            onClick={runTraceroute}
            loading={loading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? "Tracing..." : `Trace Route to ${host}`}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getHopsReached()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hops Reached</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(getTotalTime())}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Hops</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center">
                  {getStatusBadge()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Status</div>
              </div>
            </div>

            {/* Traceroute Results */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Route Path
              </h4>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem]">
                        {result.hop}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {result.fqdn}
                        </span>
                        {result.ip !== result.fqdn && (
                          <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                            {result.ip}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatTime(result.time)}
                      </span>
                      <span className="text-lg">
                        {getHopStatusIcon(result.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Legend</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Display Format</div>
                  <div>• <strong>FQDN:</strong> Fully Qualified Domain Name</div>
                  <div>• <strong>IP:</strong> Resolved IP address (shown below FQDN)</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-1">Status Icons</div>
                  <div>• ✅ Success: Hop responded successfully</div>
                  <div>• ⏱️ Timeout: Hop timed out</div>
                  <div>• ❌ Error: Hop failed to respond</div>
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                About This Traceroute
              </h5>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• <strong>Hop Number:</strong> Each step in the network path</p>
                <p>• <strong>FQDN:</strong> Human-readable domain name for each hop</p>
                <p>• <strong>IP Address:</strong> Numerical IP address (shown when different from FQDN)</p>
                <p>• <strong>Response Time:</strong> Time to reach each hop</p>
                <p>• <strong>Status Icons:</strong> Visual indicators for hop status</p>
                <p className="mt-2 text-xs">
                  Note: This is a simulated traceroute using HTTP requests. Real traceroute uses ICMP packets and shows actual network hops.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 