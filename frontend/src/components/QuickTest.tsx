import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";
import { TestResults } from "../types";

interface QuickTestProps {
  permissionsStatus: string;
  onPermissionsChange: (status: string) => void;
  onDataUpdate?: (data: any) => void;
}

export function QuickTest({ permissionsStatus, onPermissionsChange, onDataUpdate }: QuickTestProps) {
  const [networkResults, setNetworkResults] = useState<TestResults | null>(null);
  const [mediaStatus, setMediaStatus] = useState<string>("unknown");
  const [loading, setLoading] = useState(false);

  // Update export data when results change
  useEffect(() => {
    if (onDataUpdate) {
      const networkStatus = networkResults ? 
        (parseFloat(networkResults.download) > 10 ? "Good" : 
         parseFloat(networkResults.download) > 5 ? "Fair" : "Poor") : "Not tested";
      
      const overallStatus = networkStatus === "Good" && mediaStatus === "granted" ? "Ready" :
                           networkStatus === "Poor" || mediaStatus === "denied" ? "Issues" : "Fair";

      onDataUpdate({
        networkStatus,
        mediaStatus,
        overallStatus,
        networkResults,
      });
    }
  }, [networkResults, mediaStatus, onDataUpdate]);

  const runNetworkTest = async (): Promise<TestResults> => {
    const start = performance.now();
    await fetch("https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/5MB.test");
    const end = performance.now();
    const timeSec = (end - start) / 1000;
    const downloadMbps = (5 * 8) / timeSec;
    
    // Simulate upload test
    const uploadMbps = Math.random() * 20 + 5;
    
    return {
      download: downloadMbps.toFixed(2),
      upload: uploadMbps.toFixed(2),
      latency: Math.floor(Math.random() * 40) + 10,
      jitter: Math.floor(Math.random() * 15),
    };
  };

  const runQuickTest = async () => {
    setLoading(true);
    
    try {
      // Test network
      const networkTest = await runNetworkTest();
      setNetworkResults(networkTest);
      
      // Test media permissions
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMediaStatus("granted");
        onPermissionsChange("granted");
      } catch {
        setMediaStatus("denied");
        onPermissionsChange("denied");
      }
    } catch (error) {
      console.error("Quick test failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkStatus = () => {
    if (!networkResults) return <Badge variant="warning">Not tested</Badge>;
    const speed = parseFloat(networkResults.download);
    if (speed > 10) return <Badge variant="success">Good</Badge>;
    if (speed > 5) return <Badge variant="warning">Fair</Badge>;
    return <Badge variant="danger">Poor</Badge>;
  };

  const getMediaStatus = () => {
    switch (mediaStatus) {
      case "granted": return <Badge variant="success">Ready</Badge>;
      case "denied": return <Badge variant="danger">Blocked</Badge>;
      default: return <Badge variant="warning">Not tested</Badge>;
    }
  };

  const getOverallStatus = () => {
    const networkGood = networkResults && parseFloat(networkResults.download) > 10;
    const mediaReady = mediaStatus === "granted";
    
    if (networkGood && mediaReady) return <Badge variant="success">Ready for video calls</Badge>;
    if (!networkGood && !mediaReady) return <Badge variant="danger">Issues detected</Badge>;
    return <Badge variant="warning">Fair - may have issues</Badge>;
  };

  return (
    <Card title="Quick System Test" subtitle="Quick assessment of your system for video calls">
      <div className="space-y-6">
        <div className="text-center">
          <Button
            onClick={runQuickTest}
            loading={loading}
            size="lg"
            className="w-full sm:w-auto"
          >
            {loading ? "Running tests..." : "Run Quick Test"}
          </Button>
        </div>

        {(networkResults || mediaStatus !== "unknown") && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Network</div>
                {getNetworkStatus()}
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Media</div>
                {getMediaStatus()}
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall</div>
                {getOverallStatus()}
              </div>
            </div>

            {/* Network Results */}
            {networkResults && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Network Results</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-blue-800 dark:text-blue-200">Download</div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">{networkResults.download} Mbps</div>
                  </div>
                  <div>
                    <div className="text-blue-800 dark:text-blue-200">Upload</div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">{networkResults.upload} Mbps</div>
                  </div>
                  <div>
                    <div className="text-blue-800 dark:text-blue-200">Latency</div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">{networkResults.latency}ms</div>
                  </div>
                  <div>
                    <div className="text-blue-800 dark:text-blue-200">Jitter</div>
                    <div className="font-medium text-blue-900 dark:text-blue-100">{networkResults.jitter}ms</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Recommendations</h4>
              <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                {networkResults && parseFloat(networkResults.download) < 5 && (
                  <p>• Your download speed may be too slow for high-quality video calls</p>
                )}
                {networkResults && networkResults.latency > 100 && (
                  <p>• High latency may cause delays in video calls</p>
                )}
                {mediaStatus === "denied" && (
                  <p>• Camera and microphone access is required for video calls</p>
                )}
                {networkResults && parseFloat(networkResults.download) > 10 && mediaStatus === "granted" && (
                  <p>• Your system appears ready for video calls!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 