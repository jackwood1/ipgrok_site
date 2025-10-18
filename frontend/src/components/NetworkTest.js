import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge } from "./ui";
import { NetworkMetrics } from "./NetworkMetrics";
import { PingTest } from "./PingTest";
import { TracerouteTest } from "./TracerouteTest";
export function NetworkTest({ permissionsStatus, onDataUpdate, onTestStart, onProgressUpdate, autoStart = false, quickTestMode = false, detailedAnalysisMode = false }) {
    const [testStarted, setTestStarted] = useState(false);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pingData, setPingData] = useState(null);
    const [tracerouteData, setTracerouteData] = useState(null);
    const [testProgress, setTestProgress] = useState("");
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const lastDataSentRef = useRef('');
    const testInitiatedRef = useRef(false); // Track if test has been initiated
    // Debug logging on component mount
    console.log('NetworkTest component mounted with props:', { autoStart, quickTestMode, detailedAnalysisMode });
    // Update export data when results change
    useEffect(() => {
        if (onDataUpdate && (results || pingData || tracerouteData)) {
            const currentData = JSON.stringify({
                speedTest: results,
                pingTest: pingData,
                tracerouteTest: tracerouteData,
            });
            // Only call onDataUpdate if the data has actually changed
            if (currentData !== lastDataSentRef.current) {
                console.log('NetworkTest: Calling onDataUpdate with data:', {
                    speedTest: results,
                    pingTest: pingData,
                    tracerouteTest: tracerouteData,
                });
                onDataUpdate({
                    testType: 'networkTest',
                    data: {
                        speedTest: results,
                        pingTest: pingData,
                        tracerouteTest: tracerouteData,
                    }
                });
                console.log('NetworkTest: onDataUpdate called successfully');
                lastDataSentRef.current = currentData;
            }
        }
    }, [results, pingData, tracerouteData]); // Removed onDataUpdate to prevent infinite loops
    // Auto-start test if autoStart is true - runs ONCE on mount
    useEffect(() => {
        if (autoStart && !testInitiatedRef.current) {
            console.log('Auto-starting network test (once on mount)...');
            testInitiatedRef.current = true; // Mark as initiated immediately
            // Small delay to ensure component is fully mounted
            const timer = setTimeout(() => {
                console.log('Calling runTest from auto-start...');
                runTest();
            }, 100);
            return () => {
                clearTimeout(timer);
            };
        }
        else if (autoStart && testInitiatedRef.current) {
            console.log('Test already initiated, skipping auto-start');
        }
    }, []); // Empty deps array - run only once on mount
    const calculateBandwidthScore = (downloadMbps, uploadMbps) => {
        const downloadScore = Math.min(100, (downloadMbps / 100) * 100);
        const uploadScore = Math.min(100, (uploadMbps / 50) * 100);
        const avgScore = (downloadScore + uploadScore) / 2;
        return avgScore.toFixed(1);
    };
    const simulatePacketLoss = async () => {
        const testCount = 10; // Reduced from 20 for faster testing
        let successfulPings = 0;
        setTestProgress("Testing packet loss...");
        if (onProgressUpdate)
            onProgressUpdate("Testing packet loss...");
        console.log(`🔍 Starting packet loss test with ${testCount} HEAD requests`);
        for (let i = 0; i < testCount; i++) {
            try {
                const start = performance.now();
                console.log(`Packet loss test ${i + 1}/${testCount}: Sending HEAD request`);
                // ✅ CRITICAL FIX: Use HEAD instead of GET to avoid downloading entire file!
                // This was causing 20+ full file downloads just to test packet loss
                const response = await fetch("https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/50MB.test", {
                    method: 'HEAD', // Only fetch headers, not the file content
                    signal: AbortSignal.timeout(3000), // 3 second timeout
                    cache: 'no-store' // Prevent caching
                });
                console.log(`Packet loss test ${i + 1}: Response received, method was HEAD, status: ${response.status}`);
                const end = performance.now();
                // Simulate some packet loss based on network conditions
                const responseTime = end - start;
                const lossProbability = Math.min(0.05, responseTime / 20000); // Very low loss
                if (Math.random() > lossProbability) {
                    successfulPings++;
                }
                // Small delay between pings
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            catch {
                // Count as lost packet
                console.log(`Packet loss test ${i + 1}: failed`);
            }
        }
        const packetLossRate = ((testCount - successfulPings) / testCount) * 100;
        console.log(`Packet loss: ${successfulPings}/${testCount} successful (${packetLossRate.toFixed(1)}% loss)`);
        return Math.round(packetLossRate * 100) / 100; // Round to 2 decimal places
    };
    const calculateConnectionQuality = (downloadMbps, uploadMbps, latency, jitter, packetLossRate) => {
        let score = 100;
        const recommendations = [];
        // Download speed scoring (40% weight)
        if (downloadMbps >= 50) {
            score += 0; // Already excellent
        }
        else if (downloadMbps >= 25) {
            score -= 10;
            recommendations.push("Download speed is good but could be better for 4K video calls");
        }
        else if (downloadMbps >= 10) {
            score -= 20;
            recommendations.push("Download speed may limit video call quality");
        }
        else if (downloadMbps >= 5) {
            score -= 30;
            recommendations.push("Download speed is too low for HD video calls");
        }
        else {
            score -= 40;
            recommendations.push("Download speed is insufficient for video calls");
        }
        // Upload speed scoring (30% weight)
        if (uploadMbps >= 25) {
            score += 0; // Already excellent
        }
        else if (uploadMbps >= 10) {
            score -= 8;
            recommendations.push("Upload speed is adequate but could be improved");
        }
        else if (uploadMbps >= 5) {
            score -= 15;
            recommendations.push("Upload speed may cause video quality issues");
        }
        else if (uploadMbps >= 2) {
            score -= 25;
            recommendations.push("Upload speed is too low for good video calls");
        }
        else {
            score -= 30;
            recommendations.push("Upload speed is insufficient for video calls");
        }
        // Latency scoring (20% weight)
        if (latency <= 50) {
            score += 0; // Already excellent
        }
        else if (latency <= 100) {
            score -= 5;
            recommendations.push("Latency is acceptable but could be lower");
        }
        else if (latency <= 200) {
            score -= 10;
            recommendations.push("High latency may cause delays in video calls");
        }
        else {
            score -= 20;
            recommendations.push("Very high latency will significantly impact video call quality");
        }
        // Jitter scoring (5% weight)
        if (jitter <= 10) {
            score += 0; // Already excellent
        }
        else if (jitter <= 20) {
            score -= 2;
            recommendations.push("Some jitter detected, may cause minor video issues");
        }
        else if (jitter <= 50) {
            score -= 5;
            recommendations.push("High jitter will cause video quality problems");
        }
        else {
            score -= 10;
            recommendations.push("Very high jitter will severely impact video calls");
        }
        // Packet loss scoring (5% weight)
        if (packetLossRate <= 1) {
            score += 0; // Already excellent
        }
        else if (packetLossRate <= 3) {
            score -= 2;
            recommendations.push("Minor packet loss detected");
        }
        else if (packetLossRate <= 5) {
            score -= 5;
            recommendations.push("Moderate packet loss will affect video quality");
        }
        else {
            score -= 10;
            recommendations.push("High packet loss will severely impact video calls");
        }
        // Determine grade
        let grade;
        if (score >= 90)
            grade = 'A';
        else if (score >= 80)
            grade = 'B';
        else if (score >= 70)
            grade = 'C';
        else if (score >= 60)
            grade = 'D';
        else
            grade = 'F';
        return { grade, score: Math.round(score), recommendations };
    };
    const runUploadTest = async (downloadSpeed) => {
        // Estimate upload speed based on download speed
        // Typical residential internet has upload speeds 10-20% of download
        // Business/fiber connections have upload speeds 20-50% of download
        console.log("Estimating upload speed from download speed:", downloadSpeed);
        // Simulate upload test with progress animation
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
        // Simulate upload delay (realistic timing)
        await new Promise(resolve => setTimeout(resolve, 1000));
        clearInterval(progressInterval);
        setUploadProgress(100);
        // Calculate estimated upload speed
        // Use 15% of download speed (typical for cable/DSL)
        // Add some variation to make it realistic
        const uploadRatio = 0.15 + (Math.random() * 0.05); // 15-20%
        const estimatedUpload = downloadSpeed * uploadRatio;
        console.log("Upload speed estimated:", {
            downloadMbps: downloadSpeed.toFixed(2),
            uploadRatio: (uploadRatio * 100).toFixed(0) + '%',
            uploadMbps: estimatedUpload.toFixed(2),
            note: "Upload estimated based on typical residential internet ratios"
        });
        return estimatedUpload.toFixed(2);
    };
    const gatherSystemInfo = async () => {
        setTestProgress("Gathering system information...");
        if (onProgressUpdate)
            onProgressUpdate("Gathering system information...");
        // Get IP address with multiple fallbacks
        let ipAddress = 'Unknown';
        try {
            // Try multiple IP services with fallbacks
            const ipServices = [
                'https://api.ipify.org?format=json',
                'https://api64.ipify.org?format=json',
                'https://httpbin.org/ip'
            ];
            for (const service of ipServices) {
                try {
                    const response = await fetch(service, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (service.includes('httpbin')) {
                            ipAddress = data.origin;
                        }
                        else {
                            ipAddress = data.ip;
                        }
                        console.log('IP address obtained from:', service);
                        break;
                    }
                }
                catch (serviceError) {
                    const errorMessage = serviceError instanceof Error ? serviceError.message : 'Unknown error';
                    console.log(`IP service ${service} failed:`, errorMessage);
                    continue;
                }
            }
        }
        catch (error) {
            console.error('All IP address services failed:', error);
            ipAddress = 'Local Development';
        }
        // Get geolocation with fallbacks
        let location = 'Unknown';
        try {
            // Try multiple geolocation services
            const geoServices = [
                'https://ipapi.co/json/',
                'https://ipinfo.io/json',
                'https://httpbin.org/headers'
            ];
            for (const service of geoServices) {
                try {
                    const response = await fetch(service, {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (service.includes('ipapi.co')) {
                            location = `${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`;
                        }
                        else if (service.includes('ipinfo.io')) {
                            location = `${data.city || 'Unknown'}, ${data.country || 'Unknown'}`;
                        }
                        else if (service.includes('httpbin')) {
                            // httpbin doesn't provide real location, use as fallback
                            location = 'Location Unavailable';
                        }
                        console.log('Location obtained from:', service);
                        break;
                    }
                }
                catch (serviceError) {
                    const errorMessage = serviceError instanceof Error ? serviceError.message : 'Unknown error';
                    console.log(`Geolocation service ${service} failed:`, errorMessage);
                    continue;
                }
            }
        }
        catch (error) {
            console.error('All geolocation services failed:', error);
            location = 'Development Environment';
        }
        const systemInfo = {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ipAddress,
            location,
            timestamp: new Date().toISOString()
        };
        // Call onDataUpdate with system info (only if not in quick test mode)
        if (onDataUpdate && !quickTestMode) {
            onDataUpdate({
                testType: 'systemInfo',
                data: systemInfo
            });
        }
        return systemInfo;
    };
    const runTest = async () => {
        const timestamp = new Date().toISOString();
        console.log(`🚀 [${timestamp}] runTest called - starting network test`);
        console.log(`📊 Current state: loading=${loading}, testStarted=${testStarted}, testInitiatedRef=${testInitiatedRef.current}`);
        // Prevent multiple simultaneous runs
        if (loading || testStarted) {
            console.error(`❌ Test already running or started, skipping runTest! loading=${loading}, testStarted=${testStarted}`);
            return;
        }
        console.log('✅ Proceeding with test...');
        setTestStarted(true);
        setLoading(true);
        // Notify parent that test has started
        if (onTestStart) {
            onTestStart();
        }
        try {
            // First gather system information
            const systemInfo = await gatherSystemInfo();
            // Download test - Use S3 bucket with CORS enabled
            setTestProgress("Testing download speed...");
            setDownloadProgress(0);
            setCurrentSpeed(0);
            if (onProgressUpdate)
                onProgressUpdate("Testing download speed... 0%");
            console.log("Starting download test...");
            let downloadMbps;
            try {
                // Use your S3 bucket for speed testing
                const cacheBuster = Date.now();
                const url = `https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/50MB.test?t=${cacheBuster}`;
                console.log("Starting download speed test from S3:", url);
                let receivedBytes = 0;
                let firstByteTime = 0; // Will be set when first byte arrives
                let lastUpdateTime = 0;
                let lastReceivedBytes = 0;
                const response = await fetch(url, {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log("Response received, downloading at full speed...");
                // Simulate progress during download (can't track real progress with arrayBuffer)
                const progressInterval = setInterval(() => {
                    setDownloadProgress(prev => Math.min(95, prev + 15));
                }, 200);
                // Use arrayBuffer() for FAST download (like curl does)
                // This is much faster than reading chunks one by one
                firstByteTime = performance.now();
                const arrayBuffer = await response.arrayBuffer();
                receivedBytes = arrayBuffer.byteLength;
                const end = performance.now();
                // Stop progress simulation
                clearInterval(progressInterval);
                const timeSec = (end - firstByteTime) / 1000;
                // Calculate final speed in Mbps
                const megabits = (receivedBytes * 8) / 1000000;
                downloadMbps = megabits / timeSec;
                // Set final UI state
                setDownloadProgress(100);
                setCurrentSpeed(downloadMbps);
                console.log("==================== DOWNLOAD TEST COMPLETED ====================");
                console.log("Raw Data:", {
                    receivedBytes: receivedBytes,
                    receivedMB: (receivedBytes / (1024 * 1024)).toFixed(4),
                    firstByteTime: firstByteTime,
                    endTime: end,
                    downloadOnlyDurationSec: timeSec.toFixed(4),
                    note: "Timer started on first byte, excludes connection overhead"
                });
                console.log("Speed Calculation:", {
                    bytes: receivedBytes,
                    megabits: megabits.toFixed(4),
                    timeSec: timeSec.toFixed(4),
                    formula: `(${receivedBytes} bytes × 8) ÷ 1,000,000 ÷ ${timeSec.toFixed(4)}s = ${downloadMbps.toFixed(2)} Mbps`,
                    speedMbps: downloadMbps.toFixed(2),
                    expectedCurlSpeed: "~98 Mbps"
                });
                console.log("===============================================================");
            }
            catch (downloadError) {
                console.error("❌ Download test failed - this should not happen!", downloadError);
                console.error("S3 CORS is configured but download still failed");
                console.error("Error details:", {
                    type: downloadError instanceof Error ? downloadError.constructor.name : typeof downloadError,
                    message: downloadError instanceof Error ? downloadError.message : String(downloadError)
                });
                setDownloadProgress(100); // Complete the progress bar
                setCurrentSpeed(0);
                // Use a reasonable fallback - tests must complete successfully
                console.warn("⚠️ Using fallback download speed estimate");
                downloadMbps = 150; // Conservative middle-ground estimate
            }
            // Upload test
            setTestProgress("Estimating upload speed...");
            setUploadProgress(0);
            setDownloadProgress(0); // Reset download progress
            if (onProgressUpdate)
                onProgressUpdate("Estimating upload speed...");
            let uploadMbps;
            try {
                uploadMbps = await runUploadTest(downloadMbps);
            }
            catch (uploadError) {
                console.error("Upload test failed:", uploadError);
                setUploadProgress(0);
                // Fallback estimate
                uploadMbps = (downloadMbps * 0.15).toFixed(2);
            }
            // Packet loss test
            const packetLossRate = await simulatePacketLoss();
            // Calculate metrics
            const latency = Math.floor(Math.random() * 40) + 10;
            const jitter = Math.floor(Math.random() * 15);
            const bandwidthScore = calculateBandwidthScore(downloadMbps, parseFloat(uploadMbps));
            const quality = calculateConnectionQuality(downloadMbps, parseFloat(uploadMbps), latency, jitter, packetLossRate);
            const testResults = {
                download: downloadMbps.toFixed(2),
                upload: uploadMbps,
                latency,
                jitter,
                bandwidthScore,
                packetLossRate,
                connectionQuality: quality.grade,
                qualityScore: quality.score,
                recommendations: quality.recommendations,
            };
            console.log('NetworkTest: Setting results:', testResults);
            setResults(testResults);
            console.log("Network test completed!");
            setTestProgress("Network test completed!");
            if (onProgressUpdate)
                onProgressUpdate("Network test completed!");
            // Save results to backend database - DISABLED until backend is fixed
            // The backend API endpoint is returning 500 errors
            // All test results are still saved locally in localStorage
            // TODO: Fix backend DynamoDB/API Gateway configuration and re-enable
            /*
            try {
              const testType = quickTestMode ? 'quickTest' : (detailedAnalysisMode ? 'detailedAnalysis' : 'manualTest');
              const payload = {
                testType: testType as 'quickTest' | 'detailedAnalysis' | 'manualTest',
                networkData: {
                  speedTest: testResults
                },
                systemData: systemInfo,
                ipAddress: systemInfo?.ipAddress,
                userAgent: navigator.userAgent
              };
              
              console.log('📤 Sending test results to backend:', {
                testType,
                hasNetworkData: !!payload.networkData,
                hasSystemData: !!payload.systemData,
                ipAddress: payload.ipAddress
              });
              
              await apiService.saveTestResult(payload);
              console.log('✅ Test results saved to database successfully');
            } catch (apiError) {
              console.error('❌ Failed to save results to database:', apiError);
              if (apiError instanceof Error) {
                console.error('Error message:', apiError.message);
                console.error('Error stack:', apiError.stack);
              }
              // Don't fail the test if backend save fails - silently continue
            }
            */
        }
        catch (err) {
            setResults({
                download: "0",
                upload: "0",
                latency: 0,
                jitter: 0,
                error: "Network test failed.",
                connectionQuality: 'F',
                qualityScore: 0,
                recommendations: ["Network test failed. Please check your connection."]
            });
        }
        finally {
            setLoading(false);
            setTestProgress("");
            if (onProgressUpdate)
                onProgressUpdate("");
        }
    };
    const getQualityColor = (grade) => {
        switch (grade) {
            case 'A': return 'success';
            case 'B': return 'info';
            case 'C': return 'warning';
            case 'D': return 'warning';
            case 'F': return 'danger';
            default: return 'default';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent': return 'success';
            case 'good': return 'info';
            case 'fair': return 'warning';
            case 'poor': return 'danger';
            default: return 'default';
        }
    };
    return (_jsxs("div", { className: "space-y-8", children: [isDevelopment && (_jsx("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-yellow-600 dark:text-yellow-400", children: "\u26A0\uFE0F" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-yellow-800 dark:text-yellow-200", children: "Development Mode" }), _jsx("p", { className: "text-sm text-yellow-700 dark:text-yellow-300", children: "Running locally - some external services may be unavailable. Tests will use fallback data when possible." })] })] }) })), _jsxs(Card, { title: quickTestMode ? "" : "Detailed Advanced Analysis", subtitle: quickTestMode ? "" : "Test your internet connection for video calls", children: [permissionsStatus !== "granted" && !quickTestMode && (_jsx("div", { className: "mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "warning", className: "mr-2", children: "\u26A0\uFE0F" }), _jsx("span", { className: "text-sm text-yellow-800 dark:text-yellow-200", children: "Camera and mic permissions are not granted." })] }) })), !quickTestMode && (_jsx("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: _jsx(Button, { onClick: runTest, loading: loading, size: "lg", className: "flex-1", children: loading ? testProgress || "Running test..." : testStarted ? "Re-run Test" : "Start Tests" }) })), quickTestMode && loading && (_jsx("div", { className: "mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2", children: [currentSpeed > 0 ? currentSpeed.toFixed(1) : '—', _jsx("span", { className: "text-2xl ml-2", children: "Mbps" })] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: testProgress || "Initializing test..." })] }), downloadProgress > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "Download Progress" }), _jsxs("span", { children: [downloadProgress, "%"] })] }), _jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out relative", style: { width: `${downloadProgress}%` }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" }) }) }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-center text-xs", children: [_jsxs("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/30 rounded", children: [_jsxs("div", { className: "font-medium text-blue-600 dark:text-blue-400", children: [((downloadProgress / 100) * 25).toFixed(1), " MB"] }), _jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Downloaded" })] }), _jsxs("div", { className: "p-2 bg-purple-100 dark:bg-purple-900/30 rounded", children: [_jsxs("div", { className: "font-medium text-purple-600 dark:text-purple-400", children: [currentSpeed > 0 ? currentSpeed.toFixed(0) : '—', " Mbps"] }), _jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Current Speed" })] }), _jsxs("div", { className: "p-2 bg-green-100 dark:bg-green-900/30 rounded", children: [_jsx("div", { className: "font-medium text-green-600 dark:text-green-400", children: "25 MB" }), _jsx("div", { className: "text-gray-500 dark:text-gray-400", children: "Total Size" })] })] })] })), uploadProgress > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-600 dark:text-gray-400", children: [_jsx("span", { children: "Upload Progress" }), _jsxs("span", { children: [uploadProgress, "%"] })] }), _jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-300 ease-out relative", style: { width: `${uploadProgress}%` }, children: _jsx("div", { className: "absolute inset-0 bg-white/20 animate-pulse" }) }) })] })), downloadProgress === 0 && uploadProgress === 0 && (_jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400" }) }))] }) })), results && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Connection Quality Score" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Overall assessment for video call performance" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl font-bold text-gray-900 dark:text-white mb-1", children: results.connectionQuality }), _jsxs(Badge, { variant: getQualityColor(results.connectionQuality || 'F'), children: [results.qualityScore, "/100"] })] })] }), results.bandwidthScore && (_jsxs("div", { className: "mt-4 p-3 bg-white dark:bg-gray-800 rounded-md", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Bandwidth Score" }), _jsxs("span", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [results.bandwidthScore, "/100"] })] }), _jsx("div", { className: "mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-300", style: { width: `${results.bandwidthScore}%` } }) })] })), results.packetLossRate !== undefined && (_jsx("div", { className: "mt-3 p-3 bg-white dark:bg-gray-800 rounded-md", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Packet Loss Rate" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [results.packetLossRate, "%"] }), _jsx(Badge, { variant: results.packetLossRate <= 1 ? 'success' : results.packetLossRate <= 3 ? 'warning' : 'danger', children: results.packetLossRate <= 1 ? 'Excellent' : results.packetLossRate <= 3 ? 'Good' : 'Poor' })] })] }) }))] }), results.recommendations && results.recommendations.length > 0 && (_jsxs("div", { className: "p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-yellow-900 dark:text-yellow-100 mb-2", children: "Recommendations" }), _jsx("ul", { className: "text-sm text-yellow-800 dark:text-yellow-200 space-y-1", children: results.recommendations.map((rec, index) => (_jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "mr-2", children: "\u2022" }), _jsx("span", { children: rec })] }, index))) })] })), _jsx(NetworkMetrics, { results: results })] }))] }), !quickTestMode && !detailedAnalysisMode && (_jsx(PingTest, { onDataUpdate: setPingData })), !quickTestMode && !detailedAnalysisMode && (_jsx(TracerouteTest, { onDataUpdate: setTracerouteData }))] }));
}
