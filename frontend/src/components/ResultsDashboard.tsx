import { Card, Badge, Button } from "./ui";

interface ResultsDashboardProps {
  networkData: any;
  mediaData: any;
  systemData: any;
  quickTestData: any;
  onShareResults: () => void;
  onExportResults: () => void;
}

export function ResultsDashboard({ 
  networkData, 
  mediaData, 
  systemData, 
  quickTestData, 
  onShareResults, 
  onExportResults 
}: ResultsDashboardProps) {
  
  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': return 'warning';
      case 'F': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
      case 'good':
        return 'success';
      case 'fair':
        return 'warning';
      case 'poor':
        return 'danger';
      default:
        return 'default';
    }
  };

  const hasData = networkData || mediaData || systemData || quickTestData;

  if (!hasData) {
    return (
      <Card title="Results Dashboard" subtitle="Your test results will appear here">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Test Results Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Run some tests to see your results here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card title="Overall Performance Score" subtitle="Your comprehensive internet health score">
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {networkData?.speedTest?.connectionQuality || quickTestData?.overallStatus || 'N/A'}
          </div>
          <Badge variant={getQualityColor(networkData?.speedTest?.connectionQuality || 'F')} className="text-lg">
            {networkData?.speedTest?.qualityScore || 'N/A'}/100
          </Badge>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            {networkData?.speedTest?.recommendations?.[0] || 'Run more tests for detailed recommendations'}
          </p>
        </div>
      </Card>

      {/* Network Performance */}
      {networkData && (
        <Card title="Network Performance" subtitle="Your internet connection analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {networkData.speedTest?.download || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Download (Mbps)</div>
              <Badge variant={getStatusColor(networkData.speedTest?.download > 50 ? 'excellent' : networkData.speedTest?.download > 25 ? 'good' : 'fair')} className="mt-2">
                {networkData.speedTest?.download > 50 ? 'Excellent' : networkData.speedTest?.download > 25 ? 'Good' : 'Fair'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {networkData.speedTest?.upload || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Upload (Mbps)</div>
              <Badge variant={getStatusColor(networkData.speedTest?.upload > 25 ? 'excellent' : networkData.speedTest?.upload > 10 ? 'good' : 'fair')} className="mt-2">
                {networkData.speedTest?.upload > 25 ? 'Excellent' : networkData.speedTest?.upload > 10 ? 'Good' : 'Fair'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {networkData.speedTest?.latency || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Latency (ms)</div>
              <Badge variant={getStatusColor(networkData.speedTest?.latency < 50 ? 'excellent' : networkData.speedTest?.latency < 100 ? 'good' : 'fair')} className="mt-2">
                {networkData.speedTest?.latency < 50 ? 'Excellent' : networkData.speedTest?.latency < 100 ? 'Good' : 'Fair'}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {networkData.speedTest?.packetLossRate || 'N/A'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Packet Loss (%)</div>
              <Badge variant={getStatusColor(networkData.speedTest?.packetLossRate < 1 ? 'excellent' : networkData.speedTest?.packetLossRate < 3 ? 'good' : 'fair')} className="mt-2">
                {networkData.speedTest?.packetLossRate < 1 ? 'Excellent' : networkData.speedTest?.packetLossRate < 3 ? 'Good' : 'Fair'}
              </Badge>
            </div>
          </div>

          {/* Advanced Network Tests */}
          {networkData.advancedTests && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Advanced Network Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {networkData.advancedTests.dnsPerformance && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">DNS Performance</span>
                    <Badge variant={getStatusColor(networkData.advancedTests.dnsPerformance.status)}>
                      {networkData.advancedTests.dnsPerformance.responseTime}ms
                    </Badge>
                  </div>
                )}
                
                {networkData.advancedTests.vpnDetection && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">VPN Detection</span>
                    <Badge variant={networkData.advancedTests.vpnDetection.isVPN ? 'warning' : 'success'}>
                      {networkData.advancedTests.vpnDetection.isVPN ? 'VPN Detected' : 'No VPN'}
                    </Badge>
                  </div>
                )}
                
                {networkData.advancedTests.networkType && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Type</span>
                    <Badge variant="info">
                      {networkData.advancedTests.networkType.type}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Media Performance */}
      {mediaData && (
        <Card title="Media Performance" subtitle="Camera and microphone analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video Quality */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Video Quality</h4>
              <div className="space-y-2">
                {mediaData.videoQuality && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-200">Resolution</span>
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {mediaData.videoQuality.resolution || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-200">Frame Rate</span>
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        {mediaData.videoQuality.frameRate || 'N/A'} FPS
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-200">Quality Grade</span>
                      <Badge variant={getQualityColor(mediaData.videoQuality.qualityGrade || 'F')}>
                        {mediaData.videoQuality.qualityGrade || 'N/A'}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Audio Quality */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-3">Audio Quality</h4>
              <div className="space-y-2">
                {mediaData.audioQuality && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-800 dark:text-green-200">Sample Rate</span>
                      <span className="text-sm font-medium text-green-900 dark:text-green-100">
                        {mediaData.audioQuality.sampleRate || 'N/A'} Hz
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-800 dark:text-green-200">Channels</span>
                      <span className="text-sm font-medium text-green-900 dark:text-green-100">
                        {mediaData.audioQuality.channels || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-800 dark:text-green-200">Quality Grade</span>
                      <Badge variant={getQualityColor(mediaData.audioQuality.qualityGrade || 'F')}>
                        {mediaData.audioQuality.qualityGrade || 'N/A'}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* System Information */}
      {systemData && (
        <Card title="System Information" subtitle="Your device and browser details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">IP Address</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemData.ipAddress || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Platform</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemData.platform || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Screen Resolution</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemData.screenResolution || 'N/A'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Timezone</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemData.timezone || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">WebGL Support</span>
                <Badge variant={systemData.webGL ? 'success' : 'danger'}>
                  {systemData.webGL ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">CPU Cores</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {systemData.cores || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onShareResults}
          className="flex-1"
          size="lg"
        >
          📤 Share Results
        </Button>
        <Button
          onClick={onExportResults}
          variant="secondary"
          className="flex-1"
          size="lg"
        >
          📊 Export Data
        </Button>
      </div>
    </div>
  );
} 