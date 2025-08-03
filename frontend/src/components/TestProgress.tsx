import { Card, Badge } from "./ui";

interface TestProgressProps {
  completedTests: {
    quickTest: boolean;
    networkTest: boolean;
    mediaTest: boolean;
    advancedTests: boolean;
    configInfo: boolean;
  };
  currentTest?: string;
  onTestClick: (testName: string) => void;
}

export function TestProgress({ completedTests, currentTest, onTestClick }: TestProgressProps) {
  const tests = [
    {
      id: 'quickTest',
      name: 'Quick Test',
      description: 'Basic network and media assessment',
      icon: '🚀',
      duration: '30 seconds',
      required: true
    },
    {
      id: 'networkTest',
      name: 'Network Tests',
      description: 'Speed, ping, traceroute, and advanced diagnostics',
      icon: '🌐',
      duration: '1-2 minutes',
      required: false
    },
    {
      id: 'mediaTest',
      name: 'Media Tests',
      description: 'Camera, microphone, and video quality analysis',
      icon: '📹',
      duration: '1-2 minutes',
      required: false
    },
    {
      id: 'advancedTests',
      name: 'Advanced Tests',
      description: 'DNS, CDN, VPN detection, and security analysis',
      icon: '🔬',
      duration: '30-60 seconds',
      required: false
    },
    {
      id: 'configInfo',
      name: 'System Info',
      description: 'Device and browser configuration details',
      icon: '⚙️',
      duration: 'Instant',
      required: false
    }
  ];

  const completedCount = Object.values(completedTests).filter(Boolean).length;
  const totalTests = tests.length;
  const progressPercentage = (completedCount / totalTests) * 100;

  return (
    <Card title="Test Progress" subtitle={`${completedCount}/${totalTests} tests completed`}>
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Test List */}
        <div className="space-y-3">
          {tests.map((test) => {
            const isCompleted = completedTests[test.id as keyof typeof completedTests];
            const isCurrent = currentTest === test.id;
            
            return (
              <div
                key={test.id}
                onClick={() => onTestClick(test.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{test.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {test.name}
                        </h4>
                        {test.required && (
                          <Badge variant="warning" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="success" className="text-xs">
                            ✅ Complete
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="info" className="text-xs">
                            🔄 Running
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {test.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Duration: {test.duration}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted && (
                      <div className="text-green-600 dark:text-green-400 text-2xl">✓</div>
                    )}
                    {isCurrent && (
                      <div className="text-blue-600 dark:text-blue-400 text-2xl animate-pulse">⟳</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {completedCount > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Next Steps
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {completedCount === 1 && (
                <p>Great start! Run more tests to get a complete picture of your internet performance.</p>
              )}
              {completedCount >= 3 && (
                <p>Excellent! You have comprehensive test results. Consider sharing them or running advanced tests.</p>
              )}
              {completedCount === totalTests && (
                <p>Perfect! You've completed all tests. Share your results or export them for future reference.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 