import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer, QuickTest } from "./components";
import { Tabs } from "./components/ui";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [permissionsStatus, setPermissionsStatus] = useState<string>(
    () => localStorage.getItem("mediaPermissions") || "unknown"
  );

  const tabs = [
    {
      id: "quick",
      label: "Quick Test",
      content: (
        <QuickTest 
          permissionsStatus={permissionsStatus} 
          onPermissionsChange={setPermissionsStatus}
        />
      ),
    },
    {
      id: "network",
      label: "Network",
      content: (
        <NetworkTest permissionsStatus={permissionsStatus} />
      ),
    },
    {
      id: "video",
      label: "Video",
      content: (
        <MediaTest 
          permissionsStatus={permissionsStatus} 
          onPermissionsChange={setPermissionsStatus}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Video Call Tester
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your internet connection and media devices for optimal video call performance
          </p>
        </div>

        <Tabs tabs={tabs} defaultTab="quick" />
      </main>

      <Footer />
    </div>
  );
}

export default App;
