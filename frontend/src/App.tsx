import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer, QuickTest, EmailResults, Help } from "./components";
import { ConfigInfo } from "./components/ConfigInfo";
import { ExportStats } from "./components/ExportStats";
import { Tabs } from "./components/ui";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [permissionsStatus, setPermissionsStatus] = useState<string>(
    () => localStorage.getItem("mediaPermissions") || "unknown"
  );
  const [showHelp, setShowHelp] = useState(false);

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
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const tabs = [
    {
      id: "quick",
      label: "Quick Test",
      content: (
        <QuickTest
          permissionsStatus={permissionsStatus}
          onPermissionsChange={setPermissionsStatus}
          onDataUpdate={(data: any) => updateExportData('quickTestData', data)}
        />
      ),
    },
    {
      id: "network",
      label: "Network",
      content: (
        <NetworkTest 
          permissionsStatus={permissionsStatus}
          onDataUpdate={(data: any) => updateExportData('networkData', data)}
        />
      ),
    },
    {
      id: "video",
      label: "Video",
      content: (
        <MediaTest
          permissionsStatus={permissionsStatus}
          onPermissionsChange={setPermissionsStatus}
          onDataUpdate={(data: any) => updateExportData('mediaData', data)}
        />
      ),
    },
    {
      id: "config",
      label: "Config",
      content: (
        <ConfigInfo 
          onDataUpdate={(data: any) => updateExportData('systemData', data)}
        />
      ),
    },
    {
      id: "email",
      label: "Email",
      content: (
        <EmailResults
          networkData={exportData.networkData}
          mediaData={exportData.mediaData}
          systemData={exportData.systemData}
          quickTestData={exportData.quickTestData}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} onShowHelp={toggleHelp} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showHelp ? (
          <Help />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Network & Media Tester
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Test your internet connection and media devices for optimal video call performance
              </p>
            </div>

            {/* Export Stats Section */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Export Test Results
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Export comprehensive test results from all tabs in JSON or CSV format
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

            <Tabs tabs={tabs} defaultTab="quick" />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
