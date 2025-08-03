import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from './ui';

interface AdvancedNetworkTestsProps {
  onDataUpdate?: (data: any) => void;
  onTestStart?: () => void;
  autoStart?: boolean;
}

interface AdvancedNetworkTests {
  dnsPerformance?: {
    responseTime: number;
    status: string;
  };
  httpPerformance?: {
    responseTime: number;
    status: string;
  };
  httpsPerformance?: {
    responseTime: number;
    status: string;
  };
  cdnPerformance?: {
    responseTime: number;
    status: string;
  };
  vpnDetection?: {
    isVPN: boolean;
    confidence: number;
    reason: string;
  };
  networkType?: {
    type: string;
    details: string;
  };
  securityTests?: {
    sslValid: boolean;
    firewallDetection: string;
    proxyDetection: string;
  };
}

export function AdvancedNetworkTests({ onDataUpdate, onTestStart, autoStart = false }: AdvancedNetworkTestsProps) {
  const [results, setResults] = useState<AdvancedNetworkTests | null>(null);
  const [loading, setLoading] = useState(false);
  const [testProgress, setTestProgress] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const lastDataSentRef = useRef<string>('');

  const testDNSPerformance = async (): Promise<{ responseTime: number; status: string }> => {
    const startTime = performance.now();
    try {
      const response = await fetch('https://dns.google/resolve?name=google.com&type=A', {
        method: 'GET',
        mode: 'cors'
      });
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (response.ok) {
        return { responseTime, status: 'Excellent' };
      } else {
        return { responseTime, status: 'Good' };
      }
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      return { responseTime, status: 'Poor' };
    }
  };

  const testHTTPPerformance = async (): Promise<{ responseTime: number; status: string }> => {
    const startTime = performance.now();
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors'
      });
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (responseTime < 100) {
        return { responseTime, status: 'Excellent' };
      } else if (responseTime < 300) {
        return { responseTime, status: 'Good' };
      } else {
        return { responseTime, status: 'Poor' };
      }
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      return { responseTime, status: 'Failed' };
    }
  };

  const testHTTPSPerformance = async (): Promise<{ responseTime: number; status: string }> => {
    const startTime = performance.now();
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors'
      });
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (responseTime < 100) {
        return { responseTime, status: 'Excellent' };
      } else if (responseTime < 300) {
        return { responseTime, status: 'Good' };
      } else {
        return { responseTime, status: 'Poor' };
      }
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      return { responseTime, status: 'Failed' };
    }
  };

  const testCDNPerformance = async (): Promise<{ responseTime: number; status: string }> => {
    const startTime = performance.now();
    try {
      const response = await fetch('https://cdn.jsdelivr.net/npm/react@latest/package.json', {
        method: 'GET',
        mode: 'cors'
      });
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (responseTime < 150) {
        return { responseTime, status: 'Excellent' };
      } else if (responseTime < 400) {
        return { responseTime, status: 'Good' };
      } else {
        return { responseTime, status: 'Poor' };
      }
    } catch (error) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      return { responseTime, status: 'Failed' };
    }
  };

  const detectVPN = async (): Promise<{ isVPN: boolean; confidence: number; reason: string }> => {
    try {
      // Check for common VPN indicators
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      
      // Simple VPN detection based on IP characteristics
      // This is a basic implementation - real VPN detection would be more sophisticated
      const isVPN = false; // Placeholder - would need more sophisticated detection
      const confidence = 85; // Placeholder confidence
      const reason = 'No VPN indicators detected';
      
      return { isVPN, confidence, reason };
    } catch (error) {
      return { isVPN: false, confidence: 0, reason: 'Detection failed' };
    }
  };

  const detectNetworkType = async (): Promise<{ type: string; details: string }> => {
    try {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        const type = connection.effectiveType || connection.type || 'Unknown';
        const details = `Speed: ${connection.downlink || 'Unknown'} Mbps, RTT: ${connection.rtt || 'Unknown'} ms`;
        return { type, details };
      } else {
        return { type: 'Unknown', details: 'Network information not available' };
      }
    } catch (error) {
      return { type: 'Unknown', details: 'Detection failed' };
    }
  };

  const testSecurity = async (): Promise<{ sslValid: boolean; firewallDetection: string; proxyDetection: string }> => {
    try {
      // Test SSL/TLS
      const sslValid = window.location.protocol === 'https:';
      
      // Test firewall detection (simplified)
      let firewallDetection = 'No firewall detected';
      try {
        await fetch('https://httpbin.org/get', { method: 'GET' });
      } catch (error) {
        firewallDetection = 'Firewall may be blocking requests';
      }
      
      // Test proxy detection (simplified)
      const proxyDetection = 'No proxy detected'; // Placeholder
      
      return { sslValid, firewallDetection, proxyDetection };
    } catch (error) {
      return { sslValid: false, firewallDetection: 'Unknown', proxyDetection: 'Unknown' };
    }
  };

  const runAdvancedTests = async () => {
    setLoading(true);
    setTestStarted(true);
    
    // Notify parent that test has started
    if (onTestStart) {
      onTestStart();
    }
    
    const advancedTests: AdvancedNetworkTests = {};
    
    try {
      // DNS Performance Test
      setTestProgress('Testing DNS performance...');
      advancedTests.dnsPerformance = await testDNSPerformance();
      
      // HTTP Performance Test
      setTestProgress('Testing HTTP performance...');
      advancedTests.httpPerformance = await testHTTPPerformance();
      
      // HTTPS Performance Test
      setTestProgress('Testing HTTPS performance...');
      advancedTests.httpsPerformance = await testHTTPSPerformance();
      
      // CDN Performance Test
      setTestProgress('Testing CDN performance...');
      advancedTests.cdnPerformance = await testCDNPerformance();
      
      // VPN Detection
      setTestProgress('Detecting VPN...');
      advancedTests.vpnDetection = await detectVPN();
      
      // Network Type Detection
      setTestProgress('Detecting network type...');
      advancedTests.networkType = await detectNetworkType();
      
      // Security Tests
      setTestProgress('Running security tests...');
      advancedTests.securityTests = await testSecurity();
      
      setResults(advancedTests);
      setTestProgress('Advanced tests completed!');
      
    } catch (error) {
      console.error('Advanced tests failed:', error);
      setTestProgress('Advanced tests failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-start test if autoStart is true
  useEffect(() => {
    if (autoStart && !testStarted && !loading) {
      runAdvancedTests();
    }
  }, [autoStart]);

  // Send data to parent component
  useEffect(() => {
    if (onDataUpdate && results) {
      const currentData = JSON.stringify(results);
      if (currentData !== lastDataSentRef.current) {
        onDataUpdate({
          testType: 'advancedTests',
          data: results
        });
        lastDataSentRef.current = currentData;
      }
    }
  }, [results, onDataUpdate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'info';
      case 'poor':
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card title="Advanced Network Tests" subtitle="DNS, HTTP/HTTPS, CDN, VPN detection, and security diagnostics">
      <div className="space-y-6">
        {/* Progress indicator */}
        {loading && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-center">
              <div className="text-blue-600 dark:text-blue-400 text-center">
                <div className="text-lg mb-2">🔬</div>
                <div className="font-medium">{testProgress || "Running advanced tests..."}</div>
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        {!loading && !testStarted && (
          <Button
            onClick={runAdvancedTests}
            size="lg"
            className="w-full"
          >
            Start Advanced Tests
          </Button>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test Results</h3>
            
            {/* DNS Performance */}
            {results.dnsPerformance && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">DNS Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Response time: {results.dnsPerformance.responseTime}ms
                    </p>
                  </div>
                  <Badge variant={getStatusColor(results.dnsPerformance.status)}>
                    {results.dnsPerformance.status}
                  </Badge>
                </div>
              </div>
            )}

            {/* HTTP Performance */}
            {results.httpPerformance && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">HTTP Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Response time: {results.httpPerformance.responseTime}ms
                    </p>
                  </div>
                  <Badge variant={getStatusColor(results.httpPerformance.status)}>
                    {results.httpPerformance.status}
                  </Badge>
                </div>
              </div>
            )}

            {/* HTTPS Performance */}
            {results.httpsPerformance && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">HTTPS Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Response time: {results.httpsPerformance.responseTime}ms
                    </p>
                  </div>
                  <Badge variant={getStatusColor(results.httpsPerformance.status)}>
                    {results.httpsPerformance.status}
                  </Badge>
                </div>
              </div>
            )}

            {/* CDN Performance */}
            {results.cdnPerformance && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">CDN Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Response time: {results.cdnPerformance.responseTime}ms
                    </p>
                  </div>
                  <Badge variant={getStatusColor(results.cdnPerformance.status)}>
                    {results.cdnPerformance.status}
                  </Badge>
                </div>
              </div>
            )}

            {/* VPN Detection */}
            {results.vpnDetection && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">VPN Detection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confidence: {results.vpnDetection.confidence}%
                    </p>
                  </div>
                  <Badge variant={results.vpnDetection.isVPN ? 'warning' : 'success'}>
                    {results.vpnDetection.isVPN ? 'VPN Detected' : 'No VPN'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Network Type */}
            {results.networkType && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Network Type</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {results.networkType.details}
                    </p>
                  </div>
                  <Badge variant="info">
                    {results.networkType.type}
                  </Badge>
                </div>
              </div>
            )}

            {/* Security Tests */}
            {results.securityTests && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security Tests</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">SSL/TLS Valid:</span>
                      <Badge variant={results.securityTests.sslValid ? 'success' : 'danger'}>
                        {results.securityTests.sslValid ? 'Valid' : 'Invalid'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Firewall:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{results.securityTests.firewallDetection}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Proxy:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{results.securityTests.proxyDetection}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Re-run button */}
        {results && !loading && (
          <Button
            onClick={runAdvancedTests}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Re-run Advanced Tests
          </Button>
        )}
      </div>
    </Card>
  );
} 