import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";
export function TracerouteTest({ onDataUpdate }) {
    const [host, setHost] = useState("www.microsoft.com");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxHops, setMaxHops] = useState(15);
    // Update export data when results change
    useEffect(() => {
        if (onDataUpdate && results.length > 0) {
            const successfulHops = results.filter(r => r.status === 'success').length;
            onDataUpdate({
                host,
                results,
                totalHops: results.length,
                successfulHops,
            });
        }
    }, [results, host, onDataUpdate]);
    const resolveIP = async (hostname) => {
        try {
            // Try to resolve IP using a DNS lookup service
            const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
                return data.Answer[0].data;
            }
            // Fallback: try to get IP from the hostname itself
            return hostname;
        }
        catch {
            // If DNS resolution fails, return the hostname
            return hostname;
        }
    };
    const getFQDN = async (ip, originalHost) => {
        try {
            // Try reverse DNS lookup
            const response = await fetch(`https://dns.google/resolve?name=${ip}&type=PTR`);
            const data = await response.json();
            if (data.Answer && data.Answer.length > 0) {
                return data.Answer[0].data.replace(/\.$/, ''); // Remove trailing dot
            }
            // If no PTR record, return the original hostname or IP
            return originalHost !== ip ? originalHost : ip;
        }
        catch {
            // If reverse lookup fails, return the original hostname or IP
            return originalHost !== ip ? originalHost : ip;
        }
    };
    const simulateHop = async (targetHost, hopNumber) => {
        const start = performance.now();
        const timeout = hopNumber * 1000; // Increase timeout for each hop
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const response = await fetch(`https://${targetHost}`, {
                method: 'HEAD',
                mode: 'no-cors',
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            const end = performance.now();
            // Resolve IP and FQDN
            const ip = await resolveIP(targetHost);
            const fqdn = await getFQDN(ip, targetHost);
            return {
                hop: hopNumber,
                host: targetHost,
                ip,
                fqdn,
                time: Math.round(end - start),
                status: 'success'
            };
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // For timeout, still try to resolve IP and FQDN
                const ip = await resolveIP(targetHost);
                const fqdn = await getFQDN(ip, targetHost);
                return {
                    hop: hopNumber,
                    host: targetHost,
                    ip,
                    fqdn,
                    time: timeout,
                    status: 'timeout'
                };
            }
            // For other errors, still try to resolve IP and FQDN
            const ip = await resolveIP(targetHost);
            const fqdn = await getFQDN(ip, targetHost);
            return {
                hop: hopNumber,
                host: targetHost,
                ip,
                fqdn,
                time: 0,
                status: 'error'
            };
        }
    };
    const runTraceroute = async () => {
        setLoading(true);
        setResults([]);
        const newResults = [];
        // Simulate traceroute by testing with different timeout values
        // This is a simplified version that simulates the concept
        for (let hop = 1; hop <= maxHops; hop++) {
            const result = await simulateHop(host, hop);
            newResults.push(result);
            setResults([...newResults]); // Update results after each hop
            // If we reach the destination, stop
            if (result.status === 'success' && hop > 1) {
                break;
            }
            // Small delay between hops
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        setLoading(false);
    };
    const getTotalTime = () => {
        const successfulHops = results.filter(r => r.status === 'success');
        if (successfulHops.length === 0)
            return 0;
        return successfulHops.reduce((sum, r) => sum + r.time, 0);
    };
    const getHopsReached = () => {
        return results.filter(r => r.status === 'success').length;
    };
    const getStatusBadge = () => {
        const successfulHops = results.filter(r => r.status === 'success').length;
        if (successfulHops === 0)
            return _jsx(Badge, { variant: "danger", children: "Failed" });
        if (successfulHops >= maxHops)
            return _jsx(Badge, { variant: "success", children: "Complete" });
        return _jsx(Badge, { variant: "warning", children: "Partial" });
    };
    const formatTime = (time) => {
        if (time === 0)
            return '--';
        return `${time}ms`;
    };
    const getHopStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✅';
            case 'timeout': return '⏱️';
            case 'error': return '❌';
            default: return '❓';
        }
    };
    const isIPAddress = (str) => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(str);
    };
    return (_jsx(Card, { title: "Traceroute Test", subtitle: "Trace the network path to a host", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Host" }), _jsx("input", { type: "text", value: host, onChange: (e) => setHost(e.target.value), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "www.microsoft.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Max Hops" }), _jsxs("select", { value: maxHops, onChange: (e) => setMaxHops(Number(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: 10, children: "10 hops" }), _jsx("option", { value: 15, children: "15 hops" }), _jsx("option", { value: 20, children: "20 hops" }), _jsx("option", { value: 30, children: "30 hops" })] })] })] }), _jsx("div", { className: "text-center", children: _jsx(Button, { onClick: runTraceroute, loading: loading, size: "lg", className: "w-full sm:w-auto", children: loading ? "Tracing..." : `Trace Route to ${host}` }) }), results.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: getHopsReached() }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Hops Reached" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: formatTime(getTotalTime()) }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Time" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: results.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total Hops" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "flex justify-center", children: getStatusBadge() }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Status" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-medium text-gray-900 dark:text-white mb-3", children: "Route Path" }), _jsx("div", { className: "space-y-2", children: results.map((result, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white min-w-[3rem]", children: result.hop }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm text-gray-900 dark:text-white font-medium", children: result.fqdn }), result.ip !== result.fqdn && (_jsx("span", { className: "text-xs text-gray-500 dark:text-gray-500 font-mono", children: result.ip }))] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: formatTime(result.time) }), _jsx("span", { className: "text-lg", children: getHopStatusIcon(result.status) })] })] }, index))) })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h5", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Legend" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900 dark:text-white mb-1", children: "Display Format" }), _jsxs("div", { children: ["\u2022 ", _jsx("strong", { children: "FQDN:" }), " Fully Qualified Domain Name"] }), _jsxs("div", { children: ["\u2022 ", _jsx("strong", { children: "IP:" }), " Resolved IP address (shown below FQDN)"] })] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900 dark:text-white mb-1", children: "Status Icons" }), _jsx("div", { children: "\u2022 \u2705 Success: Hop responded successfully" }), _jsx("div", { children: "\u2022 \u23F1\uFE0F Timeout: Hop timed out" }), _jsx("div", { children: "\u2022 \u274C Error: Hop failed to respond" })] })] })] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsx("h5", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "About This Traceroute" }), _jsxs("div", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [_jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Hop Number:" }), " Each step in the network path"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "FQDN:" }), " Human-readable domain name for each hop"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "IP Address:" }), " Numerical IP address (shown when different from FQDN)"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Response Time:" }), " Time to reach each hop"] }), _jsxs("p", { children: ["\u2022 ", _jsx("strong", { children: "Status Icons:" }), " Visual indicators for hop status"] }), _jsx("p", { className: "mt-2 text-xs", children: "Note: This is a simulated traceroute using HTTP requests. Real traceroute uses ICMP packets and shows actual network hops." })] })] })] }))] }) }));
}
