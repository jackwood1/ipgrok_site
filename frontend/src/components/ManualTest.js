import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Card, Button, Badge } from "./ui";
import { NetworkTest } from "./NetworkTest";
import { MediaTest } from "./MediaTest";
import { ConfigInfo } from "./ConfigInfo";
import { PingTest } from "./PingTest";
import { TracerouteTest } from "./TracerouteTest";
export function ManualTest({ permissionsStatus, onPermissionsChange, onDataUpdate }) {
    const [testStatus, setTestStatus] = useState({
        network: 'not-started',
        media: 'not-started',
        system: 'not-started',
        ping: 'not-started',
        traceroute: 'not-started'
    });
    const [testData, setTestData] = useState({
        network: null,
        media: null,
        system: null,
        ping: null,
        traceroute: null
    });
    const [activeTest, setActiveTest] = useState(null);
    const [viewingResults, setViewingResults] = useState(null);
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'running': return 'info';
            case 'failed': return 'danger';
            default: return 'default';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return '✅';
            case 'running': return '🔄';
            case 'failed': return '❌';
            default: return '⏳';
        }
    };
    const handleTestStart = (testName) => {
        setTestStatus(prev => ({ ...prev, [testName]: 'running' }));
        setActiveTest(testName);
    };
    const handleTestComplete = (testName, data) => {
        setTestStatus((prev) => ({ ...prev, [testName]: 'completed' }));
        setTestData((prev) => ({ ...prev, [testName]: data }));
        setActiveTest(null);
        // Update parent component
        if (onDataUpdate) {
            onDataUpdate({
                testType: 'manualTest',
                testName,
                data,
                allTests: testData,
                completedAt: new Date().toISOString()
            });
        }
    };
    const handleTestError = (testName) => {
        setTestStatus(prev => ({ ...prev, [testName]: 'failed' }));
        setActiveTest(null);
    };
    const resetAllTests = () => {
        setTestStatus({
            network: 'not-started',
            media: 'not-started',
            system: 'not-started',
            ping: 'not-started',
            traceroute: 'not-started'
        });
        setTestData({
            network: null,
            media: null,
            system: null,
            ping: null,
            traceroute: null
        });
        setActiveTest(null);
        setViewingResults(null);
    };
    const handleViewResults = (testId) => {
        setViewingResults(viewingResults === testId ? null : testId);
    };
    const tests = [
        {
            id: 'network',
            name: 'Network Speed Test',
            description: 'Download, upload, latency, and connection quality',
            duration: '1-2 minutes',
            icon: '🌐'
        },
        {
            id: 'media',
            name: 'Media Quality Test',
            description: 'Camera, microphone, and video recording capabilities',
            duration: '30-60 seconds',
            icon: '📹'
        },
        {
            id: 'system',
            name: 'System Information',
            description: 'Device specs, browser info, and network details',
            duration: '5-10 seconds',
            icon: '💻'
        },
        {
            id: 'ping',
            name: 'Ping Test',
            description: 'Test connectivity and response times',
            duration: '10-20 seconds',
            icon: '🏓'
        },
        {
            id: 'traceroute',
            name: 'Traceroute Test',
            description: 'Network path analysis and hop details',
            duration: '15-30 seconds',
            icon: '🛣️'
        }
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsx(Card, { title: "Manual Test Suite", subtitle: "Choose which tests to run individually", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: [_jsx(Button, { onClick: resetAllTests, variant: "secondary", size: "sm", children: "\uD83D\uDD04 Reset All Tests" }), _jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400 flex items-center", children: [_jsx("span", { className: "mr-2", children: "Active Test:" }), _jsx(Badge, { variant: activeTest ? 'info' : 'default', children: activeTest ? tests.find(t => t.id === activeTest)?.name : 'None' })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: tests.map((test) => {
                    const status = testStatus[test.id];
                    const isActive = activeTest === test.id;
                    const isCompleted = status === 'completed';
                    const isRunning = status === 'running';
                    const isFailed = status === 'failed';
                    return (_jsx(Card, { title: test.name, subtitle: test.description, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-3xl", children: test.icon }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: test.duration }), _jsxs(Badge, { variant: getStatusColor(status), children: [getStatusIcon(status), " ", status.replace('-', ' ')] })] })] }), _jsx(Button, { onClick: () => handleTestStart(test.id), disabled: isRunning || isActive, variant: isCompleted ? 'success' : isFailed ? 'danger' : 'primary', className: "w-full", size: "lg", children: isRunning ? 'Running...' :
                                        isCompleted ? 'Completed' :
                                            isFailed ? 'Retry' :
                                                `Run ${test.name}` }), isCompleted && testData[test.id] && (_jsxs("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors", onClick: () => handleViewResults(test.id), children: [_jsx("div", { className: "text-sm font-medium text-green-900 dark:text-green-100 mb-1", children: "Test Results Available" }), _jsx("div", { className: "text-xs text-green-700 dark:text-green-300", children: viewingResults === test.id ? 'Click to hide results' : 'Click to view detailed results' })] })), isFailed && (_jsxs("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md", children: [_jsx("div", { className: "text-sm font-medium text-red-900 dark:text-red-100 mb-1", children: "Test Failed" }), _jsx("div", { className: "text-xs text-red-700 dark:text-red-300", children: "Click retry to run again" })] }))] }) }, test.id));
                }) }), activeTest && (_jsx(Card, { title: `Running: ${tests.find(t => t.id === activeTest)?.name}`, subtitle: "Test in progress...", children: _jsxs("div", { className: "space-y-4", children: [activeTest === 'network' && (_jsx(NetworkTest, { permissionsStatus: permissionsStatus, onDataUpdate: (data) => handleTestComplete('network', data), autoStart: true })), activeTest === 'media' && (_jsx(MediaTest, { permissionsStatus: permissionsStatus, onPermissionsChange: onPermissionsChange, onDataUpdate: (data) => handleTestComplete('media', data) })), activeTest === 'system' && (_jsx(ConfigInfo, { onDataUpdate: (data) => handleTestComplete('system', data) })), activeTest === 'ping' && (_jsx(PingTest, { onDataUpdate: (data) => handleTestComplete('ping', data) })), activeTest === 'traceroute' && (_jsx(TracerouteTest, { onDataUpdate: (data) => handleTestComplete('traceroute', data) }))] }) })), viewingResults && testData[viewingResults] && (_jsx(Card, { title: `${tests.find(t => t.id === viewingResults)?.name} - Detailed Results`, subtitle: "Complete test results and analysis", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Test Data" }), _jsx(Button, { onClick: () => setViewingResults(null), variant: "secondary", size: "sm", children: "Close Results" })] }), _jsx("div", { className: "bg-gray-50 dark:bg-gray-800 p-4 rounded-lg", children: _jsx("pre", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto", children: JSON.stringify(testData[viewingResults], null, 2) }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => {
                                        const data = testData[viewingResults];
                                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${viewingResults}-test-results.json`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }, variant: "primary", size: "sm", children: "Download Results" }), _jsx(Button, { onClick: () => {
                                        const data = testData[viewingResults];
                                        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                                    }, variant: "secondary", size: "sm", children: "Copy to Clipboard" })] })] }) })), Object.values(testStatus).some(status => status === 'completed') && (_jsx(Card, { title: "Test Summary", subtitle: "Overview of completed tests", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: tests.map((test) => {
                        const status = testStatus[test.id];
                        const isCompleted = status === 'completed';
                        if (!isCompleted)
                            return null;
                        return (_jsxs("div", { className: "text-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md", children: [_jsx("div", { className: "text-2xl mb-2", children: test.icon }), _jsx("div", { className: "text-sm font-medium text-green-900 dark:text-green-100", children: test.name }), _jsx(Badge, { variant: "success", className: "mt-2", children: "\u2705 Complete" })] }, test.id));
                    }) }) }))] }));
}
