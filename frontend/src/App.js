import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { Header, Footer, EmailResults, Help, LandingPage, ShareResults, TestProgress, ResultsDashboard, QuickTest, ManualTest, DnsTests, ContactUs, AboutUs } from "./components";
import { Button } from "./components/ui";
import { useDarkMode } from "./hooks/useDarkMode";
function App() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [permissionsStatus, setPermissionsStatus] = useState(() => localStorage.getItem("mediaPermissions") || "unknown");
    const [showHelp, setShowHelp] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [showResults, setShowResults] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showContactUs, setShowContactUs] = useState(false);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [currentTest, setCurrentTest] = useState("");
    const [isQuickTestMode, setIsQuickTestMode] = useState(false);
    const [completedTests, setCompletedTests] = useState({
        quickTest: false,
        networkTest: false,
        mediaTest: false,
    });
    const [runningTests, setRunningTests] = useState([]);
    // Data management for export functionality
    const [exportData, setExportData] = useState({
        networkData: null,
        mediaData: null,
        systemData: null,
    });
    const updateExportData = (type, data) => {
        setExportData(prev => ({
            ...prev,
            [type]: data
        }));
        // Mark test as completed when data is received
        const testMapping = {
            'networkData': 'networkTest',
            'mediaData': 'mediaTest'
        };
        // Special handling for quick test completion
        if (type === 'networkData' && data && data.testType === 'quickTest') {
            handleTestComplete('quickTest');
        }
        const testName = testMapping[type];
        if (testName && data) {
            handleTestComplete(testName);
            // If network data includes advanced tests, mark advanced tests as complete
            if (type === 'networkData' && data.advancedTests) {
                handleTestComplete('advancedTests');
            }
            // Handle system info from NetworkTest component
            if (data && data.testType === 'systemInfo') {
                updateExportData('systemData', data.data);
                handleTestComplete('configInfo');
            }
        }
    };
    const toggleHelp = () => {
        setShowHelp(!showHelp);
    };
    const toggleContactUs = () => {
        setShowContactUs(!showContactUs);
    };
    const toggleAboutUs = () => {
        setShowAboutUs(!showAboutUs);
    };
    const startQuickTest = () => {
        // Reset all states for a clean Quick Test
        setExportData({
            networkData: null,
            mediaData: null,
            systemData: null,
        });
        setCompletedTests({
            quickTest: false,
            networkTest: false,
            mediaTest: false,
        });
        setRunningTests([]);
        setShowLanding(false);
        setShowResults(false);
        setShowShare(false);
        setCurrentTest("quickTest");
        setIsQuickTestMode(true);
    };
    const startManualTest = () => {
        console.log('Starting Manual Test, currentTest before:', currentTest);
        setShowLanding(false);
        setShowResults(false);
        setShowShare(false);
        setCurrentTest("manualTest");
        setRunningTests([]);
        setIsQuickTestMode(false);
        console.log('Manual Test started, currentTest set to: manualTest');
    };
    const startDnsTests = () => {
        setShowLanding(false);
        setShowResults(false);
        setShowShare(false);
        setCurrentTest("dnsTests");
        setIsQuickTestMode(false);
    };
    const showResultsDashboard = () => {
        setShowResults(true);
        setShowShare(false);
    };
    const showShareResults = () => {
        setShowShare(true);
        setShowResults(false);
    };
    const handleTestComplete = (testName) => {
        setCompletedTests(prev => ({
            ...prev,
            [testName]: true
        }));
        // Remove from running tests when completed
        setRunningTests(prev => prev.filter(test => test !== testName));
    };
    const handleTestStart = (testName) => {
        setRunningTests(prev => [...prev, testName]);
    };
    const handleTestClick = (testName) => {
        setCurrentTest(testName);
        setShowResults(false);
        setShowShare(false);
    };
    const handleExportResults = () => {
        // Create export data object
        const exportDataObj = {
            timestamp: new Date().toISOString(),
            networkData: exportData.networkData,
            mediaData: exportData.mediaData,
            systemData: exportData.systemData,
        };
        // Export as JSON only
        const jsonData = JSON.stringify(exportDataObj, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ipgrok-test-results-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    const goHome = () => {
        // Reset all states when going home
        setShowLanding(true);
        setShowResults(false);
        setShowShare(false);
        setShowHelp(false);
        setShowContactUs(false);
        setShowAboutUs(false);
        setIsQuickTestMode(false);
        setCurrentTest("");
        setRunningTests([]);
        // Don't reset exportData here - let user keep their results
    };
    const memoizedQuickTestUpdate = useCallback((data) => {
        // Handle quick test data - it contains both network and system data
        if (data.networkData) {
            updateExportData('networkData', data.networkData);
        }
        if (data.systemData) {
            updateExportData('systemData', data.systemData);
        }
        // Mark quick test as complete when both tests are done
        if (data.networkData && data.systemData) {
            handleTestComplete('quickTest');
        }
    }, []);
    const memoizedMediaTestUpdate = useCallback((data) => {
        updateExportData('mediaData', data);
    }, []);
    const memoizedNetworkTestUpdate = useCallback((data) => {
        updateExportData('networkData', data);
    }, []);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx(Header, { darkMode: darkMode, onToggleDarkMode: toggleDarkMode, onShowHelp: toggleHelp, onGoHome: goHome }), _jsx("main", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: showHelp ? (_jsx(Help, {})) : showContactUs ? (_jsx(ContactUs, {})) : showAboutUs ? (_jsx(AboutUs, {})) : showLanding ? (_jsx(LandingPage, { onStartQuickTest: startQuickTest, onStartManualTest: startManualTest, onStartDnsTests: startDnsTests })) : showResults ? (_jsx(ResultsDashboard, { networkData: exportData.networkData, mediaData: exportData.mediaData, systemData: exportData.systemData, onShareResults: showShareResults, onExportResults: handleExportResults })) : showShare ? (_jsx(ShareResults, { networkData: exportData.networkData, mediaData: exportData.mediaData, systemData: exportData.systemData })) : (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(Button, { onClick: goHome, variant: "secondary", size: "sm", children: "\uD83C\uDFE0 Home" }), _jsx(Button, { onClick: showResultsDashboard, variant: "secondary", size: "sm", children: "\uD83D\uDCCA Results" }), _jsx(Button, { onClick: showShareResults, variant: "secondary", size: "sm", children: "\uD83D\uDCE4 Share" }), _jsx(Button, { onClick: toggleAboutUs, variant: "secondary", size: "sm", children: "\u2139\uFE0F About Us" }), _jsx(Button, { onClick: toggleContactUs, variant: "secondary", size: "sm", children: "\uD83D\uDCE7 Contact Us" })] }), currentTest !== "quickTest" && currentTest !== "manualTest" && currentTest !== "dnsTests" && (_jsx(TestProgress, { completedTests: completedTests, currentTest: currentTest, runningTests: runningTests, onTestClick: handleTestClick })), _jsx("div", { className: "grid grid-cols-1 gap-8", children: _jsxs("div", { className: "lg:col-span-1", children: [currentTest === "quickTest" && (_jsx(QuickTest, { permissionsStatus: permissionsStatus, onPermissionsChange: setPermissionsStatus, onDataUpdate: memoizedQuickTestUpdate })), currentTest === "email" && (_jsx(EmailResults, { networkData: exportData.networkData, mediaData: exportData.mediaData, systemData: exportData.systemData })), currentTest === "manualTest" && (_jsx(ManualTest, { permissionsStatus: permissionsStatus, onPermissionsChange: setPermissionsStatus, onDataUpdate: (data) => {
                                            // Handle manual test data
                                            if (data.testName === 'network') {
                                                updateExportData('networkData', data.data);
                                            }
                                            else if (data.testName === 'media') {
                                                updateExportData('mediaData', data.data);
                                            }
                                            else if (data.testName === 'system') {
                                                updateExportData('systemData', data.data);
                                            }
                                        } })), currentTest === "dnsTests" && (_jsx(DnsTests, {}))] }) })] })) }), _jsx(Footer, {})] }));
}
export default App;
