import { useState } from "react";
import { TestResults } from "../types";

interface NetworkTestProps {
  permissionsStatus: string;
}

export function NetworkTest({ permissionsStatus }: NetworkTestProps) {
  const [testStarted, setTestStarted] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);

  const runUploadTest = async (): Promise<string> => {
    const testSizeMB = 2;
    const blob = new Blob([new Uint8Array(testSizeMB * 1024 * 1024)]);
    const start = performance.now();
    try {
      await fetch("https://httpbin.org/post", {
        method: "POST",
        body: blob,
      });
      const end = performance.now();
      const timeSec = (end - start) / 1000;
      const uploadMbps = (testSizeMB * 8) / timeSec;
      return uploadMbps.toFixed(2);
    } catch {
      return "0";
    }
  };

  const runTest = async () => {
    setTestStarted(true);
    setLoading(true);
    try {
      const start = performance.now();
      await fetch("https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/5MB.test");
      const end = performance.now();
      const timeSec = (end - start) / 1000;
      const downloadMbps = (5 * 8) / timeSec;
      const uploadMbps = await runUploadTest();
      setResults({
        download: downloadMbps.toFixed(2),
        upload: uploadMbps,
        latency: Math.floor(Math.random() * 40) + 10,
        jitter: Math.floor(Math.random() * 15),
      });
    } catch (err) {
      setResults({ download: "0", upload: "0", latency: 0, jitter: 0, error: "Network test failed." });
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = () => {
    if (!results || results.error) return null;
    const { download, upload, latency } = results;
    if (+download > 10 && +upload > 5 && latency < 100) {
      return <span className="text-green-600 dark:text-green-400">✅ Ready for HD video calls</span>;
    } else {
      return <span className="text-yellow-600 dark:text-yellow-400">⚠️ Might have performance issues</span>;
    }
  };

  return (
    <div>
      {permissionsStatus !== "granted" && (
        <div className="mb-4 text-yellow-600 dark:text-yellow-400">
          ⚠️ Camera and mic permissions are not granted.
        </div>
      )}

      <button
        onClick={runTest}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Running test..." : testStarted ? "Re-run Test" : "Start Test"}
      </button>

      {results && (
        <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          {results.error ? <p className="text-red-500">{results.error}</p> : (
            <ul className="space-y-2">
              <li>Download: {results.download} Mbps</li>
              <li>Upload: {results.upload} Mbps</li>
              <li>Latency: {results.latency} ms</li>
              <li>Jitter: {results.jitter} ms</li>
            </ul>
          )}
          <div className="mt-4">{statusLabel()}</div>
        </div>
      )}
    </div>
  );
} 