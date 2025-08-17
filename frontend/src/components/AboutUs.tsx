import { Card, Badge } from "./ui";

export function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🌐</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About IPGrok
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Professional network testing and analysis platform designed to give you comprehensive insights into your internet performance.
        </p>
      </div>

      {/* Mission Statement */}
      <Card title="Our Mission" subtitle="Empowering users with professional-grade network diagnostics">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            At IPGrok, we believe that everyone deserves access to professional-grade network testing tools. 
            Whether you're a network administrator, developer, or simply someone who wants to understand their 
            internet connection better, our platform provides the insights you need to optimize your network performance.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Our mission is to democratize network diagnostics by making advanced testing capabilities accessible 
            through a simple, intuitive web interface. No downloads, no installations, no technical expertise required.
          </p>
        </div>
      </Card>

      {/* What We Do */}
      <Card title="What We Do" subtitle="Comprehensive network analysis and diagnostics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Network Performance Testing</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Download and upload speed measurements
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Latency and jitter analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Packet loss detection
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Connection quality assessment
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Diagnostics</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                DNS performance testing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                HTTP/HTTPS response analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                CDN performance evaluation
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Network security assessment
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Key Features */}
      <Card title="Key Features" subtitle="What makes IPGrok special">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quick & Easy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get results in under 30 seconds with our streamlined quick test, or dive deep with comprehensive analysis.
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All tests run locally in your browser. We don't store your personal data or test results.
            </p>
          </div>
          
          <div className="text-center p-4">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Detailed Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive reports with actionable insights to improve your network performance.
            </p>
          </div>
        </div>
      </Card>

      {/* Technology Stack */}
      <Card title="Technology Stack" subtitle="Built with modern, reliable technologies">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">React</Badge>
              <Badge variant="info">TypeScript</Badge>
              <Badge variant="info">Tailwind CSS</Badge>
              <Badge variant="info">Vite</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Backend</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Node.js</Badge>
              <Badge variant="success">Express</Badge>
              <Badge variant="success">AWS DynamoDB</Badge>
              <Badge variant="success">Joi Validation</Badge>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Network Testing</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="warning">WebRTC</Badge>
            <Badge variant="warning">Fetch API</Badge>
            <Badge variant="warning">Performance API</Badge>
            <Badge variant="warning">MediaDevices API</Badge>
          </div>
        </div>
      </Card>

      {/* Use Cases */}
      <Card title="Who Uses IPGrok?" subtitle="Perfect for various professionals and enthusiasts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IT Professionals</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Network administrators</li>
              <li>• System engineers</li>
              <li>• DevOps professionals</li>
              <li>• IT consultants</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Developers & Engineers</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Web developers</li>
              <li>• Network engineers</li>
              <li>• Quality assurance teams</li>
              <li>• Technical support staff</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Users</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Remote workers</li>
              <li>• Video conferencing users</li>
              <li>• Online gamers</li>
              <li>• Streaming enthusiasts</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Home Users</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Internet service evaluation</li>
              <li>• Troubleshooting connection issues</li>
              <li>• Performance optimization</li>
              <li>• ISP comparison</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Roadmap */}
      <Card title="Development Roadmap" subtitle="What's coming next">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Enhanced Manual Testing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Individual ping tracking and real-time results</p>
            </div>
            <Badge variant="info">In Progress</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">DNS Lookup & IP WhoIs</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive network information lookup</p>
            </div>
            <Badge variant="warning">Planned</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Real-time Traceroute</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step network path visualization</p>
            </div>
            <Badge variant="warning">Planned</Badge>
          </div>
        </div>
      </Card>

      {/* Contact & Support */}
      <Card title="Get in Touch" subtitle="We'd love to hear from you">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Have questions, suggestions, or need support? We're here to help!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl mr-2">📧</span>
              <span className="text-gray-700 dark:text-gray-300">support@ipgrok.com</span>
            </div>
            
            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl mr-2">🐛</span>
              <span className="text-gray-700 dark:text-gray-300">Report Issues</span>
            </div>
            
            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl mr-2">💡</span>
              <span className="text-gray-700 dark:text-gray-300">Feature Requests</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        <p>
          IPGrok is an open-source project dedicated to making network testing accessible to everyone. 
          Built with ❤️ for the networking community.
        </p>
        <p className="mt-2">
          Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
