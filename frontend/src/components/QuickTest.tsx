import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";
import { NetworkTest } from "./NetworkTest";
import { ConfigInfo } from "./ConfigInfo";

interface QuickTestProps {
  permissionsStatus: string;
  onPermissionsChange: (status: string) => void;
  onDataUpdate?: (data: any) => void;
}

export function QuickTest({ permissionsStatus, onPermissionsChange, onDataUpdate }: QuickTestProps) {
  const [currentStep, setCurrentStep] = useState<'network' | 'system' | 'complete'>('network');
  const [networkData, setNetworkData] = useState<any>(null);
  const [systemData, setSystemData] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Update parent component when all tests complete
  useEffect(() => {
    if (networkData && systemData && onDataUpdate) {
      onDataUpdate({
        networkData,
        systemData,
        testType: 'quickTest',
        completedAt: new Date().toISOString()
      });
    }
  }, [networkData, systemData, onDataUpdate]);

  // Handle network test completion
  const handleNetworkComplete = (data: any) => {
    setNetworkData(data);
    setCurrentStep('system');
  };

  // Handle system info completion
  const handleSystemComplete = (data: any) => {
    setSystemData(data);
    setCurrentStep('complete');
  };

  // Start the quick test sequence
  const startQuickTest = () => {
    setIsRunning(true);
    setCurrentStep('network');
    setNetworkData(null);
    setSystemData(null);
  };

  const getStepStatus = (step: 'network' | 'system' | 'complete') => {
    if (step === 'network') {
      if (currentStep === 'network') return 'running';
      if (networkData) return 'completed';
      return 'pending';
    }
    if (step === 'system') {
      if (currentStep === 'system') return 'running';
      if (systemData) return 'completed';
      if (networkData) return 'pending';
      return 'waiting';
    }
    if (step === 'complete') {
      if (currentStep === 'complete') return 'completed';
      return 'waiting';
    }
    return 'pending';
  };

  const getStepIcon = (step: 'network' | 'system' | 'complete') => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'pending': return '⏳';
      case 'waiting': return '⏸️';
      default: return '⏳';
    }
  };

  const getStepColor = (step: 'network' | 'system' | 'complete') => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'info';
      case 'pending': return 'default';
      case 'waiting': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Test Header */}
      <Card 
        title="Quick Test" 
        subtitle="Fast assessment of your network and system for video calls"
      >
        <div className="space-y-4">
          {!isRunning ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready for Quick Test
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will test your network speed and gather system information.
              </p>
              <Button
                onClick={startQuickTest}
                variant="primary"
                size="lg"
                className="px-8"
              >
                Start Quick Test
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress Steps */}
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                  getStepStatus('network') === 'running' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="text-2xl">{getStepIcon('network')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Network Test
                      </h4>
                      <Badge variant={getStepColor('network')} className="text-xs">
                        {getStepStatus('network') === 'running' ? 'Running...' : 
                         getStepStatus('network') === 'completed' ? 'Complete' : 
                         getStepStatus('network') === 'pending' ? 'Pending' : 'Waiting'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Testing download, upload, and connection quality
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                  getStepStatus('system') === 'running' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="text-2xl">{getStepIcon('system')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        System Information
                      </h4>
                      <Badge variant={getStepColor('system')} className="text-xs">
                        {getStepStatus('system') === 'running' ? 'Running...' : 
                         getStepStatus('system') === 'completed' ? 'Complete' : 
                         getStepStatus('system') === 'pending' ? 'Pending' : 'Waiting'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gathering device and browser information
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                  getStepStatus('complete') === 'completed' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="text-2xl">{getStepIcon('complete')}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Test Complete
                      </h4>
                      <Badge variant={getStepColor('complete')} className="text-xs">
                        {getStepStatus('complete') === 'completed' ? 'Complete' : 'Waiting'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All tests finished successfully
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Test Component */}
              {currentStep === 'network' && (
                <div className="mt-6">
                  <NetworkTest 
                    permissionsStatus={permissionsStatus}
                    onDataUpdate={handleNetworkComplete}
                  />
                </div>
              )}

              {currentStep === 'system' && (
                <div className="mt-6">
                  <ConfigInfo 
                    onDataUpdate={handleSystemComplete}
                  />
                </div>
              )}

              {currentStep === 'complete' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Quick Test Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your network and system have been tested successfully.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => window.location.reload()}
                      variant="secondary"
                      size="md"
                    >
                      Run Another Test
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 