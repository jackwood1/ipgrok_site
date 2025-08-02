import { useState } from "react";
import { Header, NetworkTest, MediaTest, Footer } from "./components";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [permissionsStatus, setPermissionsStatus] = useState<string>(
    () => localStorage.getItem("mediaPermissions") || "unknown"
  );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <section className="max-w-3xl mx-auto px-6 py-10">
        <NetworkTest permissionsStatus={permissionsStatus} />
        <MediaTest 
          permissionsStatus={permissionsStatus} 
          onPermissionsChange={setPermissionsStatus}
        />
      </section>

      <Footer />
    </main>
  );
}

export default App;
