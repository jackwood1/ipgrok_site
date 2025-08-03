import { Card } from "./ui";

export function Help() {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Help & Documentation
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive guide to understanding network and media testing
        </p>
      </div>

      {/* Quick Start Guide */}
      <Card title="Quick Start Guide" subtitle="Get started with testing in minutes">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1. Quick Test</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Start with the Quick Test tab for a rapid assessment of your system's readiness for video calls.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">2. Network Tests</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Run comprehensive network tests including speed, ping, traceroute, and advanced diagnostics.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">3. Media Tests</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Test your camera and microphone with advanced quality analysis and recording capabilities.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Network Testing Guide */}
      <Card title="Network Testing Guide" subtitle="Understanding network performance tests">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Speed Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                The speed test measures your internet connection's download and upload speeds, which are crucial for video calls.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How it works:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Downloads a 5MB test file to measure download speed</li>
                  <li>• Uploads a 2MB file to measure upload speed</li>
                  <li>• Calculates bandwidth score based on both speeds</li>
                  <li>• Simulates packet loss using multiple HTTP requests</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Interpreting Results:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>Download Speed:</strong> 50+ Mbps (Excellent), 25+ Mbps (Good), 10+ Mbps (Fair), &lt;10 Mbps (Poor)</li>
                  <li><strong>Upload Speed:</strong> 25+ Mbps (Excellent), 10+ Mbps (Good), 5+ Mbps (Fair), &lt;5 Mbps (Poor)</li>
                  <li><strong>Packet Loss:</strong> ≤1% (Excellent), ≤3% (Good), &gt;3% (Poor)</li>
                  <li><strong>Connection Quality:</strong> A (90-100), B (80-89), C (70-79), D (60-69), F (&lt;60)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Ping Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Ping tests measure the time it takes for data to travel to a server and back, indicating network latency.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How it works:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Sends HTTP requests to the specified host</li>
                  <li>• Measures round-trip time for each request</li>
                  <li>• Calculates success rate and average response time</li>
                  <li>• Uses browser-compatible HTTP requests (not ICMP)</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Interpreting Results:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>Response Time:</strong> ≤50ms (Excellent), ≤100ms (Good), ≤200ms (Fair), &gt;200ms (Poor)</li>
                  <li><strong>Success Rate:</strong> 100% (Perfect), 95%+ (Good), 90%+ (Fair), &lt;90% (Poor)</li>
                  <li><strong>For Video Calls:</strong> Lower latency means less delay in conversations</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Traceroute Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Traceroute shows the network path your data takes to reach a destination, helping identify bottlenecks.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">How it works:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Uses HTTP requests with increasing timeouts to simulate traceroute</li>
                  <li>• Resolves IP addresses and domain names for each hop</li>
                  <li>• Shows response time for each network hop</li>
                  <li>• Identifies where network delays occur</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Interpreting Results:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>Hop Count:</strong> Fewer hops generally mean faster connection</li>
                  <li><strong>Response Times:</strong> Look for hops with significantly higher latency</li>
                  <li><strong>Timeouts:</strong> Indicate network issues or firewalls</li>
                  <li><strong>IP/FQDN:</strong> Shows both IP addresses and domain names</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Advanced Network Tests</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">DNS Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Tests how quickly your network can resolve domain names to IP addresses.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Thresholds:</strong> ≤50ms (Excellent), ≤100ms (Good), ≤200ms (Fair), &gt;200ms (Poor)
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">HTTP/HTTPS Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Compares performance between HTTP and HTTPS protocols.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>HTTP:</strong> ≤100ms (Excellent), ≤200ms (Good), ≤500ms (Fair), &gt;500ms (Poor)<br/>
                    <strong>HTTPS:</strong> ≤150ms (Excellent), ≤300ms (Good), ≤600ms (Fair), &gt;600ms (Poor)
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">CDN Performance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Tests performance of Content Delivery Networks used by many websites.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Thresholds:</strong> ≤200ms (Excellent), ≤400ms (Good), ≤800ms (Fair), &gt;800ms (Poor)
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">VPN Detection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Identifies if you're using a VPN and provides confidence level.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Detection Methods:</strong> Known VPN providers, datacenter IPs, timezone mismatches
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Network Type Detection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Automatically detects your connection type (fiber, cable, DSL, mobile).
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Types:</strong> Fiber (fastest), Cable, DSL, Mobile (slowest)
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security Tests</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Validates SSL certificates and detects firewalls or proxies.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Tests:</strong> SSL validity, firewall detection, proxy detection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Media Testing Guide */}
      <Card title="Media Testing Guide" subtitle="Understanding camera and microphone tests">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Video Quality Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Comprehensive analysis of your camera's capabilities and video quality.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Metrics Measured:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Resolution:</strong> Maximum supported resolution (e.g., 1920x1080)</li>
                  <li>• <strong>Frame Rate:</strong> Frames per second (FPS) capability</li>
                  <li>• <strong>Bitrate:</strong> Estimated video data rate</li>
                  <li>• <strong>Color Depth:</strong> Color information depth (typically 24-bit)</li>
                  <li>• <strong>Aspect Ratio:</strong> Width to height ratio</li>
                  <li>• <strong>Quality Grade:</strong> Overall assessment (A-F)</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quality Standards:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>Excellent (A):</strong> 1920x1080+ resolution, 30+ FPS</li>
                  <li><strong>Good (B):</strong> 1280x720+ resolution, 25+ FPS</li>
                  <li><strong>Fair (C):</strong> 640x480+ resolution, 20+ FPS</li>
                  <li><strong>Poor (F):</strong> Lower resolution or frame rates</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Audio Quality Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Analysis of your microphone's audio capabilities and quality.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Metrics Measured:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Sample Rate:</strong> Audio sampling frequency (Hz)</li>
                  <li>• <strong>Bit Depth:</strong> Audio quality depth (typically 16-bit)</li>
                  <li>• <strong>Channels:</strong> Mono (1) or stereo (2) audio</li>
                  <li>• <strong>Codec:</strong> Audio compression format</li>
                  <li>• <strong>Quality Grade:</strong> Overall assessment (A-F)</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quality Standards:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li><strong>Excellent:</strong> 48kHz+ sample rate, stereo channels</li>
                  <li><strong>Good:</strong> 44.1kHz+ sample rate, mono/stereo</li>
                  <li><strong>Fair:</strong> 22kHz+ sample rate</li>
                  <li><strong>Poor:</strong> Lower sample rates</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Codec Support Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Tests browser support for various video and audio codecs used in web applications.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Codecs Tested:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">Video Codecs:</h5>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• WebM (VP8, VP9)</li>
                      <li>• MP4 (H.264, H.265)</li>
                      <li>• OGG (Theora)</li>
                      <li>• AV1</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">Audio Codecs:</h5>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• AAC</li>
                      <li>• Opus</li>
                      <li>• Vorbis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Video Recording Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Records a test video to analyze actual recording quality and file characteristics.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recording Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Format:</strong> WebM with VP8 video and Opus audio</li>
                  <li>• <strong>Quality:</strong> 2.5 Mbps video, 128 kbps audio</li>
                  <li>• <strong>Duration:</strong> Real-time recording with timer</li>
                  <li>• <strong>File Size:</strong> Automatic calculation and formatting</li>
                  <li>• <strong>Download:</strong> Save recordings for analysis</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Microphone Activity Test</h3>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                Real-time visualization and analysis of microphone input levels.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Real-time Visualization:</strong> Live volume level display</li>
                  <li>• <strong>Volume Analysis:</strong> Peak and average volume calculation</li>
                  <li>• <strong>Sample Collection:</strong> Continuous volume sampling</li>
                  <li>• <strong>Visual Feedback:</strong> Color-coded volume indicators</li>
                  <li>• <strong>Statistical Analysis:</strong> Comprehensive microphone metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* System Information Guide */}
      <Card title="System Information Guide" subtitle="Understanding system configuration data">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Network Information</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Collected:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>IP Address:</strong> Your public IP address</li>
                  <li>• <strong>Online Status:</strong> Internet connectivity status</li>
                  <li>• <strong>Connection Type:</strong> Network connection type</li>
                  <li>• <strong>Downlink:</strong> Maximum download speed (when available)</li>
                  <li>• <strong>RTT:</strong> Round-trip time to network</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Browser Information</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Collected:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>User Agent:</strong> Complete browser identification string</li>
                  <li>• <strong>Platform:</strong> Operating system and platform</li>
                  <li>• <strong>Language:</strong> Browser language preferences</li>
                  <li>• <strong>Cookies:</strong> Cookie support status</li>
                  <li>• <strong>Do Not Track:</strong> Privacy tracking preference</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Display Information</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Collected:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Screen Resolution:</strong> Display resolution (e.g., 1920x1080)</li>
                  <li>• <strong>Color Depth:</strong> Display color depth in bits</li>
                  <li>• <strong>WebGL Support:</strong> Graphics acceleration capability</li>
                  <li>• <strong>WebGL Details:</strong> Graphics card and driver information</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">System Information</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Collected:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• <strong>Timezone:</strong> Current timezone setting</li>
                  <li>• <strong>Current Time:</strong> Local date and time</li>
                  <li>• <strong>CPU Cores:</strong> Number of processor cores (when available)</li>
                  <li>• <strong>Device Memory:</strong> Available device memory (when available)</li>
                  <li>• <strong>Battery Status:</strong> Battery level and charging status (mobile devices)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export and Email Guide */}
      <Card title="Export and Email Guide" subtitle="Understanding data export and sharing">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Export Formats</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">JSON Export</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Complete structured data with all test results and metadata in JSON format.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Use for:</strong> Data analysis, integration with other tools, detailed reporting
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">CSV Export</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Tabular format with test type, parameter, value, and timestamp columns.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Use for:</strong> Spreadsheet analysis, data visualization, sharing with non-technical users
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Email Services</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">EmailJS</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Client-side email service with free tier and template support.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Setup:</strong> Sign up at emailjs.com, create a template, and replace placeholder code
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Formspree</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Form handling service with email forwarding and spam protection.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Setup:</strong> Create a form at formspree.io and replace the endpoint URL
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Netlify Forms</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Built-in form handling for Netlify deployments with automatic email forwarding.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Setup:</strong> Add form attributes to HTML and deploy to Netlify
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Troubleshooting Guide */}
      <Card title="Troubleshooting Guide" subtitle="Common issues and solutions">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Permission Issues</h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Camera/Microphone Access Denied</h4>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• Click "Grant Permissions" when prompted</li>
                <li>• Check browser settings for camera/microphone permissions</li>
                <li>• Ensure no other applications are using the camera/microphone</li>
                <li>• Try refreshing the page and granting permissions again</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Network Test Failures</h3>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Tests Not Completing</h4>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Ensure firewall isn't blocking the test requests</li>
                <li>• Try disabling VPN if you're using one</li>
                <li>• Check if corporate network policies are blocking tests</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Poor Test Results</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Improving Performance</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Close unnecessary applications and browser tabs</li>
                <li>• Connect directly to router via Ethernet if possible</li>
                <li>• Restart your router and modem</li>
                <li>• Contact your ISP if speeds are consistently low</li>
                <li>• Consider upgrading your internet plan</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Export Issues</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Not Working</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Ensure you have test data to export</li>
                <li>• Check browser download settings</li>
                <li>• Try using a different browser</li>
                <li>• Clear browser cache and try again</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card title="Need More Help?" subtitle="Additional resources and support">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you need additional help or have questions not covered in this guide, please visit our website.
          </p>
          <a 
            href="https://ipgrok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Visit ipgrok.com
          </a>
        </div>
      </Card>
    </div>
  );
} 