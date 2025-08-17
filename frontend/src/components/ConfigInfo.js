import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Card, Badge } from "./ui";
export function ConfigInfo({ onDataUpdate, autoStart = false }) {
    const [systemInfo, setSystemInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Update export data when system info changes
    useEffect(() => {
        if (onDataUpdate && systemInfo) {
            onDataUpdate({
                testType: 'systemInfo',
                data: systemInfo
            });
        }
    }, [systemInfo, onDataUpdate]);
    const gatherSystemInfo = async () => {
        try {
            // Get IP address
            let ipAddress = "Unknown";
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                ipAddress = data.ip;
            }
            catch {
                try {
                    const response = await fetch("https://httpbin.org/ip");
                    const data = await response.json();
                    ipAddress = data.origin;
                }
                catch {
                    ipAddress = "Could not determine";
                }
            }
            // Get connection info
            let connectionType = "Unknown";
            let effectiveType = "Unknown";
            let downlink = 0;
            let rtt = 0;
            if ('connection' in navigator) {
                const connection = navigator.connection;
                connectionType = connection.effectiveType || "Unknown";
                effectiveType = connection.effectiveType || "Unknown";
                downlink = connection.downlink || 0;
                rtt = connection.rtt || 0;
            }
            // Get battery info
            let batteryLevel = undefined;
            let batteryCharging = undefined;
            if ('getBattery' in navigator) {
                try {
                    const battery = await navigator.getBattery();
                    batteryLevel = Math.round(battery.level * 100);
                    batteryCharging = battery.charging;
                }
                catch {
                    // Battery API not available
                }
            }
            // Get hardware info
            let cores = undefined;
            let memory = undefined;
            if ('hardwareConcurrency' in navigator) {
                cores = navigator.hardwareConcurrency;
            }
            if ('deviceMemory' in navigator) {
                memory = navigator.deviceMemory;
            }
            // Get WebGL info
            let webGL = false;
            let webGLVendor = undefined;
            let webGLRenderer = undefined;
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    webGL = true;
                    webGLVendor = gl.getParameter(gl.VENDOR);
                    webGLRenderer = gl.getParameter(gl.RENDERER);
                }
            }
            catch {
                webGL = false;
            }
            const info = {
                ipAddress,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                languages: navigator.languages || [],
                cookieEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack,
                onLine: navigator.onLine,
                connectionType,
                effectiveType,
                downlink,
                rtt,
                screenResolution: `${screen.width}x${screen.height}`,
                colorDepth: screen.colorDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dateTime: new Date().toLocaleString(),
                localStorage: (() => {
                    try {
                        localStorage.setItem('test', 'test');
                        localStorage.removeItem('test');
                        return true;
                    }
                    catch {
                        return false;
                    }
                })(),
                sessionStorage: (() => {
                    try {
                        sessionStorage.setItem('test', 'test');
                        sessionStorage.removeItem('test');
                        return true;
                    }
                    catch {
                        return false;
                    }
                })(),
                webGL,
                webGLVendor,
                webGLRenderer,
                batteryLevel,
                batteryCharging,
                cores,
                memory,
            };
            setSystemInfo(info);
        }
        catch (err) {
            setError("Failed to gather system information");
        }
        finally {
            setLoading(false);
        }
    };
    // Auto-start if autoStart is true
    useEffect(() => {
        if (autoStart && !systemInfo && !loading) {
            gatherSystemInfo();
        }
    }, [autoStart]);
    // Initial load of system info
    useEffect(() => {
        gatherSystemInfo();
    }, []);
    const getStatusBadge = (value) => {
        if (typeof value === 'boolean') {
            return value ? _jsx(Badge, { variant: "success", children: "Yes" }) : _jsx(Badge, { variant: "danger", children: "No" });
        }
        if (value === undefined || value === null) {
            return _jsx(Badge, { variant: "warning", children: "Unknown" });
        }
        if (typeof value === 'string' && value === "Unknown") {
            return _jsx(Badge, { variant: "warning", children: "Unknown" });
        }
        return _jsx(Badge, { variant: "info", children: String(value) });
    };
    const formatBytes = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    if (loading) {
        return (_jsx(Card, { title: "System Configuration", subtitle: "Gathering client information...", children: _jsx("div", { className: "flex justify-center items-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }) }) }));
    }
    if (error) {
        return (_jsx(Card, { title: "System Configuration", subtitle: "Error loading configuration", children: _jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "danger", className: "mr-2", children: "\u274C" }), _jsx("span", { className: "text-red-800 dark:text-red-200", children: error })] }) }) }));
    }
    if (!systemInfo)
        return null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { title: "Network Information", subtitle: "Connection and network details", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "IP Address" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm text-gray-900 dark:text-white font-mono", children: systemInfo.ipAddress }), systemInfo.ipAddress !== "Unknown" && systemInfo.ipAddress !== "Could not determine" && (_jsx(Badge, { variant: "success", children: "Public" }))] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Online Status" }), getStatusBadge(systemInfo.onLine)] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Connection Type" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.connectionType })] }), systemInfo.downlink && systemInfo.downlink > 0 && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Downlink" }), _jsxs("span", { className: "text-sm text-gray-900 dark:text-white", children: [systemInfo.downlink, " Mbps"] })] })), systemInfo.rtt && systemInfo.rtt > 0 && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "RTT" }), _jsxs("span", { className: "text-sm text-gray-900 dark:text-white", children: [systemInfo.rtt, "ms"] })] }))] }) }) }), _jsx(Card, { title: "Browser Information", subtitle: "Browser and platform details", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "User Agent" }), _jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-800 rounded-md", children: _jsx("code", { className: "text-xs text-gray-900 dark:text-white break-all", children: systemInfo.userAgent }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Platform" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.platform })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Language" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.language })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Cookies Enabled" }), getStatusBadge(systemInfo.cookieEnabled)] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Do Not Track" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.doNotTrack || "Not set" })] })] })] }) }), _jsx(Card, { title: "Display Information", subtitle: "Screen and graphics details", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Screen Resolution" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.screenResolution })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Color Depth" }), _jsxs("span", { className: "text-sm text-gray-900 dark:text-white", children: [systemInfo.colorDepth, " bit"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "WebGL Support" }), getStatusBadge(systemInfo.webGL)] }), systemInfo.webGLVendor && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "WebGL Vendor" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.webGLVendor })] }))] }) }), _jsx(Card, { title: "System Information", subtitle: "Hardware and system details", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Timezone" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.timezone })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Current Time" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.dateTime })] }), systemInfo.cores && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "CPU Cores" }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: systemInfo.cores })] })), systemInfo.memory && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Device Memory" }), _jsxs("span", { className: "text-sm text-gray-900 dark:text-white", children: [systemInfo.memory, " GB"] })] })), systemInfo.batteryLevel !== undefined && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Battery Level" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-sm text-gray-900 dark:text-white", children: [systemInfo.batteryLevel, "%"] }), systemInfo.batteryCharging && _jsx(Badge, { variant: "success", children: "Charging" })] })] }))] }) }), _jsx(Card, { title: "Storage Information", subtitle: "Browser storage capabilities", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Local Storage" }), getStatusBadge(systemInfo.localStorage)] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Session Storage" }), getStatusBadge(systemInfo.sessionStorage)] })] }) }), systemInfo.languages.length > 1 && (_jsx(Card, { title: "Supported Languages", subtitle: "Browser language preferences", children: _jsx("div", { className: "space-y-2", children: systemInfo.languages.map((lang, index) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["Language ", index + 1] }), _jsx("span", { className: "text-sm text-gray-900 dark:text-white", children: lang })] }, index))) }) }))] }));
}
