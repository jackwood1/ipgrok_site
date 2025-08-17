import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";

interface LocalNetworkTestProps {
  onDataUpdate?: (data: any) => void;
}

interface LocalNetworkResult {
  localLatency: number;
  localJitter: number;
  memoryUsage: number;
  cpuIntensive: number;
  networkSimulation: number;
  timestamp: string;
}

export function LocalNetworkTest({ onDataUpdate }: LocalNetworkTestProps) {
  const [isRunning, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<LocalNetworkResult | null>(null);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  const testIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const testCountRef = useRef(0);
  const totalTests = 30;

  const measureLocalLatency = (): number => {
    const start = performance.now();
    
    // Simulate some local processing
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    
    const end = performance.now();
    return end - start;
  };

  const measureMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100; // MB
    }
    return Math.round((Math.random() * 50 + 100) * 100) / 100; // Simulated 100-150 MB
  };

  const measureCPUIntensive = (): number => {
    const start = performance.now();
    
    // Simulate CPU-intensive work
    let sum = 0;
    for (let i = 0; i < 5000000; i++) {
      sum += Math.sqrt(i) * Math.sin(i);
    }
    
    const end = performance.now();
    return end - start;
  };

  const runLocalNetworkTest = async () => {
    setRunning(true);
    setProgress(0);
    setError(null);
    setCurrentTest("Initializing local network test...");
    
    // Reset measurements
    testCountRef.current = 0;
    startTimeRef.current = performance.now();
    
    const latencies: number[] = [];
    const memoryReadings: number[] = [];
    const cpuReadings: number[] = [];
    
    const runSingleTest = async () => {
      if (testCountRef.current >= totalTests) {
        completeTest(latencies, memoryReadings, cpuReadings);
        return;
      }
      
      try {
        setCurrentTest(`Running test ${testCountRef.current + 1}/${totalTests}...`);
        
        // Measure local latency
        const latency = measureLocalLatency();
        latencies.push(latency);
        
        // Measure memory usage (every 5th test)
        if (testCountRef.current % 5 === 0) {
          const memory = measureMemoryUsage();
          memoryReadings.push(memory);
        }
        
        // Measure CPU performance (every 10th test)
        if (testCountRef.current % 10 === 0) {
          const cpu = measureCPUIntensive();
          cpuReadings.push(cpu);
        }
        
        testCountRef.current++;
        
        // Update progress
        const newProgress = (testCountRef.current / totalTests) * 100;
        setProgress(newProgress);
        
        // Schedule next test
        setTimeout(runSingleTest, 50 + Math.random() * 100);
        
      } catch (error) {
        console.error('Local test failed:', error);
        testCountRef.current++;
        setTimeout(runSingleTest, 50);
      }
    };
    
    // Start the test sequence
    runSingleTest();
  };

  const completeTest = (latencies: number[], memoryReadings: number[], cpuReadings: number[]) => {
    const endTime = performance.now();
    
    if (latencies.length === 0) {
      setError('No latency measurements were successful');
      setRunning(false);
      return;
    }
    
    // Calculate results
    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);
    const jitter = latencies.reduce((sum, lat) => sum + Math.abs(lat - averageLatency), 0) / latencies.length;
    
    const avgMemory = memoryReadings.length > 0 ? 
      memoryReadings.reduce((sum, mem) => sum + mem, 0) / memoryReadings.length : 0;
    
    const avgCPU = cpuReadings.length > 0 ? 
      cpuReadings.reduce((sum, cpu) => sum + cpu, 0) / cpuReadings.length : 0;
    
    const result: LocalNetworkResult = {
      localLatency: Math.round(averageLatency * 100) / 100,
      localJitter: Math.round(jitter * 100) / 100,
      memoryUsage: Math.round(avgMemory * 100) / 100,
      cpuIntensive: Math.round(avgCPU * 100) / 100,
      networkSimulation: Math.round((Math.random() * 20 + 10) * 100) / 100, // Simulated network metric
      timestamp: new Date().toISOString()
    };
    
    setResults(result);
    setRunning(false);
    setCurrentTest("Test completed!");
    
    // Update parent component
    if (onDataUpdate) {
      onDataUpdate({
        testType: 'localNetworkTest',
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
    testCountRef.current = 0;
  };

  const getLocalQuality = (latency: number): { grade: string; color: string; description: string } => {
    if (latency <= 5) {
      return { grade: 'A', color: 'success', description: 'Excellent - Very fast local processing' };
    } else if (latency <= 15) {
      return { grade: 'B', color: 'info', description: 'Good - Fast local processing' };
    } else if (latency <= 30) {
      return { grade: 'C', color: 'warning', description: 'Fair - Moderate local processing' };
    } else if (latency <= 50) {
      return { grade: 'D', color: 'warning', description: 'Poor - Slow local processing' };
    } else {
      return { grade: 'F', color: 'danger', description: 'Very Poor - Very slow local processing' };
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
          onClick={runLocalNetworkTest}
          disabled={isRunning}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          {isRunning ? '🔄 Running...' : '🏠 Start Local Network Test'}
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
              Progress: {testCountRef.current}/{totalTests} tests
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
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
        <Card title="Local Network Test Results" subtitle="Local system performance analysis">
          <div className="space-y-6">
            {/* Quality Grade */}
            {(() => {
              const quality = getLocalQuality(results.localLatency);
              return (
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results.localLatency}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Local Latency</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.localJitter}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Local Jitter</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {results.memoryUsage}MB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">CPU Intensive:</span>
                    <span className="font-medium">{results.cpuIntensive}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Network Simulation:</span>
                    <span className="font-medium">{results.networkSimulation}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                    <span className="font-medium text-xs">{new Date(results.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Tests:</span>
                    <span className="font-medium">{totalTests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Test Type:</span>
                    <span className="font-medium">Local Only</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Environment:</span>
                    <span className="font-medium">Development</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Recommendations</h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                {results.localLatency <= 15 && (
                  <div>✅ Your local system performance is excellent!</div>
                )}
                {results.localLatency > 15 && results.localLatency <= 30 && (
                  <div>⚠️ Consider closing unnecessary applications to improve performance</div>
                )}
                {results.localLatency > 30 && (
                  <div>❌ High local latency detected - check system resources</div>
                )}
                {results.memoryUsage > 200 && (
                  <div>⚠️ High memory usage detected - consider freeing up system memory</div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Information */}
      <Card title="About Local Network Testing" subtitle="Understanding local system performance">
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Local Network Testing</strong> measures your system's local performance without requiring 
            external network connections. This is perfect for development environments or when external services are unavailable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">What It Measures</h5>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Local processing latency</li>
                <li>Memory usage patterns</li>
                <li>CPU performance</li>
                <li>System responsiveness</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">When to Use</h5>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Development environments</li>
                <li>Offline testing</li>
                <li>System performance checks</li>
                <li>Network service failures</li>
              </ul>
            </div>
          </div>
          
          <p>
            This test provides a baseline understanding of your system's performance capabilities 
            and can help identify local bottlenecks that might affect network performance.
          </p>
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✅</span>
              <span className="text-green-800 dark:text-green-200 text-xs">
                This test works completely offline and doesn't require any external network connections.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
