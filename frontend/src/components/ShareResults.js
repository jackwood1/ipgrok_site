import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Card } from "./ui";
export function ShareResults({ networkData, mediaData, systemData }) {
    const [shareUrl, setShareUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);
    const generateShareableReport = () => {
        const timestamp = new Date().toISOString();
        const report = {
            timestamp,
            summary: {
                networkQuality: "Unknown",
                downloadSpeed: networkData?.speedTest?.download || "N/A",
                uploadSpeed: networkData?.speedTest?.upload || "N/A",
                latency: networkData?.speedTest?.latency || "N/A",
                connectionQuality: networkData?.speedTest?.connectionQuality || "N/A",
            },
            details: {
                network: networkData,
                media: mediaData,
                system: systemData,
            }
        };
        // In a real implementation, you'd save this to a database and return a shareable URL
        // For now, we'll create a base64 encoded version for demo purposes
        const encodedData = btoa(JSON.stringify(report));
        const url = `${window.location.origin}${window.location.pathname}?report=${encodedData}`;
        setShareUrl(url);
        return url;
    };
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error('Failed to copy: ', err);
        }
    };
    const shareOnSocialMedia = (platform) => {
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
        window.open(urls[platform], '_blank');
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
    const hasData = networkData || mediaData || systemData;
    if (!hasData) {
        return (_jsx(Card, { title: "Share Results", subtitle: "Share your test results with others", children: _jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Run some tests first to generate shareable results." }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { title: "Share Your Results", subtitle: "Share your internet test results with others", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Test Summary" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: networkData?.speedTest?.download || 'N/A' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Download (Mbps)" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: networkData?.speedTest?.upload || 'N/A' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Upload (Mbps)" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: networkData?.speedTest?.latency || 'N/A' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Latency (ms)" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600 dark:text-orange-400", children: networkData?.speedTest?.connectionQuality || 'N/A' }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Quality" })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-3", children: "Share on Social Media" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { onClick: () => shareOnSocialMedia('twitter'), variant: "secondary", size: "sm", className: "bg-blue-500 hover:bg-blue-600 text-white", children: "\uD83D\uDC26 Twitter" }), _jsx(Button, { onClick: () => shareOnSocialMedia('facebook'), variant: "secondary", size: "sm", className: "bg-blue-600 hover:bg-blue-700 text-white", children: "\uD83D\uDCD8 Facebook" }), _jsx(Button, { onClick: () => shareOnSocialMedia('linkedin'), variant: "secondary", size: "sm", className: "bg-blue-700 hover:bg-blue-800 text-white", children: "\uD83D\uDCBC LinkedIn" }), _jsx(Button, { onClick: () => shareOnSocialMedia('whatsapp'), variant: "secondary", size: "sm", className: "bg-green-500 hover:bg-green-600 text-white", children: "\uD83D\uDCAC WhatsApp" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-3", children: "Share Direct Link" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: shareUrl || "Click 'Generate Link' to create a shareable URL", readOnly: true, className: "flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" }), _jsx(Button, { onClick: () => shareUrl ? copyToClipboard(shareUrl) : generateShareableReport(), variant: "secondary", size: "sm", children: shareUrl ? (copied ? '✅ Copied!' : '📋 Copy') : '🔗 Generate Link' })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-3", children: "QR Code" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { onClick: generateQRCode, variant: "secondary", size: "sm", children: "\uD83D\uDCF1 Generate QR Code" }), showQR && (_jsx("div", { className: "p-4 bg-white border border-gray-200 rounded-lg", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-6xl mb-2", children: "\uD83D\uDCF1" }), _jsx("p", { className: "text-sm text-gray-600", children: "QR Code Placeholder" }), _jsx("p", { className: "text-xs text-gray-500", children: "(Would show actual QR code)" })] }) }))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-3", children: "Download Report" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: downloadReport, variant: "secondary", size: "sm", children: "\uD83D\uDCC4 Download JSON" }), _jsx(Button, { onClick: () => { }, variant: "secondary", size: "sm", children: "\uD83D\uDCCA Download CSV" })] })] })] }) }), _jsx(Card, { title: "Embed Results", subtitle: "Embed your results on your website or blog", children: _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Copy this code to embed your test results on your website:" }), _jsx("div", { className: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg", children: _jsx("pre", { className: "text-xs text-gray-800 dark:text-gray-200 overflow-x-auto", children: `<iframe 
  src="${window.location.origin}/embed?report=${shareUrl ? encodeURIComponent(shareUrl) : 'YOUR_REPORT_ID'}"
  width="100%" 
  height="400" 
  frameborder="0"
  title="Internet Test Results">
</iframe>` }) }), _jsx(Button, { onClick: () => copyToClipboard(`<iframe src="${window.location.origin}/embed?report=${shareUrl ? encodeURIComponent(shareUrl) : 'YOUR_REPORT_ID'}" width="100%" height="400" frameborder="0" title="Internet Test Results"></iframe>`), variant: "secondary", size: "sm", children: "\uD83D\uDCCB Copy Embed Code" })] }) })] }));
}
