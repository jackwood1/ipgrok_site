import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer, EmailResults, Help, LandingPage, ShareResults, TestProgress, ResultsDashboard, QuickTest, ManualTest, DetailedTestConfirm, AdvancedNetworkTests } from "./components";
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
  const [showDetailedConfirm, setShowDetailedConfirm] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [resetPrevious, setResetPrevious] = useState(true);
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
      'systemData': 'configInfo',
      'advancedTestsData': 'advancedTests'
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
      
      // Handle system info from NetworkTest component
      if (data && data.testType === 'systemInfo') {
        updateExportData('systemData', data.data);
        handleTestComplete('configInfo');
      }
      
      // Auto-progression for Detailed Analysis: networkTest -> configInfo -> advancedTests -> mediaTest
      if (type === 'networkData' && currentTest === 'networkTest') {
        setCurrentTest('configInfo');
      }
      if (type === 'systemData' && currentTest === 'configInfo') {
        setCurrentTest('advancedTests');
      }
      if (type === 'advancedTestsData' && currentTest === 'advancedTests') {
        setCurrentTest('mediaTest');
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
    setShowDetailedConfirm(true);
  };

  const startManualTest = () => {
    setShowLanding(false);
    setShowResults(false);
    setShowShare(false);
    setCurrentTest("manualTest");
  };

  const confirmDetailedTest = () => {
    // Reset previous data if checkbox is checked
    if (resetPrevious) {
      setExportData({
        networkData: null,
        mediaData: null,
        systemData: null,
      });
      setCompletedTests({
        quickTest: false,
        networkTest: false,
        mediaTest: false,
        advancedTests: false,
        configInfo: false,
      });
    }
    
    setShowDetailedConfirm(false);
    setCurrentTest("networkTest"); // Start with Network Tests first
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

    // Export as JSON only
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
            onStartManualTest={startManualTest}
          />
        ) : showDetailedConfirm ? (
          <DetailedTestConfirm
            resetPrevious={resetPrevious}
            onResetPreviousChange={setResetPrevious}
            onConfirm={confirmDetailedTest}
            onCancel={goHome}
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
                    detailedAnalysisMode={true}
                  />
                )}
                {currentTest === "advancedTests" && (
                  <AdvancedNetworkTests
                    onDataUpdate={(data: any) => updateExportData('advancedTestsData', data)}
                    autoStart={true}
                  />
                )}
                {currentTest === "mediaTest" && (
                  <MediaTest
                    permissionsStatus={permissionsStatus}
                    onPermissionsChange={setPermissionsStatus}
                    onDataUpdate={(data: any) => updateExportData('mediaData', data)}
                    autoStart={true}
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
                {currentTest === "manualTest" && (
                  <ManualTest
                    permissionsStatus={permissionsStatus}
                    onPermissionsChange={setPermissionsStatus}
                    onDataUpdate={(data: any) => {
                      // Handle manual test data
                      if (data.testName === 'network') {
                        updateExportData('networkData', data.data);
                      } else if (data.testName === 'media') {
                        updateExportData('mediaData', data.data);
                      } else if (data.testName === 'system') {
                        updateExportData('systemData', data.data);
                      }
                    }}
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
