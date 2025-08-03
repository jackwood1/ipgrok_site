import { TestResults } from "../types";
import { Card, Badge } from "./ui";

interface NetworkMetricsProps {
  results: TestResults;
}

export function NetworkMetrics({ results }: NetworkMetricsProps) {
  const getStatusBadge = () => {
    if (results.error) return <Badge variant="danger">Test Failed</Badge>;
    
    const { download, upload, latency } = results;
    if (+download > 10 && +upload > 5 && latency < 100) {
      return <Badge variant="success">✅ Ready for HD video calls</Badge>;
    } else {
      return <Badge variant="warning">⚠️ Might have performance issues</Badge>;
    }
  };

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "text-green-600 dark:text-green-400";
    if (value >= thresholds.warning) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (results.error) {
    return (
      <Card title="Test Results" className="border-red-200 dark:border-red-800">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">{results.error}</p>
          {getStatusBadge()}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Network Performance" subtitle="Your connection analysis">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getMetricColor(+results.download, { good: 10, warning: 5 })}`}>
            {results.download}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mbps</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Download</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${getMetricColor(+results.upload, { good: 5, warning: 2 })}`}>
            {results.upload}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mbps</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Upload</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${getMetricColor(results.latency, { good: 50, warning: 100 })}`}>
            {results.latency}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">ms</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Latency</div>
        </div>
        
        <div className="text-center">
          <div className={`text-2xl font-bold ${getMetricColor(results.jitter, { good: 10, warning: 20 })}`}>
            {results.jitter}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">ms</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">Jitter</div>
        </div>
      </div>
      
      <div className="flex justify-center">
        {getStatusBadge()}
      </div>
    </Card>
  );
} 