import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, Button, Badge } from "./ui";
import { NetworkTest } from "./NetworkTest";
import { ConfigInfo } from "./ConfigInfo";
export function QuickTest({ permissionsStatus, onPermissionsChange, onDataUpdate }) {
    const [currentStep, setCurrentStep] = useState('network');
    const [networkData, setNetworkData] = useState(null);
    const [systemData, setSystemData] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [networkProgress, setNetworkProgress] = useState("");
    const [systemProgress, setSystemProgress] = useState("");
    const [showDebug, setShowDebug] = useState(false);
    // Update parent component when all tests complete
    useEffect(() => {
        if (networkData && systemData && onDataUpdate) {
            onDataUpdate({
                testType: 'quickTest',
                data: {
                    networkData,
                    systemData,
                    completedAt: new Date().toISOString()
                }
            });
        }
    }, [networkData, systemData, onDataUpdate]);
    // Handle network test completion
    const handleNetworkComplete = (data) => {
        console.log('QuickTest: Network test completed with data:', data);
        // Extract the actual data from the standardized format
        let networkDataToSet = data;
        if (data && data.testType === 'networkTest' && data.data) {
            networkDataToSet = data.data;
        }
        setNetworkData(networkDataToSet);
        setCurrentStep('system');
        setNetworkProgress("Network test completed!");
    };
    // Handle network test progress updates
    const handleNetworkProgress = (progress) => {
        setNetworkProgress(progress);
    };
    // Handle system info completion
    const handleSystemComplete = (data) => {
        console.log('QuickTest: System info completed with data:', data);
        // Extract the actual data from the standardized format
        let systemDataToSet = data;
        if (data && data.testType === 'systemInfo' && data.data) {
            systemDataToSet = data.data;
        }
        setSystemData(systemDataToSet);
        setCurrentStep('complete');
        setSystemProgress("System information gathered!");
    };
    // Handle system info progress updates
    const handleSystemProgress = (progress) => {
        setSystemProgress(progress);
    };
    // Start the quick test sequence
    const startQuickTest = () => {
        console.log('QuickTest: Starting quick test sequence');
        setIsRunning(true);
        setCurrentStep('network');
        setNetworkData(null);
        setSystemData(null);
        setNetworkProgress("");
        setSystemProgress("");
        setShowDebug(false);
    };
    const getStepStatus = (step) => {
        if (step === 'network') {
            if (currentStep === 'network')
                return 'running';
            if (networkData)
                return 'completed';
            return 'pending';
        }
        if (step === 'system') {
            if (currentStep === 'system')
                return 'running';
            if (systemData)
                return 'completed';
            if (networkData)
                return 'pending';
            return 'waiting';
        }
        if (step === 'complete') {
            if (currentStep === 'complete')
                return 'completed';
            return 'waiting';
        }
        return 'pending';
    };
    const getStepIcon = (step) => {
        const status = getStepStatus(step);
        switch (status) {
            case 'completed': return '✅';
            case 'running': return '🔄';
            case 'pending': return '⏳';
            case 'waiting': return '⏸️';
            default: return '⏳';
        }
    };
    const getStepColor = (step) => {
        const status = getStepStatus(step);
        switch (status) {
            case 'completed': return 'success';
            case 'running': return 'info';
            case 'pending': return 'default';
            case 'waiting': return 'warning';
            default: return 'default';
        }
    };
    return (_jsx("div", { className: "space-y-8", children: _jsx(Card, { title: "Quick Test", subtitle: "Fast assessment of your network and system for video calls", children: _jsx("div", { className: "space-y-4", children: !isRunning ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDE80" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "Ready for Quick Test" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "This will test your network speed and gather system information." }), _jsx(Button, { onClick: startQuickTest, variant: "primary", size: "lg", className: "px-8", children: "Start Quick Test" })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg border ${getStepStatus('network') === 'running'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`, children: [_jsx("div", { className: "text-2xl", children: getStepIcon('network') }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Network Test" }), _jsx(Badge, { variant: getStepColor('network'), className: "text-xs", children: getStepStatus('network') === 'running' ? 'Running...' :
                                                                getStepStatus('network') === 'completed' ? 'Complete' :
                                                                    getStepStatus('network') === 'pending' ? 'Pending' : 'Waiting' })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Testing download, upload, and connection quality" }), getStepStatus('network') === 'running' && networkProgress && (_jsx("div", { className: "mt-2 p-2 bg-blue-100 dark:bg-blue-800 rounded text-xs text-blue-800 dark:text-blue-200", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" }), _jsx("span", { children: networkProgress })] }) }))] })] }), _jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg border ${getStepStatus('system') === 'running'
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`, children: [_jsx("div", { className: "text-1xl", children: getStepIcon('system') }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "System Information" }), _jsx(Badge, { variant: getStepColor('system'), className: "text-xs", children: getStepStatus('system') === 'running' ? 'Running...' :
                                                                getStepStatus('system') === 'completed' ? 'Complete' :
                                                                    getStepStatus('system') === 'pending' ? 'Pending' : 'Waiting' })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Gathering device and browser information" }), getStepStatus('system') === 'running' && systemProgress && (_jsx("div", { className: "mt-2 p-2 bg-green-100 dark:bg-green-800 rounded text-xs text-green-800 dark:text-green-200", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "animate-spin rounded-full h-3 w-3 border-b-2 border-green-600" }), _jsx("span", { children: systemProgress })] }) }))] })] }), _jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg border ${getStepStatus('complete') === 'completed'
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`, children: [_jsx("div", { className: "text-2xl", children: getStepIcon('complete') }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Test Complete" }), _jsx(Badge, { variant: getStepColor('complete'), className: "text-xs", children: getStepStatus('complete') === 'completed' ? 'Complete' : 'Waiting' })] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "All tests finished successfully" })] })] })] }), currentStep === 'network' && (_jsxs("div", { className: "mt-6", children: [networkProgress && (_jsx("div", { className: "mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100", children: "Network Test in Progress" }), _jsx("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: networkProgress })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-blue-600 dark:text-blue-400", children: "Step 1 of 2" }), _jsx("div", { className: "text-sm font-medium text-blue-900 dark:text-blue-100", children: "Network" })] })] }) })), _jsx(NetworkTest, { permissionsStatus: permissionsStatus, onDataUpdate: handleNetworkComplete, onProgressUpdate: handleNetworkProgress, autoStart: true, quickTestMode: true })] })), currentStep === 'system' && (_jsxs("div", { className: "mt-6", children: [systemProgress && (_jsx("div", { className: "mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-green-900 dark:text-green-100", children: "System Information Gathering" }), _jsx("p", { className: "text-sm text-green-700 dark:text-green-300", children: systemProgress })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-green-600 dark:text-green-400", children: "Step 2 of 2" }), _jsx("div", { className: "text-sm font-medium text-green-900 dark:text-green-100", children: "System" })] })] }) })), _jsx(ConfigInfo, { onDataUpdate: handleSystemComplete })] })), currentStep === 'complete' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center py-6", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83C\uDF89" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "Quick Test Complete!" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Your network and system have been tested successfully." })] }), _jsxs("div", { className: "p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: "\uD83D\uDCCA Overall Assessment" }), _jsxs("div", { className: "space-y-3", children: [networkData?.speedTest && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Network Performance" }), _jsx("span", { className: `font-medium px-3 py-1 rounded-full text-sm ${parseFloat(networkData.speedTest.download) > 25 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                parseFloat(networkData.speedTest.download) > 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`, children: parseFloat(networkData.speedTest.download) > 25 ? 'Excellent' :
                                                                parseFloat(networkData.speedTest.download) > 10 ? 'Good' : 'Needs Improvement' })] })), systemData && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "System Compatibility" }), _jsx("span", { className: `font-medium px-3 py-1 rounded-full text-sm ${systemData.webGL ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`, children: systemData.webGL ? 'Compatible' : 'Limited Support' })] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Video Call Readiness" }), _jsx("span", { className: `font-medium px-3 py-1 rounded-full text-sm ${networkData?.speedTest && parseFloat(networkData.speedTest.download) > 10 && systemData?.webGL ?
                                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                networkData?.speedTest && parseFloat(networkData.speedTest.download) > 5 ?
                                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`, children: networkData?.speedTest && parseFloat(networkData.speedTest.download) > 10 && systemData?.webGL ? 'Ready' :
                                                                networkData?.speedTest && parseFloat(networkData.speedTest.download) > 5 ? 'Fair' : 'Not Ready' })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [networkData && (_jsxs("div", { className: "p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2", children: "\uD83C\uDF10 Network Results" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Download Speed" }), _jsxs("span", { className: "font-medium text-blue-900 dark:text-blue-100", children: [networkData.speedTest?.download || 'N/A', " Mbps"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Upload Speed" }), _jsxs("span", { className: "font-medium text-blue-900 dark:text-blue-100", children: [networkData.speedTest?.upload || 'N/A', " Mbps"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Latency" }), _jsxs("span", { className: "font-medium text-blue-900 dark:text-blue-100", children: [networkData.speedTest?.latency || 'N/A', " ms"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Connection Quality" }), _jsx("span", { className: `font-medium px-2 py-1 rounded text-xs ${networkData.speedTest?.connectionQuality === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                                        networkData.speedTest?.connectionQuality === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                                            networkData.speedTest?.connectionQuality === 'C' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                                                networkData.speedTest?.connectionQuality === 'D' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`, children: networkData.speedTest?.connectionQuality || 'N/A' })] })] })] })), systemData && (_jsxs("div", { className: "p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-green-900 dark:text-green-100 mb-4 flex items-center gap-2", children: "\u2699\uFE0F System Information" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-green-800 dark:text-green-200", children: "Platform" }), _jsx("span", { className: "font-medium text-green-900 dark:text-green-100 text-right", children: systemData.platform || 'N/A' })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-green-800 dark:text-green-200", children: "Screen Resolution" }), _jsx("span", { className: "font-medium text-green-900 dark:text-green-100 text-right", children: systemData.screenResolution || 'N/A' })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-green-800 dark:text-green-200", children: "WebGL Support" }), _jsx("span", { className: `font-medium px-2 py-1 rounded text-xs ${systemData.webGL ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`, children: systemData.webGL ? 'Supported' : 'Not Supported' })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-green-800 dark:text-green-200", children: "IP Address" }), _jsx("span", { className: "font-medium text-green-900 dark:text-green-100 text-right", children: systemData.ipAddress || 'N/A' })] })] })] }))] }), _jsxs("div", { className: "p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-2", children: "\uD83D\uDCA1 Recommendations" }), _jsxs("div", { className: "text-sm text-yellow-800 dark:text-yellow-200 space-y-2", children: [networkData?.speedTest && parseFloat(networkData.speedTest.download) < 10 && (_jsx("p", { children: "\u2022 Your download speed may be too slow for high-quality video calls. Consider upgrading your internet plan." })), networkData?.speedTest && networkData.speedTest.latency > 100 && (_jsx("p", { children: "\u2022 High latency detected. This may cause delays in video calls. Try connecting via Ethernet if possible." })), systemData && !systemData.webGL && (_jsx("p", { children: "\u2022 WebGL is not supported on your system. Some video call features may be limited." })), networkData?.speedTest && parseFloat(networkData.speedTest.download) > 25 && systemData?.webGL && (_jsx("p", { children: "\u2022 Excellent! Your system is well-suited for high-quality video calls." })), (!networkData?.speedTest || !systemData) && (_jsx("p", { children: "\u2022 Run additional tests for a more comprehensive assessment of your system." }))] })] }), _jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden", children: [_jsxs("button", { onClick: () => setShowDebug(!showDebug), className: "w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors", children: [_jsxs("h4", { className: "font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2", children: ["\uD83D\uDC1B Debug Info", _jsxs("span", { className: "text-xs text-blue-600 dark:text-blue-300", children: ["(Click to ", showDebug ? 'hide' : 'show', ")"] })] }), _jsx("span", { className: "text-blue-600 dark:text-blue-300 text-lg", children: showDebug ? '▼' : '▶' })] }), showDebug && (_jsx("div", { className: "p-4 border-t border-blue-200 dark:border-blue-800", children: _jsxs("div", { className: "text-xs text-blue-800 dark:text-blue-200 space-y-1", children: [_jsxs("div", { children: ["Network Data: ", JSON.stringify(networkData, null, 2)] }), _jsxs("div", { children: ["System Data: ", JSON.stringify(systemData, null, 2)] }), _jsxs("div", { children: ["Current Step: ", currentStep] })] }) }))] }), _jsx("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: _jsx(Button, { onClick: () => window.location.reload(), variant: "secondary", size: "md", children: "Run Another Test" }) })] }))] })) }) }) }));
}
