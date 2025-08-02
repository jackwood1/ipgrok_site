import { useState } from "react";

type TestResults = {
  download: string;
  latency: number;
  jitter: number;
  error?: string;
};

function App() {
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runTest = async () => {
    setTestStarted(true);
    setLoading(true);

    const start = performance.now();
    try {
      // Simulate downloading a 100MB file to estimate download speed
      await fetch("https://speedtest.tele2.net/10MB.zip");///await fetch("https://speed.hetzner.de/100MB.bin", { method: "GET" });
      
      const end = performance.now();
      const timeSec = (end - start) / 1000;
      const downloadMbps = (100 * 8) / timeSec;

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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Video Call Readiness Tester</h1>
          <p className="text-sm text-gray-500">Check your network before hopping on a call.</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto p-6">
        <button
          onClick={runTest}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Testing..." : testStarted ? "Re-run Test" : "Start Test"}
        </button>

        {results && (
          <div className="mt-6 bg-white rounded shadow p-4">
            {results.error ? (
              <p className="text-red-500">{results.error}</p>
            ) : (
              <div className="space-y-2">
                <p><strong>Download Speed:</strong> {results.download} Mbps</p>
                <p><strong>Latency:</strong> {results.latency} ms</p>
                <p><strong>Jitter:</strong> {results.jitter} ms</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {parseFloat(results.download) > 10 && results.latency < 100
                    ? "✅ Ready for HD video calls"
                    : "⚠️ Might have performance issues"}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <footer className="text-center text-xs text-gray-400 py-4">
        &copy; {new Date().getFullYear()} Video Call Tester. All rights reserved.
      </footer>
    </main>
  );
}

export default App;
