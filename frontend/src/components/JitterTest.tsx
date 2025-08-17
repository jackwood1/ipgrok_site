import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";

interface JitterTestProps {
  onDataUpdate?: (data: any) => void;
}

interface JitterResult {
  averageLatency: number;
  jitter: number;
  minLatency: number;
  maxLatency: number;
  standardDeviation: number;
  packetCount: number;
  successRate: number;
  timestamp: string;
}

export function JitterTest({ onDataUpdate }: JitterTestProps) {
  const [isRunning, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<JitterResult | null>(null);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const testIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const latencyMeasurementsRef = useRef<number[]>([]);
  const testCountRef = useRef(0);
  const totalTests = 50; // Number of latency measurements to take

  const measureLatency = async (): Promise<number> => {
    const start = performance.now();
    
    try {
      // Use a reliable external service for latency measurement
      const response = await fetch('https://httpbin.org/delay/0.1', {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const end = performance.now();
      return end - start;
    } catch (error) {
      // Fallback: measure against multiple services
      const services = [
        'https://httpbin.org/status/200',
        'https://jsonplaceholder.typicode.com/posts/1',
        'https://api.github.com/zen'
      ];
      
      for (const service of services) {
        try {
          const start = performance.now();
          const response = await fetch(service, {
            method: 'GET',
            signal: AbortSignal.timeout(3000),
          });
          
          if (response.ok) {
            const end = performance.now();
            return end - start;
          }
        } catch {
          continue;
        }
      }
      
      throw new Error('All latency measurement services failed');
    }
  };

  const calculateJitter = (latencies: number[]): number => {
    if (latencies.length < 2) return 0;
    
    // Calculate average latency
    const avg = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    
    // Calculate jitter as the average absolute difference from the mean
    const differences = latencies.map(lat => Math.abs(lat - avg));
    return differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
  };

  const calculateStandardDeviation = (latencies: number[]): number => {
    if (latencies.length < 2) return 0;
    
    const avg = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const squaredDiffs = latencies.map(lat => Math.pow(lat - avg, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / (latencies.length - 1);
    
    return Math.sqrt(variance);
  };

  const runJitterTest = async () => {
    setRunning(true);
    setProgress(0);
    setError(null);
    setCurrentTest("Initializing jitter test...");
    
    // Reset measurements
    latencyMeasurementsRef.current = [];
    testCountRef.current = 0;
    startTimeRef.current = performance.now();
    
    const runSingleTest = async () => {
      if (testCountRef.current >= totalTests) {
        completeTest();
        return;
      }
      
      try {
        setCurrentTest(`Measuring latency ${testCountRef.current + 1}/${totalTests}...`);
        
        const latency = await measureLatency();
        latencyMeasurementsRef.current.push(latency);
        testCountRef.current++;
        
        // Update progress
        const newProgress = (testCountRef.current / totalTests) * 100;
        setProgress(newProgress);
        
        // Schedule next test with a small delay to simulate real network conditions
        setTimeout(runSingleTest, 100 + Math.random() * 200);
        
      } catch (error) {
        console.error('Latency measurement failed:', error);
        // Continue with next test even if one fails
        testCountRef.current++;
        setTimeout(runSingleTest, 100);
      }
    };
    
    // Start the test sequence
    runSingleTest();
  };

  const completeTest = () => {
    const latencies = latencyMeasurementsRef.current;
    const endTime = performance.now();
    const totalTime = endTime - startTimeRef.current;
    
    if (latencies.length === 0) {
      setError('No latency measurements were successful');
      setRunning(false);
      return;
    }
    
    // Calculate results
    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);
    const jitter = calculateJitter(latencies);
    const standardDeviation = calculateStandardDeviation(latencies);
    const successRate = (latencies.length / totalTests) * 100;
    
    const result: JitterResult = {
      averageLatency: Math.round(averageLatency * 100) / 100,
      jitter: Math.round(jitter * 100) / 100,
      minLatency: Math.round(minLatency * 100) / 100,
      maxLatency: Math.round(maxLatency * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      packetCount: latencies.length,
      successRate: Math.round(successRate * 100) / 100,
      timestamp: new Date().toISOString()
    };
    
    setResults(result);
    setRunning(false);
    setCurrentTest("Test completed!");
    
    // Update parent component
    if (onDataUpdate) {
      onDataUpdate({
        testType: 'jitterTest',
        data: result
      });
    }
  };

  const stopTest = () => {
    if (testIntervalRef.current) {
      clearTimeout(testIntervalRef.current);
    }
    setRunning(false);
    setCurrentTest("Test stopped");
  };

  const resetTest = () => {
    setResults(null);
    setProgress(0);
    setError(null);
    setCurrentTest("");
    latencyMeasurementsRef.current = [];
    testCountRef.current = 0;
  };

  const getJitterQuality = (jitter: number): { grade: string; color: string; description: string } => {
    if (jitter <= 5) {
      return { grade: 'A', color: 'success', description: 'Excellent - Very stable connection' };
    } else if (jitter <= 15) {
      return { grade: 'B', color: 'info', description: 'Good - Stable connection' };
    } else if (jitter <= 30) {
      return { grade: 'C', color: 'warning', description: 'Fair - Some variation' };
    } else if (jitter <= 50) {
      return { grade: 'D', color: 'warning', description: 'Poor - High variation' };
    } else {
      return { grade: 'F', color: 'danger', description: 'Very Poor - Unstable connection' };
    }
  };

  useEffect(() => {
    return () => {
      if (testIntervalRef.current) {
        clearTimeout(testIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={runJitterTest}
          disabled={isRunning}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          {isRunning ? '🔄 Running...' : '🚀 Start Jitter Test'}
        </Button>
        
        {isRunning && (
          <Button
            onClick={stopTest}
            variant="danger"
            size="lg"
          >
            ⏹️ Stop Test
          </Button>
        )}
        
        <Button
          onClick={resetTest}
          variant="secondary"
          size="lg"
        >
          🔄 Reset
        </Button>
      </div>

      {/* Progress Display */}
      {isRunning && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {currentTest}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {testCountRef.current}/{totalTests} measurements
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% Complete
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-600 dark:text-red-400">❌</span>
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <Card title="Jitter Test Results" subtitle="Network stability analysis">
          <div className="space-y-6">
            {/* Quality Grade */}
            {(() => {
              const quality = getJitterQuality(results.jitter);
              return (
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                    {quality.grade}
                  </div>
                  <Badge variant={quality.color as any} className="text-lg mb-2">
                    {quality.description}
                  </Badge>
                </div>
              );
            })()}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results.jitter}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Jitter</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.averageLatency}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {results.standardDeviation}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Std Deviation</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {results.successRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Latency Range</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Minimum:</span>
                    <span className="font-medium">{results.minLatency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Maximum:</span>
                    <span className="font-medium">{results.maxLatency}ms</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Range:</span>
                    <span className="font-medium">{results.maxLatency - results.minLatency}ms</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Tests:</span>
                    <span className="font-medium">{totalTests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Successful:</span>
                    <span className="font-medium">{results.packetCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                    <span className="font-medium text-xs">{new Date(results.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Recommendations</h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                {results.jitter <= 15 && (
                  <div>✅ Your connection is very stable - great for video calls and gaming!</div>
                )}
                {results.jitter > 15 && results.jitter <= 30 && (
                  <div>⚠️ Consider closing unnecessary applications to improve stability</div>
                )}
                {results.jitter > 30 && (
                  <div>❌ High jitter detected - check for network congestion or interference</div>
                )}
                {results.successRate < 95 && (
                  <div>⚠️ Some tests failed - check your internet connection stability</div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Information */}
      <Card title="About Jitter Testing" subtitle="Understanding network stability">
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Jitter</strong> measures the variation in latency over time. A stable connection has low jitter, 
            while an unstable connection has high jitter.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Low Jitter (≤15ms)</h5>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Excellent for video calls</li>
                <li>Great for online gaming</li>
                <li>Stable streaming</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">High Jitter (&gt;30ms)</h5>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Video call quality issues</li>
                <li>Gaming lag and stuttering</li>
                <li>Streaming buffering</li>
              </ul>
            </div>
          </div>
          
          <p>
            This test measures latency to multiple services and calculates the variation between measurements, 
            giving you a comprehensive view of your network stability.
          </p>
        </div>
      </Card>
    </div>
  );
}
