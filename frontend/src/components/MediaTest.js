import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge, Select } from "./ui";
export function MediaTest({ permissionsStatus, onPermissionsChange, onDataUpdate, onTestStart, autoStart = false, detailedAnalysisMode = false }) {
    const [devices, setDevices] = useState({
        microphone: "",
        camera: "",
    });
    const [selectedDevices, setSelectedDevices] = useState({
        microphone: "",
        camera: "",
    });
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [recordingTest, setRecordingTest] = useState(null);
    const [videoQuality, setVideoQuality] = useState(null);
    const [audioQuality, setAudioQuality] = useState(null);
    const [codecSupport, setCodecSupport] = useState(null);
    const [testProgress, setTestProgress] = useState("");
    const [micSamples, setMicSamples] = useState([]);
    const [micStats, setMicStats] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const animationFrameRef = useRef(undefined);
    const recordingIntervalRef = useRef(null);
    // Update export data when results change
    useEffect(() => {
        if (onDataUpdate) {
            onDataUpdate({
                testType: 'mediaTest',
                data: {
                    devices,
                    permissions: permissionsStatus,
                    micStats,
                    videoQuality,
                    audioQuality,
                    codecSupport,
                    recordingTest,
                }
            });
        }
    }, [devices, permissionsStatus, micStats, videoQuality, audioQuality, codecSupport, recordingTest, onDataUpdate]);
    // Mark test as complete in Detailed Analysis mode when all steps are done
    useEffect(() => {
        if (detailedAnalysisMode && onDataUpdate && permissionsStatus === "granted" && videoQuality && audioQuality && codecSupport) {
            // Send completion signal
            onDataUpdate({
                testType: 'mediaTest',
                data: {
                    devices,
                    permissions: permissionsStatus,
                    micStats,
                    videoQuality,
                    audioQuality,
                    codecSupport,
                    recordingTest,
                    completed: true
                }
            });
        }
    }, [detailedAnalysisMode, permissionsStatus, videoQuality, audioQuality, codecSupport, onDataUpdate, devices, micStats, recordingTest]);
    // Auto-start test if autoStart is true
    useEffect(() => {
        if (autoStart && !isTesting) {
            const startMediaTests = async () => {
                setIsTesting(true);
                setTestProgress("Starting media tests...");
                // Notify parent that test has started
                if (onTestStart) {
                    onTestStart();
                }
                try {
                    // For Detailed Analysis mode, just get devices and show guided interface
                    if (detailedAnalysisMode) {
                        await getAvailableDevices();
                        setTestProgress("Ready for manual testing");
                    }
                    else {
                        // For other modes, run full automated tests
                        await requestPermissions();
                        await getAvailableDevices();
                        await startVideoTest();
                        await startMicrophoneTest();
                        testCodecSupport();
                        setTestProgress("Media tests completed!");
                    }
                }
                catch (error) {
                    console.error("Media tests failed:", error);
                    setTestProgress("Media tests failed");
                }
                finally {
                    setIsTesting(false);
                }
            };
            startMediaTests();
        }
    }, [autoStart, detailedAnalysisMode]);
    const getAvailableDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter(device => device.kind === "audioinput");
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            setDevices({
                microphone: audioDevices[0]?.deviceId || "",
                camera: videoDevices[0]?.deviceId || "",
            });
            setSelectedDevices({
                microphone: audioDevices[0]?.deviceId || "",
                camera: videoDevices[0]?.deviceId || "",
            });
        }
        catch (error) {
            console.error("Error getting devices:", error);
        }
    };
    const requestPermissions = async () => {
        try {
            setTestProgress("Requesting camera and microphone permissions...");
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            stream.getTracks().forEach(track => track.stop());
            onPermissionsChange("granted");
            setTestProgress("");
            await getAvailableDevices();
        }
        catch (error) {
            console.error("Permission denied:", error);
            onPermissionsChange("denied");
            setTestProgress("");
        }
    };
    const testVideoQuality = async () => {
        if (!videoRef.current || !streamRef.current) {
            throw new Error("Video stream not available");
        }
        const video = videoRef.current;
        const stream = streamRef.current;
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        // Wait for video to load and get actual metrics
        await new Promise(resolve => {
            video.onloadedmetadata = resolve;
        });
        // Get canvas for frame analysis
        const canvas = canvasRef.current;
        if (!canvas)
            throw new Error("Canvas not available");
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw new Error("Canvas context not available");
        // Analyze video quality
        const resolution = `${settings.width}x${settings.height}`;
        const frameRate = settings.frameRate || 30;
        const bitrate = settings.width && settings.height ?
            (settings.width * settings.height * frameRate * 0.1) : 0; // Rough estimate
        const codec = 'unknown'; // Codec detection not available in all browsers
        const colorDepth = 24; // Most webcams are 24-bit
        const aspectRatio = settings.width && settings.height ?
            (settings.width / settings.height).toFixed(2) : '16:9';
        // Capture frame for quality analysis
        canvas.width = settings.width || 640;
        canvas.height = settings.height || 480;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Analyze image quality (simplified)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let totalBrightness = 0;
        let totalContrast = 0;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
        }
        const avgBrightness = totalBrightness / (data.length / 4);
        // Determine quality based on resolution and frame rate
        let quality;
        const resolutionScore = (settings.width || 0) * (settings.height || 0);
        const frameRateScore = frameRate;
        if (resolutionScore >= 1920 * 1080 && frameRateScore >= 30)
            quality = 'excellent';
        else if (resolutionScore >= 1280 * 720 && frameRateScore >= 25)
            quality = 'good';
        else if (resolutionScore >= 640 * 480 && frameRateScore >= 20)
            quality = 'fair';
        else
            quality = 'poor';
        return {
            resolution,
            frameRate,
            bitrate: Math.round(bitrate),
            codec,
            colorDepth,
            aspectRatio,
            quality
        };
    };
    const testAudioQuality = async () => {
        if (!streamRef.current) {
            throw new Error("Audio stream not available");
        }
        const stream = streamRef.current;
        const audioTrack = stream.getAudioTracks()[0];
        const settings = audioTrack.getSettings();
        // Create audio context for analysis
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        // Get audio capabilities
        const sampleRate = audioContext.sampleRate;
        const bitDepth = 16; // Most web audio is 16-bit
        const channels = settings.channelCount || 1;
        const codec = 'unknown'; // Codec detection not available in all browsers
        // Analyze audio quality
        let quality;
        if (sampleRate >= 48000 && channels >= 2)
            quality = 'excellent';
        else if (sampleRate >= 44100 && channels >= 1)
            quality = 'good';
        else if (sampleRate >= 22050)
            quality = 'fair';
        else
            quality = 'poor';
        return {
            sampleRate,
            bitDepth,
            channels,
            codec,
            quality
        };
    };
    const testCodecSupport = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return null;
        canvas.width = 100;
        canvas.height = 100;
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
        const support = {
            webm: false,
            mp4: false,
            ogg: false,
            av1: false,
            h264: false,
            h265: false,
            vp8: false,
            vp9: false,
            aac: false,
            opus: false,
            vorbis: false
        };
        // Test video codecs
        const video = document.createElement('video');
        // Test WebM
        support.webm = video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
        support.vp8 = video.canPlayType('video/webm; codecs="vp8"') !== '';
        support.vp9 = video.canPlayType('video/webm; codecs="vp9"') !== '';
        // Test MP4
        support.mp4 = video.canPlayType('video/mp4') !== '';
        support.h264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '';
        support.h265 = video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') !== '';
        // Test OGG
        support.ogg = video.canPlayType('video/ogg; codecs="theora"') !== '';
        // Test AV1
        support.av1 = video.canPlayType('video/mp4; codecs="av01.0.08M.08"') !== '';
        // Test audio codecs
        support.aac = video.canPlayType('audio/mp4; codecs="mp4a.40.2"') !== '';
        support.opus = video.canPlayType('audio/ogg; codecs="opus"') !== '';
        support.vorbis = video.canPlayType('audio/ogg; codecs="vorbis"') !== '';
        return support;
    };
    const startVideoTest = async () => {
        if (permissionsStatus !== "granted") {
            await requestPermissions();
            return;
        }
        setIsTesting(true);
        setTestProgress("Starting video quality test...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedDevices.camera ? { exact: selectedDevices.camera } : undefined },
                audio: { deviceId: selectedDevices.microphone ? { exact: selectedDevices.microphone } : undefined }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            // Test video quality
            setTestProgress("Analyzing video quality...");
            const videoQualityMetrics = await testVideoQuality();
            setVideoQuality(videoQualityMetrics);
            // Test audio quality
            setTestProgress("Analyzing audio quality...");
            const audioQualityMetrics = await testAudioQuality();
            setAudioQuality(audioQualityMetrics);
            // Test codec support
            setTestProgress("Testing codec support...");
            const codecSupportData = testCodecSupport();
            setCodecSupport(codecSupportData);
            setTestProgress("Video test completed!");
            setTimeout(() => setTestProgress(""), 2000);
        }
        catch (error) {
            console.error("Error starting video test:", error);
            setTestProgress("Error: " + error.message);
        }
        finally {
            setIsTesting(false);
        }
    };
    const startRecording = async () => {
        if (!streamRef.current) {
            await startVideoTest();
            return;
        }
        try {
            setIsRecording(true);
            setRecordingTime(0);
            setRecordedBlob(null);
            const options = {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 2500000, // 2.5 Mbps
                audioBitsPerSecond: 128000 // 128 kbps
            };
            const mediaRecorder = new MediaRecorder(streamRef.current, options);
            mediaRecorderRef.current = mediaRecorder;
            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                setRecordedBlob(blob);
                // Analyze recording quality
                const duration = recordingTime;
                const fileSize = blob.size;
                const format = 'webm';
                setRecordingTest({
                    duration,
                    fileSize,
                    format,
                    quality: videoQuality,
                    audioQuality: audioQuality
                });
            };
            mediaRecorder.start();
            // Start recording timer
            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        catch (error) {
            console.error("Error starting recording:", error);
            setIsRecording(false);
        }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
                recordingIntervalRef.current = null;
            }
        }
    };
    const downloadRecording = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `video_test_${new Date().toISOString().split('T')[0]}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    const startMicrophoneTest = async () => {
        if (permissionsStatus !== "granted") {
            await requestPermissions();
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedDevices.microphone ? { exact: selectedDevices.microphone } : undefined }
            });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 256;
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            microphoneRef.current = source;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const updateVolume = () => {
                if (!analyserRef.current)
                    return;
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                const volume = (average / 255) * 100;
                const timestamp = Date.now();
                setMicSamples(prev => [...prev.slice(-50), { timestamp, volume }]);
                animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
        }
        catch (error) {
            console.error("Error starting microphone test:", error);
        }
    };
    const stopMicrophoneTest = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = undefined;
        }
        if (microphoneRef.current) {
            microphoneRef.current.disconnect();
            microphoneRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        // Calculate mic stats
        if (micSamples.length > 0) {
            const volumes = micSamples.map(s => s.volume);
            const averageVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
            const peakVolume = Math.max(...volumes);
            setMicStats({ averageVolume: Math.round(averageVolume), peakVolume: Math.round(peakVolume) });
        }
    };
    const getQualityColor = (quality) => {
        switch (quality) {
            case 'excellent': return 'success';
            case 'good': return 'info';
            case 'fair': return 'warning';
            case 'poor': return 'danger';
            default: return 'default';
        }
    };
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    useEffect(() => {
        getAvailableDevices();
    }, []);
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);
    return (_jsxs("div", { className: "space-y-8", children: [detailedAnalysisMode && (_jsx(Card, { title: "Media Tests - Detailed Analysis", subtitle: "Complete these tests to assess your media capabilities", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100", children: "Step 1: Grant Permissions" }), _jsx(Badge, { variant: permissionsStatus === "granted" ? "success" : "warning", children: permissionsStatus === "granted" ? "✅ Complete" : "⏳ Pending" })] }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200 mb-3", children: "Allow camera and microphone access to test your media devices." }), permissionsStatus !== "granted" && (_jsx(Button, { onClick: requestPermissions, size: "sm", variant: "primary", children: "Grant Permissions" }))] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100", children: "Step 2: Video Quality Test" }), _jsx(Badge, { variant: videoQuality ? "success" : "warning", children: videoQuality ? "✅ Complete" : "⏳ Pending" })] }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200 mb-3", children: "Test your camera quality and performance metrics." }), permissionsStatus === "granted" && !videoQuality && (_jsx(Button, { onClick: startVideoTest, loading: isTesting, size: "sm", variant: "primary", children: "Start Video Test" }))] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100", children: "Step 3: Microphone Test" }), _jsx(Badge, { variant: audioQuality ? "success" : "warning", children: audioQuality ? "✅ Complete" : "⏳ Pending" })] }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200 mb-3", children: "Test your microphone quality and audio performance." }), permissionsStatus === "granted" && !audioQuality && (_jsx(Button, { onClick: startMicrophoneTest, loading: isTesting, size: "sm", variant: "primary", children: "Start Microphone Test" }))] }), _jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-medium text-blue-900 dark:text-blue-100", children: "Step 4: Codec Support" }), _jsx(Badge, { variant: codecSupport ? "success" : "warning", children: codecSupport ? "✅ Complete" : "⏳ Pending" })] }), _jsx("p", { className: "text-sm text-blue-800 dark:text-blue-200 mb-3", children: "Check supported video and audio codecs." }), !codecSupport && (_jsx(Button, { onClick: testCodecSupport, size: "sm", variant: "primary", children: "Check Codec Support" }))] }), _jsxs("div", { className: "p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: [_jsx("h4", { className: "font-medium text-green-900 dark:text-green-100 mb-2", children: "Progress Summary" }), _jsx("div", { className: "text-sm text-green-800 dark:text-green-200", children: permissionsStatus === "granted" && videoQuality && audioQuality && codecSupport ? (_jsx("p", { children: "\uD83C\uDF89 All media tests completed! Your device is ready for video calls and streaming." })) : (_jsx("p", { children: "Complete the steps above to assess your media capabilities for video calls and streaming." })) })] })] }) })), _jsxs(Card, { title: "Device Configuration", subtitle: "Select your camera and microphone", children: [permissionsStatus !== "granted" && (_jsxs("div", { className: "mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "warning", className: "mr-2", children: "\u26A0\uFE0F" }), _jsx("span", { className: "text-sm text-yellow-800 dark:text-yellow-200", children: "Camera and microphone permissions are required for testing." })] }), _jsx(Button, { onClick: requestPermissions, className: "mt-2", size: "sm", children: "Grant Permissions" })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Camera" }), _jsx(Select, { value: selectedDevices.camera, onChange: (e) => setSelectedDevices(prev => ({ ...prev, camera: e.target.value })), children: _jsx("option", { value: devices.camera, children: "Default Camera" }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Microphone" }), _jsx(Select, { value: selectedDevices.microphone, onChange: (e) => setSelectedDevices(prev => ({ ...prev, microphone: e.target.value })), children: _jsx("option", { value: devices.microphone, children: "Default Microphone" }) })] })] })] }), _jsx(Card, { title: "Advanced Video Quality Test", subtitle: "Comprehensive video analysis", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex flex-col sm:flex-row gap-3", children: _jsx(Button, { onClick: startVideoTest, loading: isTesting, disabled: permissionsStatus !== "granted", className: "flex-1", children: isTesting ? testProgress || "Testing..." : "Start Video Quality Test" }) }), videoQuality && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Video Quality Metrics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Resolution" }), _jsx(Badge, { variant: getQualityColor(videoQuality.quality), children: videoQuality.quality })] }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: videoQuality.resolution })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Frame Rate" }), _jsx(Badge, { variant: getQualityColor(videoQuality.quality), children: videoQuality.quality })] }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [videoQuality.frameRate, " FPS"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Bitrate" }), _jsx(Badge, { variant: getQualityColor(videoQuality.quality), children: videoQuality.quality })] }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [videoQuality.bitrate, " kbps"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Codec" }) }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: videoQuality.codec })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Color Depth" }) }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [videoQuality.colorDepth, " bit"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Aspect Ratio" }) }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: videoQuality.aspectRatio })] })] })] })), audioQuality && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Audio Quality Metrics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Sample Rate" }), _jsx(Badge, { variant: getQualityColor(audioQuality.quality), children: audioQuality.quality })] }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [audioQuality.sampleRate, " Hz"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Bit Depth" }), _jsx(Badge, { variant: getQualityColor(audioQuality.quality), children: audioQuality.quality })] }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [audioQuality.bitDepth, " bit"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Channels" }), _jsx(Badge, { variant: getQualityColor(audioQuality.quality), children: audioQuality.quality })] }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: audioQuality.channels })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Codec" }) }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: audioQuality.codec })] })] })] })), codecSupport && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Codec Support" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3", children: Object.entries(codecSupport).map(([codec, supported]) => (_jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-center", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: codec.toUpperCase() }), _jsx(Badge, { variant: supported ? 'success' : 'danger', children: supported ? '✓' : '✗' })] }, codec))) })] }))] }) }), _jsx(Card, { title: "Video Recording Test", subtitle: "Record and analyze video quality", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsx(Button, { onClick: isRecording ? stopRecording : startRecording, disabled: permissionsStatus !== "granted", variant: isRecording ? "danger" : "primary", className: "flex-1", children: isRecording ? `Stop Recording (${recordingTime}s)` : "Start Recording" }), recordedBlob && (_jsx(Button, { onClick: downloadRecording, variant: "secondary", className: "flex-1", children: "Download Recording" }))] }), recordingTest && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Recording Analysis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Duration" }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [recordingTest.duration, "s"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "File Size" }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: formatFileSize(recordingTest.fileSize) })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Format" }), _jsx("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: recordingTest.format.toUpperCase() })] })] })] }))] }) }), _jsx(Card, { title: "Microphone Activity Test", subtitle: "Test microphone input and volume levels", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex flex-col sm:flex-row gap-3", children: _jsx(Button, { onClick: animationFrameRef.current ? stopMicrophoneTest : startMicrophoneTest, disabled: permissionsStatus !== "granted", variant: animationFrameRef.current ? "danger" : "primary", className: "flex-1", children: animationFrameRef.current ? "Stop Microphone Test" : "Start Microphone Test" }) }), micSamples.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Real-time Volume" }), _jsx("div", { className: "h-20 bg-gray-100 dark:bg-gray-800 rounded-md p-2", children: _jsx("div", { className: "flex items-end h-full space-x-1", children: micSamples.slice(-20).map((sample, index) => (_jsx("div", { className: "flex-1 bg-blue-500 rounded-sm transition-all duration-100", style: {
                                                height: `${Math.max(2, sample.volume)}%`,
                                                opacity: 0.3 + (sample.volume / 100) * 0.7
                                            } }, index))) }) }), micStats && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Average Volume" }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [micStats.averageVolume, "%"] })] }), _jsxs("div", { className: "p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md", children: [_jsx("div", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Peak Volume" }), _jsxs("div", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [micStats.peakVolume, "%"] })] })] }))] }))] }) }), _jsx("video", { ref: videoRef, autoPlay: true, muted: true, playsInline: true, className: "hidden", style: { width: '1px', height: '1px' } }), _jsx("canvas", { ref: canvasRef, className: "hidden" })] }));
}
