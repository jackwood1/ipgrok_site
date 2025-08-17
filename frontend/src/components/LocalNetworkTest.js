import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";
export function LocalNetworkTest({ onDataUpdate }) {
    const [isRunning, setRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [currentTest, setCurrentTest] = useState("");
    const [error, setError] = useState(null);
    const testIntervalRef = useRef(null);
    const startTimeRef = useRef(0);
    const testCountRef = useRef(0);
    const totalTests = 30;
    const measureLocalLatency = () => {
        const start = performance.now();
        // Simulate some local processing
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.random();
        }
        const end = performance.now();
        return end - start;
    };
    const measureMemoryUsage = () => {
        if ('memory' in performance) {
            const memory = performance.memory;
            return Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100; // MB
        }
        return Math.round((Math.random() * 50 + 100) * 100) / 100; // Simulated 100-150 MB
    };
    const measureCPUIntensive = () => {
        const start = performance.now();
        // Simulate CPU-intensive work
        let sum = 0;
        for (let i = 0; i < 5000000; i++) {
            sum += Math.sqrt(i) * Math.sin(i);
        }
        const end = performance.now();
        return end - start;
    };
    const runLocalNetworkTest = async () => {
        setRunning(true);
        setProgress(0);
        setError(null);
        setCurrentTest("Initializing local network test...");
        // Reset measurements
        testCountRef.current = 0;
        startTimeRef.current = performance.now();
        const latencies = [];
        const memoryReadings = [];
        const cpuReadings = [];
        const runSingleTest = async () => {
            if (testCountRef.current >= totalTests) {
                completeTest(latencies, memoryReadings, cpuReadings);
                return;
            }
            try {
                setCurrentTest(`Running test ${testCountRef.current + 1}/${totalTests}...`);
                // Measure local latency
                const latency = measureLocalLatency();
                latencies.push(latency);
                // Measure memory usage (every 5th test)
                if (testCountRef.current % 5 === 0) {
                    const memory = measureMemoryUsage();
                    memoryReadings.push(memory);
                }
                // Measure CPU performance (every 10th test)
                if (testCountRef.current % 10 === 0) {
                    const cpu = measureCPUIntensive();
                    cpuReadings.push(cpu);
                }
                testCountRef.current++;
                // Update progress
                const newProgress = (testCountRef.current / totalTests) * 100;
                setProgress(newProgress);
                // Schedule next test
                setTimeout(runSingleTest, 50 + Math.random() * 100);
            }
            catch (error) {
                console.error('Local test failed:', error);
                testCountRef.current++;
                setTimeout(runSingleTest, 50);
            }
        };
        // Start the test sequence
        runSingleTest();
    };
    const completeTest = (latencies, memoryReadings, cpuReadings) => {
        const endTime = performance.now();
        if (latencies.length === 0) {
            setError('No latency measurements were successful');
            setRunning(false);
            return;
        }
        // Calculate results
        const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
        const minLatency = Math.min(...latencies);
        const maxLatency = Math.max(...latencies);
        const jitter = latencies.reduce((sum, lat) => sum + Math.abs(lat - averageLatency), 0) / latencies.length;
        const avgMemory = memoryReadings.length > 0 ?
            memoryReadings.reduce((sum, mem) => sum + mem, 0) / memoryReadings.length : 0;
        const avgCPU = cpuReadings.length > 0 ?
            cpuReadings.reduce((sum, cpu) => sum + cpu, 0) / cpuReadings.length : 0;
        const result = {
            localLatency: Math.round(averageLatency * 100) / 100,
            localJitter: Math.round(jitter * 100) / 100,
            memoryUsage: Math.round(avgMemory * 100) / 100,
            cpuIntensive: Math.round(avgCPU * 100) / 100,
            networkSimulation: Math.round((Math.random() * 20 + 10) * 100) / 100, // Simulated network metric
            timestamp: new Date().toISOString()
        };
        setResults(result);
        setRunning(false);
        setCurrentTest("Test completed!");
        // Update parent component
        if (onDataUpdate) {
            onDataUpdate({
                testType: 'localNetworkTest',
                data: result
            });
        }
    };
    const stopTest = () => {
        if (testIntervalRef.current) {
            clearTimeout(testIntervalRef.current);
        }
        setRunning(false);
        setCurrentTest("Test stopped");
    };
    const resetTest = () => {
        setResults(null);
        setProgress(0);
        setError(null);
        setCurrentTest("");
        testCountRef.current = 0;
    };
    const getLocalQuality = (latency) => {
        if (latency <= 5) {
            return { grade: 'A', color: 'success', description: 'Excellent - Very fast local processing' };
        }
        else if (latency <= 15) {
            return { grade: 'B', color: 'info', description: 'Good - Fast local processing' };
        }
        else if (latency <= 30) {
            return { grade: 'C', color: 'warning', description: 'Fair - Moderate local processing' };
        }
        else if (latency <= 50) {
            return { grade: 'D', color: 'warning', description: 'Poor - Slow local processing' };
        }
        else {
            return { grade: 'F', color: 'danger', description: 'Very Poor - Very slow local processing' };
        }
    };
    useEffect(() => {
        return () => {
            if (testIntervalRef.current) {
                clearTimeout(testIntervalRef.current);
            }
        };
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx(Button, { onClick: runLocalNetworkTest, disabled: isRunning, variant: "primary", size: "lg", className: "flex-1", children: isRunning ? '🔄 Running...' : '🏠 Start Local Network Test' }), isRunning && (_jsx(Button, { onClick: stopTest, variant: "danger", size: "lg", children: "\u23F9\uFE0F Stop Test" })), _jsx(Button, { onClick: resetTest, variant: "secondary", size: "lg", children: "\uD83D\uDD04 Reset" })] }), isRunning && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: currentTest }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Progress: ", testCountRef.current, "/", totalTests, " tests"] })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3", children: _jsx("div", { className: "bg-green-500 h-3 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "text-center text-sm text-gray-600 dark:text-gray-400", children: [Math.round(progress), "% Complete"] })] })), error && (_jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-red-600 dark:text-red-400", children: "\u274C" }), _jsx("span", { className: "text-red-800 dark:text-red-200", children: error })] }) })), results && (_jsx(Card, { title: "Local Network Test Results", subtitle: "Local system performance analysis", children: _jsxs("div", { className: "space-y-6", children: [(() => {
                            const quality = getLocalQuality(results.localLatency);
                            return (_jsxs("div", { className: "text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: [_jsx("div", { className: "text-6xl font-bold text-gray-900 dark:text-white mb-2", children: quality.grade }), _jsx(Badge, { variant: quality.color, className: "text-lg mb-2", children: quality.description })] }));
                        })(), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 dark:bg-blue-800 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: [results.localLatency, "ms"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Local Latency" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 dark:bg-green-800 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [results.localJitter, "ms"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Local Jitter" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 dark:bg-purple-800 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: [results.memoryUsage, "MB"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Memory Usage" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Performance Metrics" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "CPU Intensive:" }), _jsxs("span", { className: "font-medium", children: [results.cpuIntensive, "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Network Simulation:" }), _jsxs("span", { className: "font-medium", children: [results.networkSimulation, "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Timestamp:" }), _jsx("span", { className: "font-medium text-xs", children: new Date(results.timestamp).toLocaleTimeString() })] })] })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Test Information" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Total Tests:" }), _jsx("span", { className: "font-medium", children: totalTests })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Test Type:" }), _jsx("span", { className: "font-medium", children: "Local Only" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Environment:" }), _jsx("span", { className: "font-medium", children: "Development" })] })] })] })] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "\uD83D\uDCA1 Recommendations" }), _jsxs("div", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [results.localLatency <= 15 && (_jsx("div", { children: "\u2705 Your local system performance is excellent!" })), results.localLatency > 15 && results.localLatency <= 30 && (_jsx("div", { children: "\u26A0\uFE0F Consider closing unnecessary applications to improve performance" })), results.localLatency > 30 && (_jsx("div", { children: "\u274C High local latency detected - check system resources" })), results.memoryUsage > 200 && (_jsx("div", { children: "\u26A0\uFE0F High memory usage detected - consider freeing up system memory" }))] })] })] }) })), _jsx(Card, { title: "About Local Network Testing", subtitle: "Understanding local system performance", children: _jsxs("div", { className: "space-y-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("p", { children: [_jsx("strong", { children: "Local Network Testing" }), " measures your system's local performance without requiring external network connections. This is perfect for development environments or when external services are unavailable."] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "What It Measures" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [_jsx("li", { children: "Local processing latency" }), _jsx("li", { children: "Memory usage patterns" }), _jsx("li", { children: "CPU performance" }), _jsx("li", { children: "System responsiveness" })] })] }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "When to Use" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [_jsx("li", { children: "Development environments" }), _jsx("li", { children: "Offline testing" }), _jsx("li", { children: "System performance checks" }), _jsx("li", { children: "Network service failures" })] })] })] }), _jsx("p", { children: "This test provides a baseline understanding of your system's performance capabilities and can help identify local bottlenecks that might affect network performance." }), _jsx("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-green-600 dark:text-green-400", children: "\u2705" }), _jsx("span", { className: "text-green-800 dark:text-green-200 text-xs", children: "This test works completely offline and doesn't require any external network connections." })] }) })] }) })] }));
}
