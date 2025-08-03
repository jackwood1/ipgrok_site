import { useState, useEffect } from "react";
import { Card, Badge } from "./ui";

interface SystemInfo {
  ipAddress: string;
  userAgent: string;
  platform: string;
  language: string;
  languages: readonly string[];
  cookieEnabled: boolean;
  doNotTrack: string | null;
  onLine: boolean;
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  dateTime: string;
  localStorage: boolean;
  sessionStorage: boolean;
  webGL: boolean;
  webGLVendor?: string;
  webGLRenderer?: string;
  batteryLevel?: number;
  batteryCharging?: boolean;
  cores?: number;
  memory?: number;
}

interface ConfigInfoProps {
  onDataUpdate?: (data: any) => void;
}

export function ConfigInfo({ onDataUpdate }: ConfigInfoProps) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update export data when system info changes
  useEffect(() => {
    if (onDataUpdate && systemInfo) {
      onDataUpdate(systemInfo);
    }
  }, [systemInfo, onDataUpdate]);

  useEffect(() => {
    const gatherSystemInfo = async () => {
      try {
        // Get IP address
        let ipAddress = "Unknown";
        try {
          const response = await fetch("https://api.ipify.org?format=json");
          const data = await response.json();
          ipAddress = data.ip;
        } catch {
          try {
            const response = await fetch("https://httpbin.org/ip");
            const data = await response.json();
            ipAddress = data.origin;
          } catch {
            ipAddress = "Could not determine";
          }
        }

        // Get connection info
        let connectionType = "Unknown";
        let effectiveType = "Unknown";
        let downlink = 0;
        let rtt = 0;

        if ('connection' in navigator) {
          const connection = (navigator as any).connection;
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
            const battery = await (navigator as any).getBattery();
            batteryLevel = Math.round(battery.level * 100);
            batteryCharging = battery.charging;
          } catch {
            // Battery API not available
          }
        }

        // Get hardware info
        let cores = undefined;
        let memory = undefined;

        if ('hardwareConcurrency' in navigator) {
          cores = (navigator as any).hardwareConcurrency;
        }

        if ('deviceMemory' in navigator) {
          memory = (navigator as any).deviceMemory;
        }

        // Get WebGL info
        let webGL = false;
        let webGLVendor = undefined;
        let webGLRenderer = undefined;

        try {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
          if (gl) {
            webGL = true;
            webGLVendor = gl.getParameter(gl.VENDOR) as string;
            webGLRenderer = gl.getParameter(gl.RENDERER) as string;
          }
        } catch {
          webGL = false;
        }

        const info: SystemInfo = {
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
            } catch {
              return false;
            }
          })(),
          sessionStorage: (() => {
            try {
              sessionStorage.setItem('test', 'test');
              sessionStorage.removeItem('test');
              return true;
            } catch {
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
      } catch (err) {
        setError("Failed to gather system information");
      } finally {
        setLoading(false);
      }
    };

    gatherSystemInfo();
  }, []);

  const getStatusBadge = (value: boolean | string | number | undefined) => {
    if (typeof value === 'boolean') {
      return value ? <Badge variant="success">Yes</Badge> : <Badge variant="danger">No</Badge>;
    }
    if (value === undefined || value === null) {
      return <Badge variant="warning">Unknown</Badge>;
    }
    if (typeof value === 'string' && value === "Unknown") {
      return <Badge variant="warning">Unknown</Badge>;
    }
    return <Badge variant="info">{String(value)}</Badge>;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card title="System Configuration" subtitle="Gathering client information...">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="System Configuration" subtitle="Error loading configuration">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <Badge variant="danger" className="mr-2">❌</Badge>
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!systemInfo) return null;

  return (
    <div className="space-y-6">
      {/* Network Information */}
      <Card title="Network Information" subtitle="Connection and network details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">IP Address</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900 dark:text-white font-mono">{systemInfo.ipAddress}</span>
                {systemInfo.ipAddress !== "Unknown" && systemInfo.ipAddress !== "Could not determine" && (
                  <Badge variant="success">Public</Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Online Status</span>
              {getStatusBadge(systemInfo.onLine)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Connection Type</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.connectionType}</span>
            </div>
            {systemInfo.downlink && systemInfo.downlink > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Downlink</span>
                <span className="text-sm text-gray-900 dark:text-white">{systemInfo.downlink} Mbps</span>
              </div>
            )}
            {systemInfo.rtt && systemInfo.rtt > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RTT</span>
                <span className="text-sm text-gray-900 dark:text-white">{systemInfo.rtt}ms</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Browser Information */}
      <Card title="Browser Information" subtitle="Browser and platform details">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Agent</label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <code className="text-xs text-gray-900 dark:text-white break-all">{systemInfo.userAgent}</code>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.platform}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.language}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cookies Enabled</span>
              {getStatusBadge(systemInfo.cookieEnabled)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Do Not Track</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.doNotTrack || "Not set"}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Display Information */}
      <Card title="Display Information" subtitle="Screen and graphics details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Screen Resolution</span>
            <span className="text-sm text-gray-900 dark:text-white">{systemInfo.screenResolution}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Depth</span>
            <span className="text-sm text-gray-900 dark:text-white">{systemInfo.colorDepth} bit</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WebGL Support</span>
            {getStatusBadge(systemInfo.webGL)}
          </div>
          {systemInfo.webGLVendor && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WebGL Vendor</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.webGLVendor}</span>
            </div>
          )}
        </div>
      </Card>

      {/* System Information */}
      <Card title="System Information" subtitle="Hardware and system details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</span>
            <span className="text-sm text-gray-900 dark:text-white">{systemInfo.timezone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Time</span>
            <span className="text-sm text-gray-900 dark:text-white">{systemInfo.dateTime}</span>
          </div>
          {systemInfo.cores && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Cores</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.cores}</span>
            </div>
          )}
          {systemInfo.memory && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Device Memory</span>
              <span className="text-sm text-gray-900 dark:text-white">{systemInfo.memory} GB</span>
            </div>
          )}
          {systemInfo.batteryLevel !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery Level</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-900 dark:text-white">{systemInfo.batteryLevel}%</span>
                {systemInfo.batteryCharging && <Badge variant="success">Charging</Badge>}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Storage Information */}
      <Card title="Storage Information" subtitle="Browser storage capabilities">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Local Storage</span>
            {getStatusBadge(systemInfo.localStorage)}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Storage</span>
            {getStatusBadge(systemInfo.sessionStorage)}
          </div>
        </div>
      </Card>

      {/* Additional Languages */}
      {systemInfo.languages.length > 1 && (
        <Card title="Supported Languages" subtitle="Browser language preferences">
          <div className="space-y-2">
            {systemInfo.languages.map((lang, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Language {index + 1}
                </span>
                <span className="text-sm text-gray-900 dark:text-white">{lang}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 