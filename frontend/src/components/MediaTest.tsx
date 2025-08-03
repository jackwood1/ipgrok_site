import { useState, useEffect, useRef } from "react";
import { Card, Button, Badge, Select } from "./ui";

interface MediaTestProps {
  permissionsStatus: string;
  onPermissionsChange: (status: string) => void;
  onDataUpdate?: (data: any) => void;
}

interface VideoQualityMetrics {
  resolution: string;
  frameRate: number;
  bitrate: number;
  codec: string;
  colorDepth: number;
  aspectRatio: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface AudioQualityMetrics {
  sampleRate: number;
  bitDepth: number;
  channels: number;
  codec: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

interface RecordingTest {
  duration: number;
  fileSize: number;
  format: string;
  quality: VideoQualityMetrics;
  audioQuality: AudioQualityMetrics;
}

export function MediaTest({ permissionsStatus, onPermissionsChange, onDataUpdate }: MediaTestProps) {
  const [devices, setDevices] = useState<{ microphone: string; camera: string }>({
    microphone: "",
    camera: "",
  });
  const [selectedDevices, setSelectedDevices] = useState<{ microphone: string; camera: string }>({
    microphone: "",
    camera: "",
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTest, setRecordingTest] = useState<RecordingTest | null>(null);
  const [videoQuality, setVideoQuality] = useState<VideoQualityMetrics | null>(null);
  const [audioQuality, setAudioQuality] = useState<AudioQualityMetrics | null>(null);
  const [codecSupport, setCodecSupport] = useState<any>(null);
  const [testProgress, setTestProgress] = useState<string>("");
  const [micSamples, setMicSamples] = useState<{ timestamp: number; volume: number }[]>([]);
  const [micStats, setMicStats] = useState<{ averageVolume: number; peakVolume: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const recordingIntervalRef = useRef<number | null>(null);

  // Update export data when results change
  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate({
        devices,
        permissions: permissionsStatus,
        micStats,
        videoQuality,
        audioQuality,
        codecSupport,
        recordingTest,
      });
    }
  }, [devices, permissionsStatus, micStats, videoQuality, audioQuality, codecSupport, recordingTest, onDataUpdate]);

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
    } catch (error) {
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
    } catch (error) {
      console.error("Permission denied:", error);
      onPermissionsChange("denied");
      setTestProgress("");
    }
  };

  const testVideoQuality = async (): Promise<VideoQualityMetrics> => {
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
    if (!canvas) throw new Error("Canvas not available");

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas context not available");

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
    let quality: 'excellent' | 'good' | 'fair' | 'poor';
    const resolutionScore = (settings.width || 0) * (settings.height || 0);
    const frameRateScore = frameRate;

    if (resolutionScore >= 1920 * 1080 && frameRateScore >= 30) quality = 'excellent';
    else if (resolutionScore >= 1280 * 720 && frameRateScore >= 25) quality = 'good';
    else if (resolutionScore >= 640 * 480 && frameRateScore >= 20) quality = 'fair';
    else quality = 'poor';

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

  const testAudioQuality = async (): Promise<AudioQualityMetrics> => {
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
    let quality: 'excellent' | 'good' | 'fair' | 'poor';
    if (sampleRate >= 48000 && channels >= 2) quality = 'excellent';
    else if (sampleRate >= 44100 && channels >= 1) quality = 'good';
    else if (sampleRate >= 22050) quality = 'fair';
    else quality = 'poor';

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
    if (!ctx) return null;

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

    } catch (error) {
      console.error("Error starting video test:", error);
      setTestProgress("Error: " + (error as Error).message);
    } finally {
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
        audioBitsPerSecond: 128000   // 128 kbps
      };

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      
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
          quality: videoQuality!,
          audioQuality: audioQuality!
        });
      };

      mediaRecorder.start();
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
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
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        const volume = (average / 255) * 100;

        const timestamp = Date.now();
        setMicSamples(prev => [...prev.slice(-50), { timestamp, volume }]);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();

    } catch (error) {
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

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'poor': return 'danger';
      default: return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
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

  return (
    <div className="space-y-8">
      {/* Device Selection */}
      <Card title="Device Configuration" subtitle="Select your camera and microphone">
        {permissionsStatus !== "granted" && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-center">
              <Badge variant="warning" className="mr-2">⚠️</Badge>
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Camera and microphone permissions are required for testing.
              </span>
            </div>
            <Button onClick={requestPermissions} className="mt-2" size="sm">
              Grant Permissions
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Camera
            </label>
            <Select
              value={selectedDevices.camera}
              onChange={(e) => setSelectedDevices(prev => ({ ...prev, camera: e.target.value }))}
            >
              <option value={devices.camera}>Default Camera</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Microphone
            </label>
            <Select
              value={selectedDevices.microphone}
              onChange={(e) => setSelectedDevices(prev => ({ ...prev, microphone: e.target.value }))}
            >
              <option value={devices.microphone}>Default Microphone</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Video Quality Test */}
      <Card title="Advanced Video Quality Test" subtitle="Comprehensive video analysis">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={startVideoTest}
              loading={isTesting}
              disabled={permissionsStatus !== "granted"}
              className="flex-1"
            >
              {isTesting ? testProgress || "Testing..." : "Start Video Quality Test"}
            </Button>
          </div>

          {videoQuality && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Video Quality Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</span>
                    <Badge variant={getQualityColor(videoQuality.quality)}>
                      {videoQuality.quality}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {videoQuality.resolution}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frame Rate</span>
                    <Badge variant={getQualityColor(videoQuality.quality)}>
                      {videoQuality.quality}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {videoQuality.frameRate} FPS
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bitrate</span>
                    <Badge variant={getQualityColor(videoQuality.quality)}>
                      {videoQuality.quality}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {videoQuality.bitrate} kbps
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Codec</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {videoQuality.codec}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Depth</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {videoQuality.colorDepth} bit
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aspect Ratio</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {videoQuality.aspectRatio}
                  </div>
                </div>
              </div>
            </div>
          )}

          {audioQuality && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Audio Quality Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sample Rate</span>
                    <Badge variant={getQualityColor(audioQuality.quality)}>
                      {audioQuality.quality}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {audioQuality.sampleRate} Hz
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bit Depth</span>
                    <Badge variant={getQualityColor(audioQuality.quality)}>
                      {audioQuality.quality}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {audioQuality.bitDepth} bit
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Channels</span>
                    <Badge variant={getQualityColor(audioQuality.quality)}>
                      {audioQuality.quality}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {audioQuality.channels}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Codec</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {audioQuality.codec}
                  </div>
                </div>
              </div>
            </div>
          )}

          {codecSupport && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Codec Support</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Object.entries(codecSupport).map(([codec, supported]) => (
                  <div key={codec} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-center">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {codec.toUpperCase()}
                    </div>
                    <Badge variant={supported ? 'success' : 'danger'}>
                      {supported ? '✓' : '✗'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Video Recording Test */}
      <Card title="Video Recording Test" subtitle="Record and analyze video quality">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={permissionsStatus !== "granted"}
              variant={isRecording ? "danger" : "primary"}
              className="flex-1"
            >
              {isRecording ? `Stop Recording (${recordingTime}s)` : "Start Recording"}
            </Button>
            
            {recordedBlob && (
              <Button
                onClick={downloadRecording}
                variant="secondary"
                className="flex-1"
              >
                Download Recording
              </Button>
            )}
          </div>

          {recordingTest && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Recording Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {recordingTest.duration}s
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File Size
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatFileSize(recordingTest.fileSize)}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Format
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {recordingTest.format.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Microphone Test */}
      <Card title="Microphone Activity Test" subtitle="Test microphone input and volume levels">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={animationFrameRef.current ? stopMicrophoneTest : startMicrophoneTest}
              disabled={permissionsStatus !== "granted"}
              variant={animationFrameRef.current ? "danger" : "primary"}
              className="flex-1"
            >
              {animationFrameRef.current ? "Stop Microphone Test" : "Start Microphone Test"}
            </Button>
          </div>

          {micSamples.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Real-time Volume</h4>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                <div className="flex items-end h-full space-x-1">
                  {micSamples.slice(-20).map((sample, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-blue-500 rounded-sm transition-all duration-100"
                      style={{
                        height: `${Math.max(2, sample.volume)}%`,
                        opacity: 0.3 + (sample.volume / 100) * 0.7
                      }}
                    />
                  ))}
                </div>
              </div>

              {micStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Average Volume
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {micStats.averageVolume}%
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Peak Volume
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {micStats.peakVolume}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Hidden video element for testing */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="hidden"
        style={{ width: '1px', height: '1px' }}
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 