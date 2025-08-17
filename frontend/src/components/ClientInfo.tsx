import { Button } from "./ui";
import { getClientInfo } from "../utils";

export function ClientInfo() {
  return (
    <div className="space-y-8">
      {/* Client Info Header */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">💻</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Client Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Detailed information about your device, browser, and network capabilities.
        </p>
      </div>

      <div className="space-y-6">
        {/* Client Identifier */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            🆔 Client Identifier
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Unique Client ID</h5>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">UUID:</span>
                  <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                    {getClientInfo().uuid}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(getClientInfo().uuid)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>This unique identifier helps track your test results and maintain privacy. It's stored locally in your browser and not shared with external servers.</p>
            </div>
          </div>
        </div>

        {/* Client Statistics */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            📊 Client Statistics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Visit Information</h5>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div><span className="font-medium">Created:</span> {new Date(getClientInfo().createdAt).toLocaleString()}</div>
                <div><span className="font-medium">Last Seen:</span> {new Date(getClientInfo().lastSeen).toLocaleString()}</div>
                <div><span className="font-medium">Visit Count:</span> {getClientInfo().visitCount}</div>
                <div><span className="font-medium">Session ID:</span> <code className="text-xs">{getClientInfo().sessionId}</code></div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Network Information</h5>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div><span className="font-medium">Network Type:</span> {getClientInfo().networkType || 'Unknown'}</div>
                <div><span className="font-medium">RTT:</span> {getClientInfo().rtt || 'Unknown'} ms</div>
                <div><span className="font-medium">Downlink:</span> {getClientInfo().downlink || 'Unknown'} Mbps</div>
                <div><span className="font-medium">Public IP:</span> {getClientInfo().publicIp || 'Not detected'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            🖥️ System Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Operating System</h5>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div><span className="font-medium">Platform:</span> {navigator.platform}</div>
                <div><span className="font-medium">User Agent:</span> {navigator.userAgent}</div>
                <div><span className="font-medium">Language:</span> {navigator.language}</div>
                <div><span className="font-medium">Languages:</span> {navigator.languages?.join(', ')}</div>
                <div><span className="font-medium">Cookie Enabled:</span> {navigator.cookieEnabled ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Online:</span> {navigator.onLine ? 'Yes' : 'No'}</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Browser Capabilities</h5>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <div><span className="font-medium">Java Enabled:</span> {navigator.javaEnabled() ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Do Not Track:</span> {navigator.doNotTrack || 'Not Set'}</div>
                <div><span className="font-medium">Hardware Concurrency:</span> {navigator.hardwareConcurrency || 'Unknown'}</div>
                <div><span className="font-medium">Max Touch Points:</span> {navigator.maxTouchPoints || '0'}</div>
                <div><span className="font-medium">Vendor:</span> {navigator.vendor}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Information */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
            📱 Display & Screen
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Screen Properties</h5>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <div><span className="font-medium">Width:</span> {screen.width}px</div>
                <div><span className="font-medium">Height:</span> {screen.height}px</div>
                <div><span className="font-medium">Available Width:</span> {screen.availWidth}px</div>
                <div><span className="font-medium">Available Height:</span> {screen.availHeight}px</div>
                <div><span className="font-medium">Color Depth:</span> {screen.colorDepth} bits</div>
                <div><span className="font-medium">Pixel Depth:</span> {screen.pixelDepth} bits</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Viewport & Window</h5>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <div><span className="font-medium">Inner Width:</span> {window.innerWidth}px</div>
                <div><span className="font-medium">Inner Height:</span> {window.innerHeight}px</div>
                <div><span className="font-medium">Outer Width:</span> {window.outerWidth}px</div>
                <div><span className="font-medium">Outer Height:</span> {window.outerHeight}px</div>
                <div><span className="font-medium">Device Pixel Ratio:</span> {window.devicePixelRatio || '1'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Network & Connection */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
            🌐 Network & Connection
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Connection Info</h5>
              <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <div><span className="font-medium">Connection Type:</span> {(navigator as any).connection?.effectiveType || 'Unknown'}</div>
                <div><span className="font-medium">Downlink:</span> {(navigator as any).connection?.downlink || 'Unknown'} Mbps</div>
                <div><span className="font-medium">RTT:</span> {(navigator as any).connection?.rtt || 'Unknown'} ms</div>
                <div><span className="font-medium">Save Data:</span> {(navigator as any).connection?.saveData ? 'Yes' : 'No'}</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Geolocation</h5>
              <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <div><span className="font-medium">Geolocation:</span> {navigator.geolocation ? 'Available' : 'Not Available'}</div>
                <div><span className="font-medium">Timezone:</span> {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
                <div><span className="font-medium">Date/Time:</span> {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ISP Information */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
            🏢 ISP & Network Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Network Provider</h5>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <div><span className="font-medium">Connection Type:</span> {(navigator as any).connection?.effectiveType || 'Unknown'}</div>
                <div><span className="font-medium">Network Type:</span> {(navigator as any).connection?.type || 'Unknown'}</div>
                <div><span className="font-medium">Downlink Speed:</span> {(navigator as any).connection?.downlink || 'Unknown'} Mbps</div>
                <div><span className="font-medium">Round Trip Time:</span> {(navigator as any).connection?.rtt || 'Unknown'} ms</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">Network Features</h5>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <div><span className="font-medium">Save Data Mode:</span> {(navigator as any).connection?.saveData ? 'Enabled' : 'Disabled'}</div>
                <div><span className="font-medium">Network Priority:</span> {(navigator as any).connection?.downlinkMax || 'Not Specified'}</div>
                <div><span className="font-medium">IP Version:</span> {window.location.protocol === 'https:' ? 'IPv4/IPv6' : 'IPv4'}</div>
                <div><span className="font-medium">Secure Connection:</span> {window.location.protocol === 'https:' ? 'Yes (HTTPS)' : 'No (HTTP)'}</div>
              </div>
            </div>
          </div>
          
          {/* ISP Detection Note */}
          <div className="mt-4 p-3 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg">
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              <strong>💡 Note:</strong> ISP identification requires external services and may not be available due to privacy restrictions. 
              For detailed ISP information, consider using specialized network testing tools or contacting your internet service provider directly.
            </p>
          </div>
        </div>

        {/* Helpful Information */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
            💡 Understanding Your Client Information
          </h4>
          <div className="text-sm text-amber-800 dark:text-amber-200 space-y-3">
            <div>
              <h5 className="font-medium mb-2">🖥️ System Information</h5>
              <p>This section shows your device's operating system, browser capabilities, and language settings. This information helps websites provide appropriate content and functionality for your device.</p>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">📱 Display & Screen</h5>
              <p>Screen resolution, color depth, and viewport dimensions help websites optimize layouts and images for your specific display. Higher pixel density displays (like Retina screens) provide sharper images.</p>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">🌐 Network & Connection</h5>
              <p>Connection speed, latency, and type help websites adjust content delivery. Faster connections can handle higher quality media, while slower connections may receive optimized versions.</p>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">🔒 Privacy Note</h5>
              <p>This information is collected locally in your browser and not sent to external servers. It's useful for troubleshooting device-specific issues and understanding how websites adapt to your setup.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
