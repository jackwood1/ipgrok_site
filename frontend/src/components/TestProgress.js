import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Badge } from "./ui";
export function TestProgress({ completedTests, currentTest, runningTests = [], onTestClick }) {
    const tests = [
        {
            id: 'networkTest',
            name: 'Network Tests',
            description: 'Speed, latency, and connection quality tests',
            icon: '🌐',
            duration: '1-2 minutes',
            required: true
        },
        {
            id: 'configInfo',
            name: 'System Info',
            description: 'Device and browser configuration details',
            icon: '⚙️',
            duration: 'Instant',
            required: true
        },
        {
            id: 'advancedTests',
            name: 'Advanced Network Tests',
            description: 'DNS, HTTP/HTTPS, CDN, VPN detection, and security tests',
            icon: '🔬',
            duration: '30-60 seconds',
            required: true
        },
        {
            id: 'mediaTest',
            name: 'Media Tests',
            description: 'Camera, microphone, and video quality assessment',
            icon: '📹',
            duration: '1-2 minutes',
            required: true
        }
    ];
    const completedCount = Object.values(completedTests).filter(Boolean).length;
    const totalTests = tests.length;
    const progressPercentage = (completedCount / totalTests) * 100;
    return (_jsx(Card, { title: "Test Progress", subtitle: `${completedCount}/${totalTests} tests completed`, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Overall Progress" }), _jsxs("span", { className: "text-gray-900 dark:text-white font-medium", children: [Math.round(progressPercentage), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3", children: _jsx("div", { className: "bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500", style: { width: `${progressPercentage}%` } }) })] }), _jsx("div", { className: "space-y-3", children: tests.map((test) => {
                        const isCompleted = completedTests[test.id];
                        const isCurrent = currentTest === test.id;
                        const isRunning = runningTests.includes(test.id);
                        return (_jsx("div", { onClick: () => onTestClick(test.id), className: `p-4 rounded-lg border cursor-pointer transition-all duration-200 ${isCompleted
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : isCurrent
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-2xl", children: test.icon }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: test.name }), test.required && (_jsx(Badge, { variant: "warning", className: "text-xs", children: "Required" })), isCompleted && (_jsx(Badge, { variant: "success", className: "text-xs", children: "\u2705 Complete" })), isRunning && (_jsx(Badge, { variant: "info", className: "text-xs", children: "\uD83D\uDD04 Running" }))] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: test.description }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: ["Duration: ", test.duration] })] })] }), _jsxs("div", { className: "text-right", children: [isCompleted && (_jsx("div", { className: "text-green-600 dark:text-green-400 text-2xl", children: "\u2713" })), isRunning && (_jsx("div", { className: "text-blue-600 dark:text-blue-400 text-2xl animate-pulse", children: "\u27F3" }))] })] }) }, test.id));
                    }) }), completedCount > 0 && (_jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "Next Steps" }), _jsxs("div", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [completedCount === 1 && (_jsx("p", { children: "Great start! Run more tests to get a complete picture of your internet performance." })), completedCount >= 3 && (_jsx("p", { children: "Excellent! You have comprehensive test results. Consider sharing them or running advanced tests." })), completedCount === totalTests && (_jsx("p", { children: "Perfect! You've completed all tests. Share your results or export them for future reference." }))] })] }))] }) }));
}
