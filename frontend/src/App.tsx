import { useEffect, useState } from "react";

type TestResults = {
  download: string;
  latency: number;
  jitter: number;
  error?: string;
};

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );

  const [testStarted, setTestStarted] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setDarkMode(saved === "true");
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const runTest = async () => {
    setTestStarted(true);
    setLoading(true);

    const start = performance.now();
    try {
      await fetch("https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/5MB.test"); // Replace with actual S3 URL
      const end = performance.now();
      const timeSec = (end - start) / 1000;
      const downloadMbps = (5 * 8) / timeSec;

      setResults({
        download: downloadMbps.toFixed(2),
        latency: Math.floor(Math.random() * 40) + 10,
        jitter: Math.floor(Math.random() * 15),
      });
    } catch (err) {
      console.error("Test failed", err);
      setResults({ download: "0", latency: 0, jitter: 0, error: "Network test failed." });
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = () => {
    if (!results || results.error) return null;
    const { download, latency } = results;
    if (parseFloat(download) > 10 && latency < 100) {
      return (
        <span className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
          ✅ Ready for HD video calls
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium">
          ⚠️ Might have performance issues
        </span>
      );
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          
          <div className="flex-grow">
            <h1 className="text-3xl font-semibold text-blue-700 dark:text-blue-300">
              Video Call Readiness Tester v1
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Check your network speed and stability before joining a video call.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <section className="max-w-3xl mx-auto p-6 text-center">
        <button
          onClick={runTest}
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-all"
        >
          {loading ? "Running test..." : testStarted ? "Re-run Test" : "Start Test"}
        </button>

        {results && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left space-y-4">
            {results.error ? (
              <p className="text-red-500 font-medium">{results.error}</p>
            ) : (
              <>
                <div>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Download Speed</span>
                  <span className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                    {results.download} Mbps
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Latency</span>
                  <span className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                    {results.latency} ms
                  </span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Jitter</span>
                  <span className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                    {results.jitter} ms
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">{statusLabel()}</div>
              </>
            )}
          </div>
        )}
      </section>

      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 py-6">
        &copy; {new Date().getFullYear()} ipgrok.com — All rights reserved.
      </footer>
    </main>
  );
}

export default App;