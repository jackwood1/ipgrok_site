import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer, EmailResults, Help, LandingPage, ShareResults, TestProgress, ResultsDashboard, QuickTest } from "./components";
import { ConfigInfo } from "./components/ConfigInfo";
import { Button } from "./components/ui";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [permissionsStatus, setPermissionsStatus] = useState<string>(
    () => localStorage.getItem("mediaPermissions") || "unknown"
  );
  const [showHelp, setShowHelp] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>("");
          const [completedTests, setCompletedTests] = useState({
          quickTest: false,
          networkTest: false,
          mediaTest: false,
          advancedTests: false,
          configInfo: false,
        });

  // Data management for export functionality
          const [exportData, setExportData] = useState({
          networkData: null as any,
          mediaData: null as any,
          systemData: null as any,
        });

  const updateExportData = (type: string, data: any) => {
    setExportData(prev => ({
      ...prev,
      [type]: data
    }));
    
    // Mark test as completed when data is received
    const testMapping: { [key: string]: string } = {
      'networkData': 'networkTest',
      'mediaData': 'mediaTest',
      'systemData': 'configInfo'
    };
    
    // Special handling for quick test completion
    if (type === 'networkData' && data && data.testType === 'quickTest') {
      handleTestComplete('quickTest');
    }
    
    const testName = testMapping[type];
    if (testName && data) {
      handleTestComplete(testName);
      
      // If network data includes advanced tests, mark advanced tests as complete
      if (type === 'networkData' && data.advancedTests) {
        handleTestComplete('advancedTests');
      }
    }
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const startQuickTest = () => {
    setShowLanding(false);
    setShowResults(false);
    setShowShare(false);
    setCurrentTest("quickTest");
  };

  const startDetailedTest = () => {
    setShowLanding(false);
    setShowResults(false);
    setShowShare(false);
    setCurrentTest("networkTest");
  };

  const showResultsDashboard = () => {
    setShowResults(true);
    setShowShare(false);
  };

  const showShareResults = () => {
    setShowShare(true);
    setShowResults(false);
  };

  const handleTestComplete = (testName: string) => {
    setCompletedTests(prev => ({
      ...prev,
      [testName]: true
    }));
  };

  const handleTestClick = (testName: string) => {
    setCurrentTest(testName);
    setShowResults(false);
    setShowShare(false);
  };

  const handleExportResults = () => {
    // Create export data object
    const exportDataObj = {
      timestamp: new Date().toISOString(),
      networkData: exportData.networkData,
      mediaData: exportData.mediaData,
      systemData: exportData.systemData,
    };

    // Export as JSON
    const jsonData = JSON.stringify(exportDataObj, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ipgrok-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also export as CSV if network data exists
    if (exportData.networkData) {
      const csvData = generateCSV(exportDataObj);
      const csvBlob = new Blob([csvData], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      
      const csvA = document.createElement('a');
      csvA.href = csvUrl;
      csvA.download = `ipgrok-test-results-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(csvA);
      csvA.click();
      document.body.removeChild(csvA);
      URL.revokeObjectURL(csvUrl);
    }
  };

  const generateCSV = (data: any) => {
    const rows = [];
    
    // Add header
    rows.push(['Test Type', 'Metric', 'Value', 'Unit']);
    
    // Network data
    if (data.networkData?.speedTest) {
      const speedTest = data.networkData.speedTest;
      rows.push(['Network', 'Download Speed', speedTest.download, 'Mbps']);
      rows.push(['Network', 'Upload Speed', speedTest.upload, 'Mbps']);
      rows.push(['Network', 'Latency', speedTest.latency, 'ms']);
      rows.push(['Network', 'Jitter', speedTest.jitter, 'ms']);
      rows.push(['Network', 'Connection Quality', speedTest.connectionQuality, 'Grade']);
      rows.push(['Network', 'Quality Score', speedTest.qualityScore, '/100']);
    }
    
    // System data
    if (data.systemData) {
      rows.push(['System', 'IP Address', data.systemData.ipAddress, '']);
      rows.push(['System', 'Platform', data.systemData.platform, '']);
      rows.push(['System', 'Screen Resolution', data.systemData.screenResolution, '']);
      rows.push(['System', 'Timezone', data.systemData.timezone, '']);
      rows.push(['System', 'WebGL Support', data.systemData.webGL ? 'Yes' : 'No', '']);
      rows.push(['System', 'CPU Cores', data.systemData.cores, '']);
    }
    
    // Media data
    if (data.mediaData?.videoQuality) {
      const videoQuality = data.mediaData.videoQuality;
      rows.push(['Media', 'Video Resolution', videoQuality.resolution, '']);
      rows.push(['Media', 'Frame Rate', videoQuality.frameRate, 'fps']);
      rows.push(['Media', 'Video Quality Grade', videoQuality.qualityGrade, '']);
    }
    
    if (data.mediaData?.audioQuality) {
      const audioQuality = data.mediaData.audioQuality;
      rows.push(['Media', 'Sample Rate', audioQuality.sampleRate, 'Hz']);
      rows.push(['Media', 'Audio Channels', audioQuality.channels, '']);
      rows.push(['Media', 'Audio Quality Grade', audioQuality.qualityGrade, '']);
    }
    
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const goHome = () => {
    setShowLanding(true);
    setShowResults(false);
    setShowShare(false);
    setShowHelp(false);
    setCurrentTest("");
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} onShowHelp={toggleHelp} onGoHome={goHome} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showHelp ? (
          <Help />
        ) : showLanding ? (
          <LandingPage 
            onStartQuickTest={startQuickTest}
            onStartDetailedTest={startDetailedTest}
          />
        ) : showResults ? (
          <ResultsDashboard
            networkData={exportData.networkData}
            mediaData={exportData.mediaData}
            systemData={exportData.systemData}
            onShareResults={showShareResults}
            onExportResults={handleExportResults}
          />
        ) : showShare ? (
          <ShareResults
            networkData={exportData.networkData}
            mediaData={exportData.mediaData}
            systemData={exportData.systemData}
          />
        ) : (
          <div className="space-y-8">
            {/* Navigation */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={goHome}
                variant="secondary"
                size="sm"
              >
                🏠 Home
              </Button>
              <Button
                onClick={showResultsDashboard}
                variant="secondary"
                size="sm"
              >
                📊 Results
              </Button>
              <Button
                onClick={showShareResults}
                variant="secondary"
                size="sm"
              >
                📤 Share
              </Button>
            </div>

            {/* Test Progress - Hide when running Quick Test */}
            {currentTest !== "quickTest" && (
              <TestProgress
                completedTests={completedTests}
                currentTest={currentTest}
                onTestClick={handleTestClick}
              />
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-8">
              <div className="lg:col-span-1">
                {/* Individual Test Components */}
                {currentTest === "quickTest" && (
                  <QuickTest
                    permissionsStatus={permissionsStatus}
                    onPermissionsChange={setPermissionsStatus}
                    onDataUpdate={(data: any) => {
                      // Handle quick test data - it contains both network and system data
                      if (data.networkData) {
                        updateExportData('networkData', data.networkData);
                      }
                      if (data.systemData) {
                        updateExportData('systemData', data.systemData);
                      }
                      // Mark quick test as complete when both tests are done
                      if (data.networkData && data.systemData) {
                        handleTestComplete('quickTest');
                      }
                    }}
                  />
                )}
                {currentTest === "networkTest" && (
                  <NetworkTest 
                    permissionsStatus={permissionsStatus}
                    onDataUpdate={(data: any) => updateExportData('networkData', data)}
                  />
                )}
                {currentTest === "mediaTest" && (
                  <MediaTest
                    permissionsStatus={permissionsStatus}
                    onPermissionsChange={setPermissionsStatus}
                    onDataUpdate={(data: any) => updateExportData('mediaData', data)}
                  />
                )}
                {currentTest === "configInfo" && (
                  <ConfigInfo 
                    onDataUpdate={(data: any) => updateExportData('systemData', data)}
                  />
                )}
                {currentTest === "email" && (
                  <EmailResults
                    networkData={exportData.networkData}
                    mediaData={exportData.mediaData}
                    systemData={exportData.systemData}
                  />
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
