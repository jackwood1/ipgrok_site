import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer, QuickTest, EmailResults, Help, LandingPage, ShareResults, TestProgress, ResultsDashboard } from "./components";
import { ConfigInfo } from "./components/ConfigInfo";
import { ExportStats } from "./components/ExportStats";
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
    quickTestData: null as any,
  });

  const updateExportData = (type: string, data: any) => {
    setExportData(prev => ({
      ...prev,
      [type]: data
    }));
    
    // Mark test as completed when data is received
    const testMapping: { [key: string]: string } = {
      'quickTestData': 'quickTest',
      'networkData': 'networkTest',
      'mediaData': 'mediaTest',
      'systemData': 'configInfo'
    };
    
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
    // Trigger the export functionality
    const exportStatsElement = document.querySelector('[data-export-stats]');
    if (exportStatsElement) {
      const exportButton = exportStatsElement.querySelector('button');
      if (exportButton) {
        exportButton.click();
      }
    }
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
            quickTestData={exportData.quickTestData}
            onShareResults={showShareResults}
            onExportResults={handleExportResults}
          />
        ) : showShare ? (
          <ShareResults
            networkData={exportData.networkData}
            mediaData={exportData.mediaData}
            systemData={exportData.systemData}
            quickTestData={exportData.quickTestData}
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

            {/* Test Progress */}
            <TestProgress
              completedTests={completedTests}
              currentTest={currentTest}
              onTestClick={handleTestClick}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Individual Test Components */}
                {currentTest === "quickTest" && (
                  <QuickTest
                    permissionsStatus={permissionsStatus}
                    onPermissionsChange={setPermissionsStatus}
                    onDataUpdate={(data: any) => updateExportData('quickTestData', data)}
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
                    quickTestData={exportData.quickTestData}
                  />
                )}
              </div>
              <div className="lg:col-span-1">
                {/* Export Stats Section */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Export Test Results
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Export comprehensive test results
                      </p>
                    </div>
                    <ExportStats
                      networkData={exportData.networkData}
                      mediaData={exportData.mediaData}
                      systemData={exportData.systemData}
                      quickTestData={exportData.quickTestData}
                    />
                  </div>
                </div>
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
