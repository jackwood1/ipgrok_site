import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer } from "./components";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [permissionsStatus, setPermissionsStatus] = useState<string>(
    () => localStorage.getItem("mediaPermissions") || "unknown"
  );

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

        <div className="space-y-8">
          <NetworkTest permissionsStatus={permissionsStatus} />
          <MediaTest 
            permissionsStatus={permissionsStatus} 
            onPermissionsChange={setPermissionsStatus}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
