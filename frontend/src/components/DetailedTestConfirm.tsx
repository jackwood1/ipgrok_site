import { Card, Button } from "./ui";

interface DetailedTestConfirmProps {
  resetPrevious: boolean;
  onResetPreviousChange: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DetailedTestConfirm({ 
  resetPrevious, 
  onResetPreviousChange, 
  onConfirm, 
  onCancel 
}: DetailedTestConfirmProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Detailed Analysis Setup" subtitle="Configure your test preferences">
        <div className="space-y-6">
          {/* Description */}
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Ready for Detailed Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This comprehensive test will analyze your network performance, media capabilities, 
              and system information. The test takes approximately 2-3 minutes to complete.
            </p>
          </div>

          {/* Test Overview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
              Tests Included:
            </h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>Network Speed Test (Download, Upload, Latency, Advanced Tests)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📹</span>
                <span>Media Quality Test (Camera, Microphone, Video Recording)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💻</span>
                <span>System Information (Device Specs, Browser Info)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏓</span>
                <span>Ping Test (Connectivity Analysis)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛣️</span>
                <span>Traceroute Test (Network Path Analysis)</span>
              </div>
            </div>
          </div>

          {/* Reset Option */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="resetPrevious"
                checked={resetPrevious}
                onChange={(e) => onResetPreviousChange(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="resetPrevious" className="text-sm font-medium text-gray-900 dark:text-white">
                  Reset Previous Test Results
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {resetPrevious 
                    ? "Previous test results will be cleared and this will be a fresh test run."
                    : "Previous test results will be preserved and new results will be added to existing data."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onConfirm}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              🚀 Start Detailed Analysis
            </Button>
            <Button
              onClick={onCancel}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              ↩️ Back to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              💡 Tip: Keep previous results if you want to compare with new tests, 
              or reset for a clean analysis.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 