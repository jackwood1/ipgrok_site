import { TestResults } from "../types";
import { Badge } from "./ui";

interface EnhancedTestResults extends TestResults {
  bandwidthScore?: string;
  packetLossRate?: number;
  connectionQuality?: 'A' | 'B' | 'C' | 'D' | 'F';
  qualityScore?: number;
  recommendations?: string[];
}

interface NetworkMetricsProps {
  results: EnhancedTestResults;
}

export function NetworkMetrics({ results }: NetworkMetricsProps) {
  const getDownloadColor = (speed: string) => {
    const numSpeed = parseFloat(speed);
    if (numSpeed >= 50) return "success";
    if (numSpeed >= 25) return "info";
    if (numSpeed >= 10) return "warning";
    return "danger";
  };

  const getUploadColor = (speed: string) => {
    const numSpeed = parseFloat(speed);
    if (numSpeed >= 25) return "success";
    if (numSpeed >= 10) return "info";
    if (numSpeed >= 5) return "warning";
    return "danger";
  };

  const getLatencyColor = (latency: number) => {
    if (latency <= 50) return "success";
    if (latency <= 100) return "info";
    if (latency <= 200) return "warning";
    return "danger";
  };

  const getJitterColor = (jitter: number) => {
    if (jitter <= 10) return "success";
    if (jitter <= 20) return "info";
    if (jitter <= 50) return "warning";
    return "danger";
  };

  const getPacketLossColor = (lossRate: number) => {
    if (lossRate <= 1) return "success";
    if (lossRate <= 3) return "warning";
    return "danger";
  };

  if (results.error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center">
          <Badge variant="danger" className="mr-2">❌</Badge>
          <span className="text-red-800 dark:text-red-200">{results.error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
        Network Performance Metrics
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Download Speed */}
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Download Speed
            </span>
            <Badge variant={getDownloadColor(results.download)}>
              {parseFloat(results.download) >= 50 ? "Excellent" : 
               parseFloat(results.download) >= 25 ? "Good" : 
               parseFloat(results.download) >= 10 ? "Fair" : "Poor"}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.download} Mbps
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {parseFloat(results.download) >= 50 ? "4K video calls supported" :
             parseFloat(results.download) >= 25 ? "HD video calls supported" :
             parseFloat(results.download) >= 10 ? "SD video calls supported" : "May limit video quality"}
          </div>
        </div>

        {/* Upload Speed */}
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Speed
            </span>
            <Badge variant={getUploadColor(results.upload)}>
              {parseFloat(results.upload) >= 25 ? "Excellent" : 
               parseFloat(results.upload) >= 10 ? "Good" : 
               parseFloat(results.upload) >= 5 ? "Fair" : "Poor"}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.upload} Mbps
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {parseFloat(results.upload) >= 25 ? "High-quality video transmission" :
             parseFloat(results.upload) >= 10 ? "Good video transmission" :
             parseFloat(results.upload) >= 5 ? "Adequate transmission" : "May cause video issues"}
          </div>
        </div>

        {/* Latency */}
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Latency
            </span>
            <Badge variant={getLatencyColor(results.latency)}>
              {results.latency <= 50 ? "Excellent" : 
               results.latency <= 100 ? "Good" : 
               results.latency <= 200 ? "Fair" : "Poor"}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.latency}ms
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {results.latency <= 50 ? "Minimal delay" :
             results.latency <= 100 ? "Low delay" :
             results.latency <= 200 ? "Moderate delay" : "High delay"}
          </div>
        </div>

        {/* Jitter */}
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jitter
            </span>
            <Badge variant={getJitterColor(results.jitter)}>
              {results.jitter <= 10 ? "Excellent" : 
               results.jitter <= 20 ? "Good" : 
               results.jitter <= 50 ? "Fair" : "Poor"}
            </Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.jitter}ms
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {results.jitter <= 10 ? "Very stable" :
             results.jitter <= 20 ? "Stable" :
             results.jitter <= 50 ? "Some variation" : "Unstable"}
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      {(results.packetLossRate !== undefined || results.bandwidthScore) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Packet Loss Rate */}
          {results.packetLossRate !== undefined && (
            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Packet Loss Rate
                </span>
                <Badge variant={getPacketLossColor(results.packetLossRate)}>
                  {results.packetLossRate <= 1 ? "Excellent" : 
                   results.packetLossRate <= 3 ? "Good" : "Poor"}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.packetLossRate}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {results.packetLossRate <= 1 ? "Minimal packet loss" :
                 results.packetLossRate <= 3 ? "Low packet loss" : "High packet loss"}
              </div>
            </div>
          )}

          {/* Bandwidth Score */}
          {results.bandwidthScore && (
            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bandwidth Score
                </span>
                <Badge variant={parseFloat(results.bandwidthScore) >= 80 ? "success" : 
                               parseFloat(results.bandwidthScore) >= 60 ? "warning" : "danger"}>
                  {parseFloat(results.bandwidthScore) >= 80 ? "Excellent" : 
                   parseFloat(results.bandwidthScore) >= 60 ? "Good" : "Poor"}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.bandwidthScore}/100
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Combined download and upload performance
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 