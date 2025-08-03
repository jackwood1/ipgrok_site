import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Badge } from "./ui";
export function NetworkMetrics({ results }) {
    const getStatusBadge = () => {
        if (results.error)
            return _jsx(Badge, { variant: "danger", children: "Test Failed" });
        const { download, upload, latency } = results;
        if (+download > 10 && +upload > 5 && latency < 100) {
            return _jsx(Badge, { variant: "success", children: "\u2705 Ready for HD video calls" });
        }
        else {
            return _jsx(Badge, { variant: "warning", children: "\u26A0\uFE0F Might have performance issues" });
        }
    };
    const getMetricColor = (value, thresholds) => {
        if (value >= thresholds.good)
            return "text-green-600 dark:text-green-400";
        if (value >= thresholds.warning)
            return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };
    if (results.error) {
        return (_jsx(Card, { title: "Test Results", className: "border-red-200 dark:border-red-800", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-red-600 dark:text-red-400 mb-2", children: results.error }), getStatusBadge()] }) }));
    }
    return (_jsxs(Card, { title: "Network Performance", subtitle: "Your connection analysis", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-2xl font-bold ${getMetricColor(+results.download, { good: 10, warning: 5 })}`, children: results.download }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Mbps" }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-500", children: "Download" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-2xl font-bold ${getMetricColor(+results.upload, { good: 5, warning: 2 })}`, children: results.upload }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Mbps" }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-500", children: "Upload" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-2xl font-bold ${getMetricColor(results.latency, { good: 50, warning: 100 })}`, children: results.latency }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "ms" }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-500", children: "Latency" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: `text-2xl font-bold ${getMetricColor(results.jitter, { good: 10, warning: 20 })}`, children: results.jitter }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "ms" }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-500", children: "Jitter" })] })] }), _jsx("div", { className: "flex justify-center", children: getStatusBadge() })] }));
}
