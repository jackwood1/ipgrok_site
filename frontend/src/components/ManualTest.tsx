import { useState } from "react";
import { Card, Button, Badge } from "./ui";
import { NetworkTest } from "./NetworkTest";
import { MediaTest } from "./MediaTest";
import { ConfigInfo } from "./ConfigInfo";
import { PingTest } from "./PingTest";
import { TracerouteTest } from "./TracerouteTest";

interface ManualTestProps {
  permissionsStatus: string;
  onPermissionsChange: (status: string) => void;
  onDataUpdate?: (data: any) => void;
}

interface TestStatus {
  network: 'not-started' | 'running' | 'completed' | 'failed';
  media: 'not-started' | 'running' | 'completed' | 'failed';
  system: 'not-started' | 'running' | 'completed' | 'failed';
  ping: 'not-started' | 'running' | 'completed' | 'failed';
  traceroute: 'not-started' | 'running' | 'completed' | 'failed';
}

export function ManualTest({ permissionsStatus, onPermissionsChange, onDataUpdate }: ManualTestProps) {
  const [testStatus, setTestStatus] = useState<TestStatus>({
    network: 'not-started',
    media: 'not-started',
    system: 'not-started',
    ping: 'not-started',
    traceroute: 'not-started'
  });

  const [testData, setTestData] = useState<any>({
    network: null,
    media: null,
    system: null,
    ping: null,
    traceroute: null
  });

  const [activeTest, setActiveTest] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'info';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  const handleTestStart = (testName: keyof TestStatus) => {
    setTestStatus(prev => ({ ...prev, [testName]: 'running' }));
    setActiveTest(testName);
  };

  const handleTestComplete = (testName: keyof TestStatus, data: any) => {
    setTestStatus((prev: TestStatus) => ({ ...prev, [testName]: 'completed' }));
    setTestData((prev: any) => ({ ...prev, [testName]: data }));
    setActiveTest(null);

    // Update parent component
    if (onDataUpdate) {
      onDataUpdate({
        testType: 'manualTest',
        testName,
        data,
        allTests: testData,
        completedAt: new Date().toISOString()
      });
    }
  };

  const handleTestError = (testName: keyof TestStatus) => {
    setTestStatus(prev => ({ ...prev, [testName]: 'failed' }));
    setActiveTest(null);
  };

  const resetAllTests = () => {
    setTestStatus({
      network: 'not-started',
      media: 'not-started',
      system: 'not-started',
      ping: 'not-started',
      traceroute: 'not-started'
    });
    setTestData({
      network: null,
      media: null,
      system: null,
      ping: null,
      traceroute: null
    });
    setActiveTest(null);
  };

  const tests = [
    {
      id: 'network',
      name: 'Network Speed Test',
      description: 'Download, upload, latency, and connection quality',
      duration: '1-2 minutes',
      icon: '🌐'
    },
    {
      id: 'media',
      name: 'Media Quality Test',
      description: 'Camera, microphone, and video recording capabilities',
      duration: '30-60 seconds',
      icon: '📹'
    },
    {
      id: 'system',
      name: 'System Information',
      description: 'Device specs, browser info, and network details',
      duration: '5-10 seconds',
      icon: '💻'
    },
    {
      id: 'ping',
      name: 'Ping Test',
      description: 'Test connectivity and response times',
      duration: '10-20 seconds',
      icon: '🏓'
    },
    {
      id: 'traceroute',
      name: 'Traceroute Test',
      description: 'Network path analysis and hop details',
      duration: '15-30 seconds',
      icon: '🛣️'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card title="Manual Test Suite" subtitle="Choose which tests to run individually">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            onClick={resetAllTests}
            variant="secondary"
            size="sm"
          >
            🔄 Reset All Tests
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <span className="mr-2">Active Test:</span>
            <Badge variant={activeTest ? 'info' : 'default'}>
              {activeTest ? tests.find(t => t.id === activeTest)?.name : 'None'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Test Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => {
          const status = testStatus[test.id as keyof TestStatus];
          const isActive = activeTest === test.id;
          const isCompleted = status === 'completed';
          const isRunning = status === 'running';
          const isFailed = status === 'failed';

          return (
            <Card key={test.id} title={test.name} subtitle={test.description}>
              <div className="space-y-4">
                {/* Test Icon and Status */}
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{test.icon}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {test.duration}
                    </span>
                    <Badge variant={getStatusColor(status)}>
                      {getStatusIcon(status)} {status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Test Button */}
                <Button
                  onClick={() => handleTestStart(test.id as keyof TestStatus)}
                  disabled={isRunning || isActive}
                  variant={isCompleted ? 'success' : isFailed ? 'danger' : 'primary'}
                  className="w-full"
                  size="lg"
                >
                  {isRunning ? 'Running...' : 
                   isCompleted ? 'Completed' : 
                   isFailed ? 'Retry' : 
                   `Run ${test.name}`}
                </Button>

                {/* Test Results Preview */}
                {isCompleted && testData[test.id as keyof TestStatus] && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                      Test Results Available
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      Click to view detailed results
                    </div>
                  </div>
                )}

                {isFailed && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                      Test Failed
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">
                      Click retry to run again
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Test Component */}
      {activeTest && (
        <Card title={`Running: ${tests.find(t => t.id === activeTest)?.name}`} subtitle="Test in progress...">
          <div className="space-y-4">
            {activeTest === 'network' && (
              <NetworkTest
                permissionsStatus={permissionsStatus}
                onDataUpdate={(data) => handleTestComplete('network', data)}
                autoStart={true}
              />
            )}
            
            {activeTest === 'media' && (
              <MediaTest
                permissionsStatus={permissionsStatus}
                onPermissionsChange={onPermissionsChange}
                onDataUpdate={(data) => handleTestComplete('media', data)}
              />
            )}
            
            {activeTest === 'system' && (
              <ConfigInfo
                onDataUpdate={(data) => handleTestComplete('system', data)}
              />
            )}
            
            {activeTest === 'ping' && (
              <PingTest
                onDataUpdate={(data) => handleTestComplete('ping', data)}
              />
            )}
            
            {activeTest === 'traceroute' && (
              <TracerouteTest
                onDataUpdate={(data) => handleTestComplete('traceroute', data)}
              />
            )}
          </div>
        </Card>
      )}

      {/* Summary */}
      {Object.values(testStatus).some(status => status === 'completed') && (
        <Card title="Test Summary" subtitle="Overview of completed tests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {tests.map((test) => {
              const status = testStatus[test.id as keyof TestStatus];
              const isCompleted = status === 'completed';
              
              if (!isCompleted) return null;
              
              return (
                <div key={test.id} className="text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                  <div className="text-2xl mb-2">{test.icon}</div>
                  <div className="text-sm font-medium text-green-900 dark:text-green-100">
                    {test.name}
                  </div>
                  <Badge variant="success" className="mt-2">
                    ✅ Complete
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
} 