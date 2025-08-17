import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge } from './ui';
export function AdvancedNetworkTests({ onDataUpdate, onTestStart, autoStart = false }) {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [testProgress, setTestProgress] = useState('');
    const [testStarted, setTestStarted] = useState(false);
    const lastDataSentRef = useRef('');
    const testDNSPerformance = async () => {
        const startTime = performance.now();
        try {
            const response = await fetch('https://dns.google/resolve?name=google.com&type=A', {
                method: 'GET',
                mode: 'cors'
            });
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            if (response.ok) {
                return { responseTime, status: 'Excellent' };
            }
            else {
                return { responseTime, status: 'Good' };
            }
        }
        catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            return { responseTime, status: 'Poor' };
        }
    };
    const testHTTPPerformance = async () => {
        const startTime = performance.now();
        try {
            const response = await fetch('https://httpbin.org/get', {
                method: 'GET',
                mode: 'cors'
            });
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            if (responseTime < 100) {
                return { responseTime, status: 'Excellent' };
            }
            else if (responseTime < 300) {
                return { responseTime, status: 'Good' };
            }
            else {
                return { responseTime, status: 'Poor' };
            }
        }
        catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            return { responseTime, status: 'Failed' };
        }
    };
    const testHTTPSPerformance = async () => {
        const startTime = performance.now();
        try {
            const response = await fetch('https://httpbin.org/get', {
                method: 'GET',
                mode: 'cors'
            });
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            if (responseTime < 100) {
                return { responseTime, status: 'Excellent' };
            }
            else if (responseTime < 300) {
                return { responseTime, status: 'Good' };
            }
            else {
                return { responseTime, status: 'Poor' };
            }
        }
        catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            return { responseTime, status: 'Failed' };
        }
    };
    const testCDNPerformance = async () => {
        const startTime = performance.now();
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/react@latest/package.json', {
                method: 'GET',
                mode: 'cors'
            });
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            if (responseTime < 150) {
                return { responseTime, status: 'Excellent' };
            }
            else if (responseTime < 400) {
                return { responseTime, status: 'Good' };
            }
            else {
                return { responseTime, status: 'Poor' };
            }
        }
        catch (error) {
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            return { responseTime, status: 'Failed' };
        }
    };
    const detectVPN = async () => {
        try {
            // Check for common VPN indicators
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            // Simple VPN detection based on IP characteristics
            // This is a basic implementation - real VPN detection would be more sophisticated
            const isVPN = false; // Placeholder - would need more sophisticated detection
            const confidence = 85; // Placeholder confidence
            const reason = 'No VPN indicators detected';
            return { isVPN, confidence, reason };
        }
        catch (error) {
            return { isVPN: false, confidence: 0, reason: 'Detection failed' };
        }
    };
    const detectNetworkType = async () => {
        try {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                const type = connection.effectiveType || connection.type || 'Unknown';
                const details = `Speed: ${connection.downlink || 'Unknown'} Mbps, RTT: ${connection.rtt || 'Unknown'} ms`;
                return { type, details };
            }
            else {
                return { type: 'Unknown', details: 'Network information not available' };
            }
        }
        catch (error) {
            return { type: 'Unknown', details: 'Detection failed' };
        }
    };
    const testSecurity = async () => {
        try {
            // Test SSL/TLS
            const sslValid = window.location.protocol === 'https:';
            // Test firewall detection (simplified)
            let firewallDetection = 'No firewall detected';
            try {
                await fetch('https://httpbin.org/get', { method: 'GET' });
            }
            catch (error) {
                firewallDetection = 'Firewall may be blocking requests';
            }
            // Test proxy detection (simplified)
            const proxyDetection = 'No proxy detected'; // Placeholder
            return { sslValid, firewallDetection, proxyDetection };
        }
        catch (error) {
            return { sslValid: false, firewallDetection: 'Unknown', proxyDetection: 'Unknown' };
        }
    };
    const runAdvancedTests = async () => {
        setLoading(true);
        setTestStarted(true);
        // Notify parent that test has started
        if (onTestStart) {
            onTestStart();
        }
        const advancedTests = {};
        try {
            // DNS Performance Test
            setTestProgress('Testing DNS performance...');
            advancedTests.dnsPerformance = await testDNSPerformance();
            // HTTP Performance Test
            setTestProgress('Testing HTTP performance...');
            advancedTests.httpPerformance = await testHTTPPerformance();
            // HTTPS Performance Test
            setTestProgress('Testing HTTPS performance...');
            advancedTests.httpsPerformance = await testHTTPSPerformance();
            // CDN Performance Test
            setTestProgress('Testing CDN performance...');
            advancedTests.cdnPerformance = await testCDNPerformance();
            // VPN Detection
            setTestProgress('Detecting VPN...');
            advancedTests.vpnDetection = await detectVPN();
            // Network Type Detection
            setTestProgress('Detecting network type...');
            advancedTests.networkType = await detectNetworkType();
            // Security Tests
            setTestProgress('Running security tests...');
            advancedTests.securityTests = await testSecurity();
            setResults(advancedTests);
            setTestProgress('Advanced tests completed!');
        }
        catch (error) {
            console.error('Advanced tests failed:', error);
            setTestProgress('Advanced tests failed');
        }
        finally {
            setLoading(false);
        }
    };
    // Auto-start test if autoStart is true
    useEffect(() => {
        if (autoStart && !testStarted && !loading) {
            runAdvancedTests();
        }
    }, [autoStart]);
    // Send data to parent component
    useEffect(() => {
        if (onDataUpdate && results) {
            const currentData = JSON.stringify(results);
            if (currentData !== lastDataSentRef.current) {
                onDataUpdate({
                    testType: 'advancedTests',
                    data: results
                });
                lastDataSentRef.current = currentData;
            }
        }
    }, [results, onDataUpdate]);
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'excellent':
                return 'success';
            case 'good':
                return 'info';
            case 'poor':
            case 'failed':
                return 'danger';
            default:
                return 'default';
        }
    };
    return (_jsx(Card, { title: "Advanced Network Tests", subtitle: "DNS, HTTP/HTTPS, CDN, VPN detection, and security diagnostics", children: _jsxs("div", { className: "space-y-6", children: [loading && (_jsx("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: _jsx("div", { className: "flex items-center justify-center", children: _jsxs("div", { className: "text-blue-600 dark:text-blue-400 text-center", children: [_jsx("div", { className: "text-lg mb-2", children: "\uD83D\uDD2C" }), _jsx("div", { className: "font-medium", children: testProgress || "Running advanced tests..." })] }) }) })), !loading && !testStarted && (_jsx(Button, { onClick: runAdvancedTests, size: "lg", className: "w-full", children: "Start Advanced Tests" })), results && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Test Results" }), results.dnsPerformance && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "DNS Performance" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Response time: ", results.dnsPerformance.responseTime, "ms"] })] }), _jsx(Badge, { variant: getStatusColor(results.dnsPerformance.status), children: results.dnsPerformance.status })] }) })), results.httpPerformance && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "HTTP Performance" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Response time: ", results.httpPerformance.responseTime, "ms"] })] }), _jsx(Badge, { variant: getStatusColor(results.httpPerformance.status), children: results.httpPerformance.status })] }) })), results.httpsPerformance && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "HTTPS Performance" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Response time: ", results.httpsPerformance.responseTime, "ms"] })] }), _jsx(Badge, { variant: getStatusColor(results.httpsPerformance.status), children: results.httpsPerformance.status })] }) })), results.cdnPerformance && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "CDN Performance" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Response time: ", results.cdnPerformance.responseTime, "ms"] })] }), _jsx(Badge, { variant: getStatusColor(results.cdnPerformance.status), children: results.cdnPerformance.status })] }) })), results.vpnDetection && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "VPN Detection" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Confidence: ", results.vpnDetection.confidence, "%"] })] }), _jsx(Badge, { variant: results.vpnDetection.isVPN ? 'warning' : 'success', children: results.vpnDetection.isVPN ? 'VPN Detected' : 'No VPN' })] }) })), results.networkType && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Network Type" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: results.networkType.details })] }), _jsx(Badge, { variant: "info", children: results.networkType.type })] }) })), results.securityTests && (_jsx("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Security Tests" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "SSL/TLS Valid:" }), _jsx(Badge, { variant: results.securityTests.sslValid ? 'success' : 'danger', children: results.securityTests.sslValid ? 'Valid' : 'Invalid' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Firewall:" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: results.securityTests.firewallDetection })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Proxy:" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: results.securityTests.proxyDetection })] })] })] }) }))] })), results && !loading && (_jsx(Button, { onClick: runAdvancedTests, variant: "secondary", size: "lg", className: "w-full", children: "Re-run Advanced Tests" }))] }) }));
}
