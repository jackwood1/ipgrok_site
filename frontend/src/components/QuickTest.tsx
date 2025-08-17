import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";
import { NetworkTest } from "./NetworkTest";
import { ConfigInfo } from "./ConfigInfo";
import { addTestResult } from "../utils";

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
  const [networkProgress, setNetworkProgress] = useState<string>("");
  const [systemProgress, setSystemProgress] = useState<string>("");
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // Update parent component when all tests complete
  useEffect(() => {
    if (networkData && systemData && onDataUpdate) {
      const testData = {
        testType: 'quickTest',
        data: {
          networkData,
          systemData,
          completedAt: new Date().toISOString()
        }
      };
      
      // Add test result to client tracking
      addTestResult('quickTest', testData);
      
      onDataUpdate(testData);
    }
  }, [networkData, systemData, onDataUpdate]);

  // Handle network test completion
  const handleNetworkComplete = (data: any) => {
    console.log('QuickTest: Network test completed with data:', data);
    
    // Extract the actual data from the standardized format
    let networkDataToSet = data;
    if (data && data.testType === 'networkTest' && data.data) {
      networkDataToSet = data.data;
    }
    
    // Add network test result to client tracking
    addTestResult('networkTest', data);
    
    setNetworkData(networkDataToSet);
    setCurrentStep('system');
    setNetworkProgress("Network test completed!");
  };

  // Handle network test progress updates
  const handleNetworkProgress = (progress: string) => {
    setNetworkProgress(progress);
  };

  // Handle system info completion
  const handleSystemComplete = (data: any) => {
    console.log('QuickTest: System info completed with data:', data);
    
    // Extract the actual data from the standardized format
    let systemDataToSet = data;
    if (data && data.testType === 'systemInfo' && data.data) {
      systemDataToSet = data.data;
    }
    
    // Add system info result to client tracking
    addTestResult('systemInfo', data);
    
    setSystemData(systemDataToSet);
    setCurrentStep('complete');
    setSystemProgress("System information gathered!");
  };

  // Handle system info progress updates
  const handleSystemProgress = (progress: string) => {
    setSystemProgress(progress);
  };

  // Start the quick test sequence
  const startQuickTest = () => {
    console.log('QuickTest: Starting quick test sequence');
    setIsRunning(true);
    setCurrentStep('network');
    setNetworkData(null);
    setSystemData(null);
    setNetworkProgress("");
    setSystemProgress("");
    setShowDebug(false);
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
                    {/* Progress indicator for network test */}
                    {getStepStatus('network') === 'running' && networkProgress && (
                      <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-800 rounded text-xs text-blue-800 dark:text-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          <span>{networkProgress}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                  getStepStatus('system') === 'running' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="text-1xl">{getStepIcon('system')}</div>
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
                    {/* Progress indicator for system info */}
                    {getStepStatus('system') === 'running' && systemProgress && (
                      <div className="mt-2 p-2 bg-green-100 dark:bg-green-800 rounded text-xs text-green-800 dark:text-green-200">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                          <span>{systemProgress}</span>
                        </div>
                      </div>
                    )}
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
                  {/* Enhanced Progress Display */}
                  {networkProgress && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Network Test in Progress</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{networkProgress}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-blue-600 dark:text-blue-400">Step 1 of 2</div>
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Network</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <NetworkTest 
                    permissionsStatus={permissionsStatus}
                    onDataUpdate={handleNetworkComplete}
                    onProgressUpdate={handleNetworkProgress}
                    autoStart={true}
                    quickTestMode={true}
                  />
                </div>
              )}

              {currentStep === 'system' && (
                <div className="mt-6">
                  {/* Enhanced Progress Display */}
                  {systemProgress && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                          <div>
                            <h4 className="font-medium text-green-900 dark:text-green-100">System Information Gathering</h4>
                            <p className="text-sm text-green-700 dark:text-green-300">{systemProgress}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-green-600 dark:text-green-400">Step 2 of 2</div>
                          <div className="text-sm font-medium text-green-900 dark:text-green-100">System</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <ConfigInfo 
                    onDataUpdate={handleSystemComplete}
                  />
                </div>
              )}

              {currentStep === 'complete' && (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Quick Test Complete!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your network and system have been tested successfully.
                    </p>
                  </div>

                  {/* Overall Assessment */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      📊 Overall Assessment
                    </h4>
                    <div className="space-y-3">
                      {networkData?.speedTest && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Network Performance</span>
                          <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                            parseFloat(networkData.speedTest.download) > 25 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            parseFloat(networkData.speedTest.download) > 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {parseFloat(networkData.speedTest.download) > 25 ? 'Excellent' :
                             parseFloat(networkData.speedTest.download) > 10 ? 'Good' : 'Needs Improvement'}
                          </span>
                        </div>
                      )}
                      {systemData && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">System Compatibility</span>
                          <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                            systemData.webGL ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {systemData.webGL ? 'Compatible' : 'Limited Support'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Video Call Readiness</span>
                        <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                          networkData?.speedTest && parseFloat(networkData.speedTest.download) > 10 && systemData?.webGL ? 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          networkData?.speedTest && parseFloat(networkData.speedTest.download) > 5 ? 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {networkData?.speedTest && parseFloat(networkData.speedTest.download) > 10 && systemData?.webGL ? 'Ready' :
                           networkData?.speedTest && parseFloat(networkData.speedTest.download) > 5 ? 'Fair' : 'Not Ready'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Network Summary */}
                    {networkData && (
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                          🌐 Network Results
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800 dark:text-blue-200">Download Speed</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              {networkData.speedTest?.download || 'N/A'} Mbps
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800 dark:text-blue-200">Upload Speed</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              {networkData.speedTest?.upload || 'N/A'} Mbps
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800 dark:text-blue-200">Latency</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              {networkData.speedTest?.latency || 'N/A'} ms
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800 dark:text-blue-200">Connection Quality</span>
                            <span className={`font-medium px-2 py-1 rounded text-xs ${
                              networkData.speedTest?.connectionQuality === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              networkData.speedTest?.connectionQuality === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              networkData.speedTest?.connectionQuality === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              networkData.speedTest?.connectionQuality === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {networkData.speedTest?.connectionQuality || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* System Summary */}
                    {systemData && (
                      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                          ⚙️ System Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800 dark:text-green-200">Platform</span>
                            <span className="font-medium text-green-900 dark:text-green-100 text-right">
                              {systemData.platform || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800 dark:text-green-200">Screen Resolution</span>
                            <span className="font-medium text-green-900 dark:text-green-100 text-right">
                              {systemData.screenResolution || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800 dark:text-green-200">WebGL Support</span>
                            <span className={`font-medium px-2 py-1 rounded text-xs ${
                              systemData.webGL ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {systemData.webGL ? 'Supported' : 'Not Supported'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-800 dark:text-green-200">IP Address</span>
                            <span className="font-medium text-green-900 dark:text-green-100 text-right">
                              {systemData.ipAddress || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2">
                      💡 Recommendations
                    </h4>
                    <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                      {networkData?.speedTest && parseFloat(networkData.speedTest.download) < 10 && (
                        <p>• Your download speed may be too slow for high-quality video calls. Consider upgrading your internet plan.</p>
                      )}
                      {networkData?.speedTest && networkData.speedTest.latency > 100 && (
                        <p>• High latency detected. This may cause delays in video calls. Try connecting via Ethernet if possible.</p>
                      )}
                      {systemData && !systemData.webGL && (
                        <p>• WebGL is not supported on your system. Some video call features may be limited.</p>
                      )}
                      {networkData?.speedTest && parseFloat(networkData.speedTest.download) > 25 && systemData?.webGL && (
                        <p>• Excellent! Your system is well-suited for high-quality video calls.</p>
                      )}
                      {(!networkData?.speedTest || !systemData) && (
                        <p>• Run additional tests for a more comprehensive assessment of your system.</p>
                      )}
                    </div>
                  </div>

                  {/* Debug Information - Collapsible */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowDebug(!showDebug)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        🐛 Debug Info
                        <span className="text-xs text-blue-600 dark:text-blue-300">
                          (Click to {showDebug ? 'hide' : 'show'})
                        </span>
                      </h4>
                      <span className="text-blue-600 dark:text-blue-300 text-lg">
                        {showDebug ? '▼' : '▶'}
                      </span>
                    </button>
                    {showDebug && (
                      <div className="p-4 border-t border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                          <div>Network Data: {JSON.stringify(networkData, null, 2)}</div>
                          <div>System Data: {JSON.stringify(systemData, null, 2)}</div>
                          <div>Current Step: {currentStep}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
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