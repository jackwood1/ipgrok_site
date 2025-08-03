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

            {/* Test Progress */}
            <TestProgress
              completedTests={completedTests}
              currentTest={currentTest}
              onTestClick={handleTestClick}
            />

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
