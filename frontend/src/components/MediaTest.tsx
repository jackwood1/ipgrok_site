import { useState, useRef, useEffect } from "react";
import { Card, Button, Badge, Select, Checkbox } from "./ui";

interface MediaTestProps {
  permissionsStatus: string;
  onPermissionsChange: (status: string) => void;
  onDataUpdate?: (data: any) => void;
}

export function MediaTest({ permissionsStatus, onPermissionsChange, onDataUpdate }: MediaTestProps) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputId, setSelectedInputId] = useState<string>("");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [mediaError, setMediaError] = useState<string>("");
  const [showMicVisualizer, setShowMicVisualizer] = useState(false);
  const [micSamples, setMicSamples] = useState<{ timestamp: number; volume: number }[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micSamplesRef = useRef<{ timestamp: number; volume: number }[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Update export data when media data changes
  useEffect(() => {
    if (onDataUpdate) {
      const micStats = micSamplesRef.current.length > 0 ? {
        averageVolume: micSamplesRef.current.reduce((acc, s) => acc + s.volume, 0) / micSamplesRef.current.length,
        peakVolume: Math.max(...micSamplesRef.current.map(s => s.volume), 0),
        samples: micSamplesRef.current,
      } : undefined;

      onDataUpdate({
        devices: {
          microphone: selectedInputId,
          camera: selectedVideoId,
        },
        permissions: permissionsStatus,
        micStats,
      });
    }
  }, [selectedInputId, selectedVideoId, permissionsStatus, micSamples, onDataUpdate]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputs = devices.filter(device => device.kind === "audioinput");
        const videos = devices.filter(device => device.kind === "videoinput");
        
        setInputDevices(inputs);
        setVideoDevices(videos);
        
        if (inputs.length > 0 && !selectedInputId) {
          setSelectedInputId(inputs[0].deviceId);
        }
        if (videos.length > 0 && !selectedVideoId) {
          setSelectedVideoId(videos[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting devices:", err);
      }
    };

    getDevices();
  }, [selectedInputId, selectedVideoId]);

  const startMediaPreview = async () => {
    try {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedInputId ? { deviceId: { exact: selectedInputId } } : true,
        video: selectedVideoId ? { deviceId: { exact: selectedVideoId } } : true,
      });

      setMediaStream(stream);
      setMediaError("");
      localStorage.setItem("mediaPermissions", "granted");
      onPermissionsChange("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start microphone visualization if enabled
      if (showMicVisualizer) {
        startMicVisualization(stream);
      }
    } catch (err) {
      localStorage.setItem("mediaPermissions", "denied");
      onPermissionsChange("denied");
      setMediaError("Could not access webcam or microphone. Please check permissions.");
    }
  };

  const startMicVisualization = (stream: MediaStream) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;
    
    setIsRecording(true);
    micSamplesRef.current = [];
    
    const updateVolume = () => {
      if (!analyserRef.current || !isRecording) return;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      const volume = (average / 255) * 100;
      
      const sample = { timestamp: Date.now(), volume };
      micSamplesRef.current.push(sample);
      setMicSamples(prev => [...prev, sample]);
      
      // Keep only last 100 samples
      if (micSamplesRef.current.length > 100) {
        micSamplesRef.current = micSamplesRef.current.slice(-100);
        setMicSamples(prev => prev.slice(-100));
      }
      
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };
    
    updateVolume();
  };

  const stopMicVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [mediaStream]);

  return (
    <Card 
      title="Webcam & Microphone Test" 
      subtitle="Test your camera and microphone for video calls"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Select
            label="Microphone"
            value={selectedInputId || ""}
            onChange={(e) => setSelectedInputId(e.target.value)}
          >
            {inputDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Select
            label="Camera"
            value={selectedVideoId || ""}
            onChange={(e) => setSelectedVideoId(e.target.value)}
          >
            {videoDevices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Checkbox
          checked={showMicVisualizer}
          onChange={() => setShowMicVisualizer(!showMicVisualizer)}
        >
          Show microphone activity visualization
        </Checkbox>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={startMediaPreview}
          variant="secondary"
          className="flex-1"
        >
          Start Camera & Mic Test
        </Button>
      </div>

      {mediaError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex items-center">
            <Badge variant="danger" className="mr-2">❌</Badge>
            <span className="text-sm text-red-800 dark:text-red-200">{mediaError}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Camera Preview</h4>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg object-cover"
          />
        </div>

        {showMicVisualizer && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Microphone Activity
              {isRecording && <Badge variant="success" className="ml-2">Recording</Badge>}
            </h4>
            <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-hidden">
              {micSamples.length > 0 ? (
                <div className="flex items-end justify-between h-full space-x-1">
                  {micSamples.slice(-20).map((sample, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-t"
                      style={{
                        width: '4px',
                        height: `${Math.min(sample.volume, 100)}%`,
                        minHeight: '2px'
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start test to see microphone activity
                </div>
              )}
            </div>
            {micSamples.length > 0 && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Peak: {Math.max(...micSamples.map(s => s.volume)).toFixed(1)}% | 
                Avg: {(micSamples.reduce((acc, s) => acc + s.volume, 0) / micSamples.length).toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
} 