import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";
export function PingTest({ onDataUpdate }) {
    const [host, setHost] = useState("www.microsoft.com");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pingCount, setPingCount] = useState(4);
    // Update export data when results change
    useEffect(() => {
        if (onDataUpdate && results.length > 0) {
            const successRate = getSuccessRate();
            const averageTime = getAverageTime();
            onDataUpdate({
                host,
                results,
                successRate,
                averageTime,
            });
        }
    }, [results, host, onDataUpdate]);
    const pingHost = async (targetHost) => {
        const start = performance.now();
        try {
            // Use a simple GET request to measure round-trip time
            // We'll try to fetch a small resource or just test connectivity
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            const response = await fetch(`https://${targetHost}`, {
                method: 'HEAD', // Use HEAD to minimize data transfer
                mode: 'no-cors', // Allow cross-origin requests
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const end = performance.now();
            return {
                host: targetHost,
                time: Math.round(end - start),
                status: 'success'
            };
        }
        catch (error) {
            return {
                host: targetHost,
                time: 0,
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    };
    const runPingTest = async () => {
        setLoading(true);
        setResults([]);
        const newResults = [];
        for (let i = 0; i < pingCount; i++) {
            const result = await pingHost(host);
            newResults.push(result);
            setResults([...newResults]); // Update results after each ping
            // Small delay between pings
            if (i < pingCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        setLoading(false);
    };
    const getAverageTime = () => {
        const successfulPings = results.filter(r => r.status === 'success');
        if (successfulPings.length === 0)
            return 0;
        const total = successfulPings.reduce((sum, r) => sum + r.time, 0);
        return Math.round(total / successfulPings.length);
    };
    const getSuccessRate = () => {
        if (results.length === 0)
            return 0;
        const successful = results.filter(r => r.status === 'success').length;
        return Math.round((successful / results.length) * 100);
    };
    const getStatusBadge = () => {
        const successRate = getSuccessRate();
        if (successRate === 100)
            return _jsx(Badge, { variant: "success", children: "Excellent" });
        if (successRate >= 75)
            return _jsx(Badge, { variant: "warning", children: "Good" });
        return _jsx(Badge, { variant: "danger", children: "Poor" });
    };
    return (_jsx(Card, { title: "Ping Test", subtitle: "Test connectivity and response time to a host", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Host" }), _jsx("input", { type: "text", value: host, onChange: (e) => setHost(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "www.microsoft.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Number of Pings" }), _jsxs("select", { value: pingCount, onChange: (e) => setPingCount(Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: 1, children: "1 ping" }), _jsx("option", { value: 4, children: "4 pings" }), _jsx("option", { value: 8, children: "8 pings" }), _jsx("option", { value: 10, children: "10 pings" })] })] })] }), _jsx("div", { className: "text-center", children: _jsx(Button, { onClick: runPingTest, loading: loading, size: "lg", className: "w-full sm:w-auto", children: loading ? "Pinging..." : `Ping ${host}` }) }), results.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [getSuccessRate(), "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Success Rate" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [getAverageTime(), "ms"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Average Time" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "flex justify-center", children: getStatusBadge() }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Status" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-medium text-gray-900 dark:text-white mb-3", children: "Ping Results" }), _jsx("div", { className: "space-y-2", children: results.map((result, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["Ping #", index + 1] }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: result.host })] }), _jsx("div", { className: "flex items-center space-x-2", children: result.status === 'success' ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [result.time, "ms"] }), _jsx(Badge, { variant: "success", size: "sm", children: "OK" })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-sm text-gray-500", children: "timeout" }), _jsx(Badge, { variant: "danger", size: "sm", children: "Failed" })] })) })] }, index))) })] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsx("h5", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "Interpretation" }), _jsxs("div", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [_jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "0-50ms:" }), " Excellent connection"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "50-100ms:" }), " Good connection"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "100-200ms:" }), " Fair connection"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "200ms+:" }), " Poor connection"] }), _jsx("p", { className: "mt-2 text-xs", children: "Note: This test uses HTTP requests to simulate ping. Results may vary from traditional ICMP ping." })] })] })] }))] }) }));
}
