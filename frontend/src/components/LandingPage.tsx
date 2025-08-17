import { Button } from "./ui";

interface LandingPageProps {
  onStartQuickTest: () => void;
  onStartDetailedTest: () => void;
  onStartManualTest: () => void;
  onShowAbout?: () => void;
  onShowContact?: () => void;
}

export function LandingPage({ onStartQuickTest, onStartDetailedTest, onStartManualTest, onShowAbout, onShowContact }: LandingPageProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Test Your Internet Like a Pro
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Get comprehensive insights into your internet performance, media capabilities, and network health. 
          Perfect for video calls, gaming, streaming, and remote work.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStartQuickTest}
            variant="primary"
            size="lg"
            className="text-lg px-8 py-4"
          >
            🚀 Quick Test (30 seconds)
          </Button>
          <Button
            onClick={onStartDetailedTest}
            variant="success"
            size="lg"
            className="text-lg px-8 py-4"
          >
            🔍 Detailed Analysis (2-3 minutes)
          </Button>
          <Button
            onClick={onStartManualTest}
            variant="info"
            size="lg"
            className="text-lg px-8 py-4"
          >
            ⚙️ Manual Test
          </Button>
        </div>
        

      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Network Performance
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Speed tests, latency analysis, packet loss detection, and advanced network diagnostics
          </p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">📹</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Media Quality
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Camera and microphone testing, video recording, codec support, and quality assessment
          </p>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Share Results
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Export detailed reports, email results, and share with your team or ISP
          </p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Perfect For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">💼</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Remote Work</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Video calls, file uploads</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎮</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Gaming</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Latency, packet loss</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📺</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Streaming</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bandwidth, quality</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏠</div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Home Internet</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">ISP performance</p>
          </div>
        </div>
      </div>

      {/* Testimonials/Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10+</div>
          <div className="text-gray-600 dark:text-gray-400">Network Tests</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">5+</div>
          <div className="text-gray-600 dark:text-gray-400">Media Tests</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</div>
          <div className="text-gray-600 dark:text-gray-400">Export Formats</div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Test Your Internet?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get started in under 30 seconds with our quick test, or dive deep with comprehensive analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStartQuickTest}
            size="lg"
            className="text-lg px-8 py-4"
          >
            Start Quick Test
          </Button>
          <Button
            onClick={onStartDetailedTest}
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-4"
          >
            Start Detailed Test
          </Button>
        </div>
      </div>
    </div>
  );
} 