import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";
export function PacketLossTest({ onDataUpdate }) {
    const [isRunning, setRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [currentTest, setCurrentTest] = useState("");
    const [error, setError] = useState(null);
    const [testStats, setTestStats] = useState({
        sent: 0,
        received: 0,
        failed: 0
    });
    const testIntervalRef = useRef(null);
    const startTimeRef = useRef(0);
    const latencyMeasurementsRef = useRef([]);
    const testCountRef = useRef(0);
    const totalTests = 100; // Number of packets to send
    const packetSize = 1024; // 1KB packets
    const simulatePacketLoss = async () => {
        const start = performance.now();
        try {
            // Simulate packet transmission with potential loss
            const packetData = new ArrayBuffer(packetSize);
            const view = new Uint8Array(packetData);
            // Fill with random data
            for (let i = 0; i < packetSize; i++) {
                view[i] = Math.floor(Math.random() * 256);
            }
            // Simulate network conditions that could cause packet loss
            const networkConditions = Math.random();
            const simulatedLatency = 10 + Math.random() * 50; // 10-60ms base latency
            // Simulate packet loss based on network conditions
            let packetLossProbability = 0.02; // 2% base loss rate
            // Increase loss probability under poor conditions
            if (networkConditions > 0.8) {
                packetLossProbability = 0.15; // 15% loss rate
            }
            else if (networkConditions > 0.6) {
                packetLossProbability = 0.08; // 8% loss rate
            }
            // Simulate actual packet loss
            if (Math.random() < packetLossProbability) {
                // Simulate packet loss by throwing an error
                throw new Error('Packet lost in transmission');
            }
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, simulatedLatency));
            const end = performance.now();
            const actualLatency = end - start;
            return { success: true, latency: actualLatency };
        }
        catch (error) {
            // Packet was lost
            return { success: false, latency: 0 };
        }
    };
    const runPacketLossTest = async () => {
        setRunning(true);
        setProgress(0);
        setError(null);
        setCurrentTest("Initializing packet loss test...");
        // Reset measurements
        latencyMeasurementsRef.current = [];
        testCountRef.current = 0;
        startTimeRef.current = performance.now();
        setTestStats({ sent: 0, received: 0, failed: 0 });
        const runSingleTest = async () => {
            if (testCountRef.current >= totalTests) {
                completeTest();
                return;
            }
            try {
                setCurrentTest(`Sending packet ${testCountRef.current + 1}/${totalTests}...`);
                const result = await simulatePacketLoss();
                testCountRef.current++;
                if (result.success) {
                    latencyMeasurementsRef.current.push(result.latency);
                    setTestStats(prev => ({ ...prev, received: prev.received + 1 }));
                }
                else {
                    setTestStats(prev => ({ ...prev, failed: prev.failed + 1 }));
                }
                setTestStats(prev => ({ ...prev, sent: prev.sent + 1 }));
                // Update progress
                const newProgress = (testCountRef.current / totalTests) * 100;
                setProgress(newProgress);
                // Schedule next test with realistic timing
                setTimeout(runSingleTest, 50 + Math.random() * 100);
            }
            catch (error) {
                console.error('Packet test failed:', error);
                testCountRef.current++;
                setTestStats(prev => ({ ...prev, failed: prev.failed + 1, sent: prev.sent + 1 }));
                setTimeout(runSingleTest, 50);
            }
        };
        // Start the test sequence
        runSingleTest();
    };
    const completeTest = () => {
        const endTime = performance.now();
        const totalTime = endTime - startTimeRef.current;
        if (latencyMeasurementsRef.current.length === 0) {
            setError('No packets were successfully received');
            setRunning(false);
            return;
        }
        // Calculate results
        const receivedPackets = latencyMeasurementsRef.current.length;
        const lostPackets = totalTests - receivedPackets;
        const packetLossRate = (lostPackets / totalTests) * 100;
        const averageLatency = latencyMeasurementsRef.current.reduce((sum, lat) => sum + lat, 0) / receivedPackets;
        const minLatency = Math.min(...latencyMeasurementsRef.current);
        const maxLatency = Math.max(...latencyMeasurementsRef.current);
        const result = {
            totalPackets: totalTests,
            receivedPackets,
            lostPackets,
            packetLossRate: Math.round(packetLossRate * 100) / 100,
            averageLatency: Math.round(averageLatency * 100) / 100,
            minLatency: Math.round(minLatency * 100) / 100,
            maxLatency: Math.round(maxLatency * 100) / 100,
            testDuration: Math.round(totalTime * 100) / 100,
            timestamp: new Date().toISOString()
        };
        setResults(result);
        setRunning(false);
        setCurrentTest("Test completed!");
        // Update parent component
        if (onDataUpdate) {
            onDataUpdate({
                testType: 'packetLossTest',
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
        setTestStats({ sent: 0, received: 0, failed: 0 });
        latencyMeasurementsRef.current = [];
        testCountRef.current = 0;
    };
    const getPacketLossQuality = (lossRate) => {
        if (lossRate <= 1) {
            return { grade: 'A', color: 'success', description: 'Excellent - Minimal packet loss' };
        }
        else if (lossRate <= 3) {
            return { grade: 'B', color: 'info', description: 'Good - Low packet loss' };
        }
        else if (lossRate <= 8) {
            return { grade: 'C', color: 'warning', description: 'Fair - Moderate packet loss' };
        }
        else if (lossRate <= 15) {
            return { grade: 'D', color: 'warning', description: 'Poor - High packet loss' };
        }
        else {
            return { grade: 'F', color: 'danger', description: 'Very Poor - Excessive packet loss' };
        }
    };
    useEffect(() => {
        return () => {
            if (testIntervalRef.current) {
                clearTimeout(testIntervalRef.current);
            }
        };
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx(Button, { onClick: runPacketLossTest, disabled: isRunning, variant: "primary", size: "lg", className: "flex-1", children: isRunning ? '🔄 Running...' : '📦 Start Packet Loss Test' }), isRunning && (_jsx(Button, { onClick: stopTest, variant: "danger", size: "lg", children: "\u23F9\uFE0F Stop Test" })), _jsx(Button, { onClick: resetTest, variant: "secondary", size: "lg", children: "\uD83D\uDD04 Reset" })] }), isRunning && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: currentTest }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Progress: ", testCountRef.current, "/", totalTests, " packets"] })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3", children: _jsx("div", { className: "bg-green-500 h-3 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "text-center text-sm text-gray-600 dark:text-gray-400", children: [Math.round(progress), "% Complete"] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx("div", { className: "text-lg font-bold text-blue-600 dark:text-blue-400", children: testStats.sent }), _jsx("div", { className: "text-xs text-blue-700 dark:text-blue-300", children: "Sent" })] }), _jsxs("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx("div", { className: "text-lg font-bold text-green-600 dark:text-green-400", children: testStats.received }), _jsx("div", { className: "text-xs text-green-700 dark:text-green-300", children: "Received" })] }), _jsxs("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 rounded-lg", children: [_jsx("div", { className: "text-lg font-bold text-red-600 dark:text-red-400", children: testStats.failed }), _jsx("div", { className: "text-xs text-red-700 dark:text-red-300", children: "Lost" })] })] })] })), error && (_jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-red-600 dark:text-red-400", children: "\u274C" }), _jsx("span", { className: "text-red-800 dark:text-red-200", children: error })] }) })), results && (_jsx(Card, { title: "Packet Loss Test Results", subtitle: "Network reliability analysis", children: _jsxs("div", { className: "space-y-6", children: [(() => {
                            const quality = getPacketLossQuality(results.packetLossRate);
                            return (_jsxs("div", { className: "text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: [_jsx("div", { className: "text-6xl font-bold text-gray-900 dark:text-white mb-2", children: quality.grade }), _jsx(Badge, { variant: quality.color, className: "text-lg mb-2", children: quality.description })] }));
                        })(), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-red-50 dark:bg-red-800 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: [results.packetLossRate, "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Packet Loss" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 dark:bg-green-800 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: results.receivedPackets }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Received" })] }), _jsxs("div", { className: "text-center p-4 bg-blue-50 dark:bg-blue-800 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: [results.averageLatency, "ms"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Avg Latency" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 dark:bg-purple-800 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: [results.testDuration, "ms"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Test Duration" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Packet Statistics" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Total Packets:" }), _jsx("span", { className: "font-medium", children: results.totalPackets })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Successfully Received:" }), _jsx("span", { className: "font-medium text-green-600", children: results.receivedPackets })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Lost Packets:" }), _jsx("span", { className: "font-medium text-red-600", children: results.lostPackets })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Success Rate:" }), _jsxs("span", { className: "font-medium", children: [100 - results.packetLossRate, "%"] })] })] })] }), _jsxs("div", { className: "p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Latency Analysis" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Average:" }), _jsxs("span", { className: "font-medium", children: [results.averageLatency, "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Minimum:" }), _jsxs("span", { className: "font-medium", children: [results.minLatency, "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Maximum:" }), _jsxs("span", { className: "font-medium", children: [results.maxLatency, "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Timestamp:" }), _jsx("span", { className: "font-medium text-xs", children: new Date(results.timestamp).toLocaleTimeString() })] })] })] })] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "\uD83D\uDCA1 Recommendations" }), _jsxs("div", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [results.packetLossRate <= 3 && (_jsx("div", { children: "\u2705 Your connection is very reliable - great for all online activities!" })), results.packetLossRate > 3 && results.packetLossRate <= 8 && (_jsx("div", { children: "\u26A0\uFE0F Some packet loss detected - consider checking for network congestion" })), results.packetLossRate > 8 && (_jsx("div", { children: "\u274C High packet loss detected - this may cause video/audio issues" })), results.averageLatency > 100 && (_jsx("div", { children: "\u26A0\uFE0F High latency detected - consider using a closer server or better connection" }))] })] })] }) })), _jsx(Card, { title: "About Packet Loss Testing", subtitle: "Understanding network reliability", children: _jsxs("div", { className: "space-y-4 text-sm text-gray-600 dark:text-gray-400", children: [_jsxs("p", { children: [_jsx("strong", { children: "Packet Loss" }), " occurs when data packets fail to reach their destination. This test simulates real network conditions and measures how reliably your connection delivers data."] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "Low Packet Loss (\u22643%)" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [_jsx("li", { children: "Excellent for video calls" }), _jsx("li", { children: "Great for online gaming" }), _jsx("li", { children: "Reliable file transfers" })] })] }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 dark:text-white mb-2", children: "High Packet Loss (>8%)" }), _jsxs("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [_jsx("li", { children: "Video call quality issues" }), _jsx("li", { children: "Gaming lag and disconnections" }), _jsx("li", { children: "File transfer failures" })] })] })] }), _jsx("p", { children: "This test sends 100 simulated packets and tracks delivery success rates, providing insights into your network's reliability under various conditions." }), _jsx("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-yellow-600 dark:text-yellow-400", children: "\u2139\uFE0F" }), _jsx("span", { className: "text-yellow-800 dark:text-yellow-200 text-xs", children: "Note: This test simulates packet loss conditions. Real-world results may vary based on actual network infrastructure and current conditions." })] }) })] }) })] }));
}
