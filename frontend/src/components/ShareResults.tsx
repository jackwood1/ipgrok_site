import { useState } from "react";
import { Button, Card } from "./ui";

interface ShareResultsProps {
  networkData: any;
  mediaData: any;
  systemData: any;
  quickTestData: any;
}

export function ShareResults({ networkData, mediaData, systemData, quickTestData }: ShareResultsProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const generateShareableReport = () => {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      summary: {
        networkQuality: quickTestData?.overallStatus || "Unknown",
        downloadSpeed: networkData?.speedTest?.download || "N/A",
        uploadSpeed: networkData?.speedTest?.upload || "N/A",
        latency: networkData?.speedTest?.latency || "N/A",
        connectionQuality: networkData?.speedTest?.connectionQuality || "N/A",
      },
      details: {
        network: networkData,
        media: mediaData,
        system: systemData,
        quickTest: quickTestData,
      }
    };

    // In a real implementation, you'd save this to a database and return a shareable URL
    // For now, we'll create a base64 encoded version for demo purposes
    const encodedData = btoa(JSON.stringify(report));
    const url = `${window.location.origin}${window.location.pathname}?report=${encodedData}`;
    setShareUrl(url);
    return url;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    const text = `Just tested my internet with ipgrok! 📊\n\n` +
      `Download: ${networkData?.speedTest?.download || 'N/A'} Mbps\n` +
      `Upload: ${networkData?.speedTest?.upload || 'N/A'} Mbps\n` +
      `Quality: ${networkData?.speedTest?.connectionQuality || 'N/A'}\n\n` +
      `Test your internet: ${window.location.origin}`;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const generateQRCode = () => {
    if (!shareUrl) {
      generateShareableReport();
    }
    setShowQR(true);
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      networkData,
      mediaData,
      systemData,
      quickTestData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `internet-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasData = networkData || mediaData || systemData || quickTestData;

  if (!hasData) {
    return (
      <Card title="Share Results" subtitle="Share your test results with others">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Run some tests first to generate shareable results.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Share Summary */}
      <Card title="Share Your Results" subtitle="Share your internet test results with others">
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {networkData?.speedTest?.download || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Download (Mbps)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {networkData?.speedTest?.upload || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upload (Mbps)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {networkData?.speedTest?.latency || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Latency (ms)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {networkData?.speedTest?.connectionQuality || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quality</div>
              </div>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Share on Social Media</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => shareOnSocialMedia('twitter')}
                variant="secondary"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                🐦 Twitter
              </Button>
              <Button
                onClick={() => shareOnSocialMedia('facebook')}
                variant="secondary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                📘 Facebook
              </Button>
              <Button
                onClick={() => shareOnSocialMedia('linkedin')}
                variant="secondary"
                size="sm"
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                💼 LinkedIn
              </Button>
              <Button
                onClick={() => shareOnSocialMedia('whatsapp')}
                variant="secondary"
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                💬 WhatsApp
              </Button>
            </div>
          </div>

          {/* Direct Link Sharing */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Share Direct Link</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl || "Click 'Generate Link' to create a shareable URL"}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <Button
                onClick={() => shareUrl ? copyToClipboard(shareUrl) : generateShareableReport()}
                variant="secondary"
                size="sm"
              >
                {shareUrl ? (copied ? '✅ Copied!' : '📋 Copy') : '🔗 Generate Link'}
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">QR Code</h4>
            <div className="flex items-center gap-4">
              <Button
                onClick={generateQRCode}
                variant="secondary"
                size="sm"
              >
                📱 Generate QR Code
              </Button>
              {showQR && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-sm text-gray-600">QR Code Placeholder</p>
                    <p className="text-xs text-gray-500">(Would show actual QR code)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download Options */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Download Report</h4>
            <div className="flex gap-2">
              <Button
                onClick={downloadReport}
                variant="secondary"
                size="sm"
              >
                📄 Download JSON
              </Button>
              <Button
                onClick={() => {/* CSV download logic */}}
                variant="secondary"
                size="sm"
              >
                📊 Download CSV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Embed Code */}
      <Card title="Embed Results" subtitle="Embed your results on your website or blog">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Copy this code to embed your test results on your website:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
{`<iframe 
  src="${window.location.origin}/embed?report=${shareUrl ? encodeURIComponent(shareUrl) : 'YOUR_REPORT_ID'}"
  width="100%" 
  height="400" 
  frameborder="0"
  title="Internet Test Results">
</iframe>`}
            </pre>
          </div>
          <Button
            onClick={() => copyToClipboard(`<iframe src="${window.location.origin}/embed?report=${shareUrl ? encodeURIComponent(shareUrl) : 'YOUR_REPORT_ID'}" width="100%" height="400" frameborder="0" title="Internet Test Results"></iframe>`)}
            variant="secondary"
            size="sm"
          >
            📋 Copy Embed Code
          </Button>
        </div>
      </Card>
    </div>
  );
} 