import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "./ui";
export function NetworkMetrics({ results }) {
    const getDownloadColor = (speed) => {
        const numSpeed = parseFloat(speed);
        if (numSpeed >= 50)
            return "success";
        if (numSpeed >= 25)
            return "info";
        if (numSpeed >= 10)
            return "warning";
        return "danger";
    };
    const getUploadColor = (speed) => {
        const numSpeed = parseFloat(speed);
        if (numSpeed >= 25)
            return "success";
        if (numSpeed >= 10)
            return "info";
        if (numSpeed >= 5)
            return "warning";
        return "danger";
    };
    const getLatencyColor = (latency) => {
        if (latency <= 50)
            return "success";
        if (latency <= 100)
            return "info";
        if (latency <= 200)
            return "warning";
        return "danger";
    };
    const getJitterColor = (jitter) => {
        if (jitter <= 10)
            return "success";
        if (jitter <= 20)
            return "info";
        if (jitter <= 50)
            return "warning";
        return "danger";
    };
    const getPacketLossColor = (lossRate) => {
        if (lossRate <= 1)
            return "success";
        if (lossRate <= 3)
            return "warning";
        return "danger";
    };
    if (results.error) {
        return (_jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "danger", className: "mr-2", children: "\u274C" }), _jsx("span", { className: "text-red-800 dark:text-red-200", children: results.error })] }) }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Network Performance Metrics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Download Speed" }), _jsx(Badge, { variant: getDownloadColor(results.download), children: parseFloat(results.download) >= 50 ? "Excellent" :
                                            parseFloat(results.download) >= 25 ? "Good" :
                                                parseFloat(results.download) >= 10 ? "Fair" : "Poor" })] }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [results.download, " Mbps"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: parseFloat(results.download) >= 50 ? "4K video calls supported" :
                                    parseFloat(results.download) >= 25 ? "HD video calls supported" :
                                        parseFloat(results.download) >= 10 ? "SD video calls supported" : "May limit video quality" })] }), _jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Upload Speed" }), _jsx(Badge, { variant: getUploadColor(results.upload), children: parseFloat(results.upload) >= 25 ? "Excellent" :
                                            parseFloat(results.upload) >= 10 ? "Good" :
                                                parseFloat(results.upload) >= 5 ? "Fair" : "Poor" })] }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [results.upload, " Mbps"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: parseFloat(results.upload) >= 25 ? "High-quality video transmission" :
                                    parseFloat(results.upload) >= 10 ? "Good video transmission" :
                                        parseFloat(results.upload) >= 5 ? "Adequate transmission" : "May cause video issues" })] }), _jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Latency" }), _jsx(Badge, { variant: getLatencyColor(results.latency), children: results.latency <= 50 ? "Excellent" :
                                            results.latency <= 100 ? "Good" :
                                                results.latency <= 200 ? "Fair" : "Poor" })] }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [results.latency, "ms"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: results.latency <= 50 ? "Minimal delay" :
                                    results.latency <= 100 ? "Low delay" :
                                        results.latency <= 200 ? "Moderate delay" : "High delay" })] }), _jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Jitter" }), _jsx(Badge, { variant: getJitterColor(results.jitter), children: results.jitter <= 10 ? "Excellent" :
                                            results.jitter <= 20 ? "Good" :
                                                results.jitter <= 50 ? "Fair" : "Poor" })] }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [results.jitter, "ms"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: results.jitter <= 10 ? "Very stable" :
                                    results.jitter <= 20 ? "Stable" :
                                        results.jitter <= 50 ? "Some variation" : "Unstable" })] })] }), (results.packetLossRate !== undefined || results.bandwidthScore) && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [results.packetLossRate !== undefined && (_jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Packet Loss Rate" }), _jsx(Badge, { variant: getPacketLossColor(results.packetLossRate), children: results.packetLossRate <= 1 ? "Excellent" :
                                            results.packetLossRate <= 3 ? "Good" : "Poor" })] }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [results.packetLossRate, "%"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: results.packetLossRate <= 1 ? "Minimal packet loss" :
                                    results.packetLossRate <= 3 ? "Low packet loss" : "High packet loss" })] })), results.bandwidthScore && (_jsxs("div", { className: "p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Bandwidth Score" }), _jsx(Badge, { variant: parseFloat(results.bandwidthScore) >= 80 ? "success" :
                                            parseFloat(results.bandwidthScore) >= 60 ? "warning" : "danger", children: parseFloat(results.bandwidthScore) >= 80 ? "Excellent" :
                                            parseFloat(results.bandwidthScore) >= 60 ? "Good" : "Poor" })] }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [results.bandwidthScore, "/100"] }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Combined download and upload performance" })] }))] }))] }));
}
