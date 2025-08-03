import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Card, Button, Select, Checkbox, Badge } from "./ui";
export function MediaTest({ permissionsStatus, onPermissionsChange }) {
    // Mic/Webcam
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [mediaError, setMediaError] = useState(null);
    const animationFrameRef = useRef(null);
    const [micVolume, setMicVolume] = useState(0);
    const [micPeak, setMicPeak] = useState(0);
    const [isSilent, setIsSilent] = useState(false);
    const micSamplesRef = useRef([]);
    const [showMicVisualizer, setShowMicVisualizer] = useState(true);
    // Input device selector
    const [inputDevices, setInputDevices] = useState([]);
    const [selectedInputId, setSelectedInputId] = useState(() => localStorage.getItem("selectedInputId"));
    const [videoDevices, setVideoDevices] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(() => localStorage.getItem("selectedVideoId"));
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const audioInputs = devices.filter(d => d.kind === "audioinput");
            const videoInputs = devices.filter(d => d.kind === "videoinput");
            setInputDevices(audioInputs);
            setVideoDevices(videoInputs);
            if (!selectedInputId && audioInputs.length > 0)
                setSelectedInputId(audioInputs[0].deviceId);
            if (!selectedVideoId && videoInputs.length > 0)
                setSelectedVideoId(videoInputs[0].deviceId);
        });
    }, []);
    useEffect(() => {
        return () => {
            mediaStream?.getTracks().forEach(track => track.stop());
            if (animationFrameRef.current)
                cancelAnimationFrame(animationFrameRef.current);
        };
    }, [mediaStream]);
    useEffect(() => {
        if (selectedInputId) {
            localStorage.setItem("selectedInputId", selectedInputId);
        }
    }, [selectedInputId]);
    useEffect(() => {
        if (selectedVideoId) {
            localStorage.setItem("selectedVideoId", selectedVideoId);
        }
    }, [selectedVideoId]);
    useEffect(() => {
        if (permissionsStatus === "unknown") {
            startMediaPreview();
        }
    }, [permissionsStatus]);
    const startMediaPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true,
                audio: selectedInputId ? { deviceId: { exact: selectedInputId } } : true,
            });
            localStorage.setItem("mediaPermissions", "granted");
            onPermissionsChange("granted");
            if (videoRef.current)
                videoRef.current.srcObject = stream;
            setMediaStream(stream);
            setMediaError(null);
            const audioCtx = new AudioContext();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateVolume = () => {
                analyser.getByteTimeDomainData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const value = (dataArray[i] - 128) / 128;
                    sum += value * value;
                }
                const volume = Math.sqrt(sum / dataArray.length);
                setMicVolume(volume);
                setMicPeak(prev => Math.max(volume, prev * 0.95));
                setIsSilent(volume < 0.01);
                micSamplesRef.current.push({ timestamp: Date.now(), volume });
                if (micSamplesRef.current.length > 500)
                    micSamplesRef.current.shift();
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx && canvasRef.current) {
                    const { width, height } = canvasRef.current;
                    ctx.clearRect(0, 0, width, height);
                    ctx.beginPath();
                    for (let i = 0; i < dataArray.length; i++) {
                        const x = (i / dataArray.length) * width;
                        const y = (dataArray[i] / 255) * height;
                        ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = "#00FF00";
                    ctx.stroke();
                }
                animationFrameRef.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();
        }
        catch (err) {
            localStorage.setItem("mediaPermissions", "denied");
            onPermissionsChange("denied");
            setMediaError("Could not access webcam or microphone. Please check permissions.");
        }
    };
    const exportMicStats = () => {
        const samples = micSamplesRef.current;
        const peak = Math.max(...samples.map(s => s.volume));
        const avg = samples.reduce((acc, s) => acc + s.volume, 0) / samples.length;
        const blob = new Blob([JSON.stringify({ avg, peak, samples }, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `mic_stats_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs(Card, { title: "Webcam & Microphone Test", subtitle: "Test your camera and microphone for video calls", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsx("div", { children: _jsx(Select, { label: "Microphone", value: selectedInputId || "", onChange: (e) => setSelectedInputId(e.target.value), children: inputDevices.map(device => (_jsx("option", { value: device.deviceId, children: device.label || `Microphone ${device.deviceId}` }, device.deviceId))) }) }), _jsx("div", { children: _jsx(Select, { label: "Camera", value: selectedVideoId || "", onChange: (e) => setSelectedVideoId(e.target.value), children: videoDevices.map(device => (_jsx("option", { value: device.deviceId, children: device.label || `Camera ${device.deviceId}` }, device.deviceId))) }) })] }), _jsx("div", { className: "mb-6", children: _jsx(Checkbox, { checked: showMicVisualizer, onChange: () => setShowMicVisualizer(!showMicVisualizer), children: "Show microphone activity visualization" }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [_jsx(Button, { onClick: startMediaPreview, variant: "secondary", className: "flex-1", children: "Start Camera & Mic Test" }), _jsx(Button, { onClick: exportMicStats, variant: "info", size: "md", children: "Export Stats" })] }), mediaError && (_jsx("div", { className: "mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: "danger", className: "mr-2", children: "\u274C" }), _jsx("span", { className: "text-sm text-red-800 dark:text-red-200", children: mediaError })] }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Camera Preview" }), _jsx("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-48 bg-black rounded-lg border border-gray-200 dark:border-gray-700" })] }), showMicVisualizer && (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["Microphone Activity", _jsx("span", { className: "ml-1 cursor-help text-gray-400", title: "Green = current waveform. Yellow = recent peak.", children: "\u24D8" })] }), isSilent && (_jsx(Badge, { variant: "warning", size: "sm", children: "\u26A0\uFE0F Very low input" }))] }), _jsx("canvas", { ref: canvasRef, className: "w-full h-12 bg-black rounded-lg border border-gray-200 dark:border-gray-700" })] }))] })] }));
}
