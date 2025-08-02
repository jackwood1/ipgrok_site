import { useEffect, useRef, useState } from "react";

interface MediaTestProps {
  permissionsStatus: string;
  onPermissionsChange: (status: string) => void;
}

export function MediaTest({ permissionsStatus, onPermissionsChange }: MediaTestProps) {
  // Mic/Webcam
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const [micPeak, setMicPeak] = useState(0);
  const [isSilent, setIsSilent] = useState(false);
  const micSamplesRef = useRef<{ timestamp: number; volume: number }[]>([]);
  const [showMicVisualizer, setShowMicVisualizer] = useState(true);

  // Input device selector
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string | null>(() => localStorage.getItem("selectedInputId"));
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(() => localStorage.getItem("selectedVideoId"));

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const audioInputs = devices.filter(d => d.kind === "audioinput");
      const videoInputs = devices.filter(d => d.kind === "videoinput");
      setInputDevices(audioInputs);
      setVideoDevices(videoInputs);
      if (!selectedInputId && audioInputs.length > 0) setSelectedInputId(audioInputs[0].deviceId);
      if (!selectedVideoId && videoInputs.length > 0) setSelectedVideoId(videoInputs[0].deviceId);
    });
  }, []);

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach(track => track.stop());
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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
      if (videoRef.current) videoRef.current.srcObject = stream;
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
        if (micSamplesRef.current.length > 500) micSamplesRef.current.shift();

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
    } catch (err) {
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

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-2">Webcam & Microphone Test</h2>

      <label className="block mb-2">Select Microphone:</label>
      <select
        value={selectedInputId || ""}
        onChange={(e) => setSelectedInputId(e.target.value)}
        className="mb-4 px-3 py-2 border rounded"
      >
        {inputDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId}`}
          </option>
        ))}
      </select>

      <label className="block mb-2">Select Camera:</label>
      <select
        value={selectedVideoId || ""}
        onChange={(e) => setSelectedVideoId(e.target.value)}
        className="mb-4 px-3 py-2 border rounded"
      >
        {videoDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={showMicVisualizer}
          onChange={() => setShowMicVisualizer(!showMicVisualizer)}
        />
        <label>Show Mic Activity Bar</label>
      </div>

      <button
        onClick={startMediaPreview}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Start Camera & Mic Test
      </button>

      {mediaError && <p className="text-red-500 mt-2">{mediaError}</p>}

      <video ref={videoRef} autoPlay playsInline muted className="mt-4 w-full max-w-md h-64 bg-black rounded" />

      {showMicVisualizer && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Mic Activity
              <span className="ml-1 cursor-help" title="Green = current waveform. Yellow = recent peak.">ⓘ</span>
            </span>
            {isSilent && <span className="text-yellow-500 text-sm">⚠️ Very low mic input</span>}
          </div>
          <canvas ref={canvasRef} className="w-full h-12 bg-black rounded mt-1" />
        </div>
      )}

      <button
        onClick={exportMicStats}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Export Mic Stats (JSON)
      </button>
    </div>
  );
} 