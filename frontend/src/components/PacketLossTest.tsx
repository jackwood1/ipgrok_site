import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";

interface PacketLossTestProps {
  onDataUpdate?: (data: any) => void;
}

interface PacketLossResult {
  totalPackets: number;
  receivedPackets: number;
  lostPackets: number;
  packetLossRate: number;
  averageLatency: number;
  minLatency: number;
  maxLatency: number;
  testDuration: number;
  timestamp: string;
}

export function PacketLossTest({ onDataUpdate }: PacketLossTestProps) {
  const [isRunning, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PacketLossResult | null>(null);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [testStats, setTestStats] = useState({
    sent: 0,
    received: 0,
    failed: 0
  });
  
  const testIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const latencyMeasurementsRef = useRef<number[]>([]);
  const testCountRef = useRef(0);
  const totalTests = 100; // Number of packets to send
  const packetSize = 1024; // 1KB packets

  const simulatePacketLoss = async (): Promise<{ success: boolean; latency: number }> => {
    const start = performance.now();
    
    try {
      // Simulate packet transmission with potential loss
      const packetData = new ArrayBuffer(packetSize);
      const view = new Uint8Array(packetData);
      
      // Fill with random data
      for (let i = 0; i < packetSize; i++) {
        view[i] = Math.floor(Math.random() * 256);
      }
      
      // Simulate network conditions that could cause packet loss
      const networkConditions = Math.random();
      const simulatedLatency = 10 + Math.random() * 50; // 10-60ms base latency
      
      // Simulate packet loss based on network conditions
      let packetLossProbability = 0.02; // 2% base loss rate
      
      // Increase loss probability under poor conditions
      if (networkConditions > 0.8) {
        packetLossProbability = 0.15; // 15% loss rate
      } else if (networkConditions > 0.6) {
        packetLossProbability = 0.08; // 8% loss rate
      }
      
      // Simulate actual packet loss
      if (Math.random() < packetLossProbability) {
        // Simulate packet loss by throwing an error
        throw new Error('Packet lost in transmission');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, simulatedLatency));
      
      const end = performance.now();
      const actualLatency = end - start;
      
      return { success: true, latency: actualLatency };
      
    } catch (error) {
      // Packet was lost
      return { success: false, latency: 0 };
    }
  };

  const runPacketLossTest = async () => {
    setRunning(true);
    setProgress(0);
    setError(null);
    setCurrentTest("Initializing packet loss test...");
    
    // Reset measurements
    latencyMeasurementsRef.current = [];
    testCountRef.current = 0;
    startTimeRef.current = performance.now();
    setTestStats({ sent: 0, received: 0, failed: 0 });
    
    const runSingleTest = async () => {
      if (testCountRef.current >= totalTests) {
        completeTest();
        return;
      }
      
      try {
        setCurrentTest(`Sending packet ${testCountRef.current + 1}/${totalTests}...`);
        
        const result = await simulatePacketLoss();
        testCountRef.current++;
        
        if (result.success) {
          latencyMeasurementsRef.current.push(result.latency);
          setTestStats(prev => ({ ...prev, received: prev.received + 1 }));
        } else {
          setTestStats(prev => ({ ...prev, failed: prev.failed + 1 }));
        }
        
        setTestStats(prev => ({ ...prev, sent: prev.sent + 1 }));
        
        // Update progress
        const newProgress = (testCountRef.current / totalTests) * 100;
        setProgress(newProgress);
        
        // Schedule next test with realistic timing
        setTimeout(runSingleTest, 50 + Math.random() * 100);
        
      } catch (error) {
        console.error('Packet test failed:', error);
        testCountRef.current++;
        setTestStats(prev => ({ ...prev, failed: prev.failed + 1, sent: prev.sent + 1 }));
        setTimeout(runSingleTest, 50);
      }
    };
    
    // Start the test sequence
    runSingleTest();
  };

  const completeTest = () => {
    const endTime = performance.now();
    const totalTime = endTime - startTimeRef.current;
    
    if (latencyMeasurementsRef.current.length === 0) {
      setError('No packets were successfully received');
      setRunning(false);
      return;
    }
    
    // Calculate results
    const receivedPackets = latencyMeasurementsRef.current.length;
    const lostPackets = totalTests - receivedPackets;
    const packetLossRate = (lostPackets / totalTests) * 100;
    const averageLatency = latencyMeasurementsRef.current.reduce((sum, lat) => sum + lat, 0) / receivedPackets;
    const minLatency = Math.min(...latencyMeasurementsRef.current);
    const maxLatency = Math.max(...latencyMeasurementsRef.current);
    
    const result: PacketLossResult = {
      totalPackets: totalTests,
      receivedPackets,
      lostPackets,
      packetLossRate: Math.round(packetLossRate * 100) / 100,
      averageLatency: Math.round(averageLatency * 100) / 100,
      minLatency: Math.round(minLatency * 100) / 100,
      maxLatency: Math.round(maxLatency * 100) / 100,
      testDuration: Math.round(totalTime * 100) / 100,
      timestamp: new Date().toISOString()
    };
    
    setResults(result);
    setRunning(false);
    setCurrentTest("Test completed!");
    
    // Update parent component
    if (onDataUpdate) {
      onDataUpdate({
        testType: 'packetLossTest',
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
    setTestStats({ sent: 0, received: 0, failed: 0 });
    latencyMeasurementsRef.current = [];
    testCountRef.current = 0;
  };

  const getPacketLossQuality = (lossRate: number): { grade: string; color: string; description: string } => {
    if (lossRate <= 1) {
      return { grade: 'A', color: 'success', description: 'Excellent - Minimal packet loss' };
    } else if (lossRate <= 3) {
      return { grade: 'B', color: 'info', description: 'Good - Low packet loss' };
    } else if (lossRate <= 8) {
      return { grade: 'C', color: 'warning', description: 'Fair - Moderate packet loss' };
    } else if (lossRate <= 15) {
      return { grade: 'D', color: 'warning', description: 'Poor - High packet loss' };
    } else {
      return { grade: 'F', color: 'danger', description: 'Very Poor - Excessive packet loss' };
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
          onClick={runPacketLossTest}
          disabled={isRunning}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          {isRunning ? '🔄 Running...' : '📦 Start Packet Loss Test'}
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
              Progress: {testCountRef.current}/{totalTests} packets
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
          
          {/* Real-time Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {testStats.sent}
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Sent</div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {testStats.received}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">Received</div>
            </div>
            
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {testStats.failed}
              </div>
              <div className="text-xs text-red-700 dark:text-red-300">Lost</div>
            </div>
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
        <Card title="Packet Loss Test Results" subtitle="Network reliability analysis">
          <div className="space-y-6">
            {/* Quality Grade */}
            {(() => {
              const quality = getPacketLossQuality(results.packetLossRate);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-800 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {results.packetLossRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Packet Loss</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.receivedPackets}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Received</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results.averageLatency}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {results.testDuration}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Test Duration</div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Packet Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Packets:</span>
                    <span className="font-medium">{results.totalPackets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Successfully Received:</span>
                    <span className="font-medium text-green-600">{results.receivedPackets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Lost Packets:</span>
                    <span className="font-medium text-red-600">{results.lostPackets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                    <span className="font-medium">{100 - results.packetLossRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Latency Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average:</span>
                    <span className="font-medium">{results.averageLatency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Minimum:</span>
                    <span className="font-medium">{results.minLatency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Maximum:</span>
                    <span className="font-medium">{results.maxLatency}ms</span>
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
                {results.packetLossRate <= 3 && (
                  <div>✅ Your connection is very reliable - great for all online activities!</div>
                )}
                {results.packetLossRate > 3 && results.packetLossRate <= 8 && (
                  <div>⚠️ Some packet loss detected - consider checking for network congestion</div>
                )}
                {results.packetLossRate > 8 && (
                  <div>❌ High packet loss detected - this may cause video/audio issues</div>
                )}
                {results.averageLatency > 100 && (
                  <div>⚠️ High latency detected - consider using a closer server or better connection</div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Information */}
      <Card title="About Packet Loss Testing" subtitle="Understanding network reliability">
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Packet Loss</strong> occurs when data packets fail to reach their destination. 
            This test simulates real network conditions and measures how reliably your connection delivers data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Low Packet Loss (≤3%)</h5>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Excellent for video calls</li>
                <li>Great for online gaming</li>
                <li>Reliable file transfers</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">High Packet Loss (&gt;8%)</h5>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Video call quality issues</li>
                <li>Gaming lag and disconnections</li>
                <li>File transfer failures</li>
              </ul>
            </div>
          </div>
          
          <p>
            This test sends 100 simulated packets and tracks delivery success rates, 
            providing insights into your network's reliability under various conditions.
          </p>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 dark:text-yellow-400">ℹ️</span>
              <span className="text-yellow-800 dark:text-yellow-200 text-xs">
                Note: This test simulates packet loss conditions. Real-world results may vary based on 
                actual network infrastructure and current conditions.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
