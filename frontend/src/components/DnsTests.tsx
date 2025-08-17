import { useState, useCallback } from "react";
import { Card, Button, Badge } from "./ui";

interface DnsResult {
  domain: string;
  ipAddresses: string[];
  cnameRecords: string[];
  mxRecords: string[];
  txtRecords: string[];
  nsRecords: string[];
  soaRecord?: {
    mname: string;
    rname: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minimum: number;
  };
  responseTime: number;
  provider: string;
  status: 'success' | 'error';
  error?: string;
}

interface HttpResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  responseTime: number;
  protocol: string;
  server: string;
  contentType: string;
  contentLength: string;
  redirects: Array<{
    url: string;
    statusCode: number;
    statusText: string;
    location: string;
  }>;
  headers: Record<string, string>;
  securityHeaders: {
    hsts: string | null;
    csp: string | null;
    xFrameOptions: string | null;
    xContentTypeOptions: string | null;
    xXssProtection: string | null;
    referrerPolicy: string | null;
  };
  performanceHeaders: {
    cacheControl: string | null;
    expires: string | null;
    lastModified: string | null;
    etag: string | null;
    vary: string | null;
  };
  cdnInfo: {
    detected: boolean;
    provider: string | null;
    serverLocation: string | null;
  };
  status: 'success' | 'error';
  error?: string;
  troubleshooting?: string[];
}

interface SslResult {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  status: 'success' | 'error';
  error?: string;
}

export function DnsTests() {
  const [activeTest, setActiveTest] = useState<'dns' | 'http' | 'ssl' | null>(null);
  const [dnsResults, setDnsResults] = useState<DnsResult[]>([]);
  const [httpResults, setHttpResults] = useState<HttpResult[]>([]);
  const [sslResults, setSslResults] = useState<SslResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dnsDomain, setDnsDomain] = useState('google.com');
  const [httpUrl, setHttpUrl] = useState('https://google.com');
  const [sslDomain, setSslDomain] = useState('google.com');

  // DNS Resolution Check using reliable DoH providers
  const runDnsTest = useCallback(async () => {
    if (!dnsDomain.trim()) return;
    
    // Clear previous results when starting a new test
    setDnsResults([]);
    
    setIsLoading(true);
    setActiveTest('dns');
    
    const providers = [
      { name: 'Cloudflare', url: 'https://cloudflare-dns.com/dns-query' },
      { name: 'Google', url: 'https://dns.google/resolve' }
    ];
    
    const results: DnsResult[] = [];
    
    for (const provider of providers) {
      try {
        const startTime = performance.now();
        
        // Query multiple DNS record types
        const recordTypes = ['A', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'];
        const dnsData: any = {};
        
        for (const recordType of recordTypes) {
          try {
            let response;
            if (provider.name === 'Google') {
              response = await fetch(`${provider.url}?name=${dnsDomain}&type=${recordType}`);
            } else {
              response = await fetch(`${provider.url}?name=${dnsDomain}&type=${recordType}`, {
                headers: {
                  'Accept': 'application/dns-json'
                }
              });
            }
            
            if (response.ok) {
              const data = await response.json();
              dnsData[recordType] = data;
            }
          } catch (error) {
            // Continue with other record types if one fails
            console.log(`Failed to fetch ${recordType} records from ${provider.name}:`, error);
          }
        }
        
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        
        // Extract data from different record types
        const ipAddresses = dnsData.A?.Answer?.filter((answer: any) => answer.type === 1)?.map((answer: any) => answer.data) || [];
        const cnameRecords = dnsData.CNAME?.Answer?.filter((answer: any) => answer.type === 5)?.map((answer: any) => answer.data) || [];
        const mxRecords = dnsData.MX?.Answer?.filter((answer: any) => answer.type === 15)?.map((answer: any) => `${answer.data.priority} ${answer.data.exchange}`) || [];
        const txtRecords = dnsData.TXT?.Answer?.filter((answer: any) => answer.type === 16)?.map((answer: any) => answer.data.join('')) || [];
        const nsRecords = dnsData.NS?.Answer?.filter((answer: any) => answer.type === 2)?.map((answer: any) => answer.data) || [];
        
        // Extract SOA record if available
        let soaRecord;
        if (dnsData.SOA?.Answer?.[0]) {
          const soa = dnsData.SOA.Answer[0].data;
          soaRecord = {
            mname: soa.mname,
            rname: soa.rname,
            serial: soa.serial,
            refresh: soa.refresh,
            retry: soa.retry,
            expire: soa.expire,
            minimum: soa.minimum
          };
        }
        
        results.push({
          domain: dnsDomain,
          ipAddresses,
          cnameRecords,
          mxRecords,
          txtRecords,
          nsRecords,
          soaRecord,
          responseTime,
          provider: provider.name,
          status: 'success'
        });
        
      } catch (error) {
        results.push({
          domain: dnsDomain,
          ipAddresses: [],
          cnameRecords: [],
          mxRecords: [],
          txtRecords: [],
          nsRecords: [],
          responseTime: 0,
          provider: provider.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    setDnsResults(results);
    setIsLoading(false);
  }, [dnsDomain]);

  // HTTP Status Test
  const runHttpTest = useCallback(async () => {
    if (!httpUrl.trim()) return;
    
    // Clear previous results when starting a new test
    setHttpResults([]);
    
    setIsLoading(true);
    setActiveTest('http');
    
    try {
      const startTime = performance.now();
      const testUrl = httpUrl.startsWith('http') ? httpUrl : `https://${httpUrl}`;
      
      // Try multiple approaches to get HTTP information
      let response: Response | null = null;
      let headers: Record<string, string> = {};
      let statusCode = 0;
      let statusText = '';
      let finalUrl = testUrl;
      
      try {
        // First attempt: Try with CORS mode
        response = await fetch(testUrl, {
          method: 'HEAD',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'User-Agent': 'IPGrok-HTTP-Tester/1.0'
          }
        });
        
        statusCode = response.status;
        statusText = response.statusText;
        finalUrl = response.url;
        
        // Extract headers
        response.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value;
        });
        
      } catch (corsError) {
        // CORS failed, try with no-cors mode for basic info
        try {
          response = await fetch(testUrl, {
            method: 'HEAD',
            mode: 'no-cors',
            credentials: 'omit'
          });
          
          // With no-cors, we get limited information
          statusCode = response.status || 0;
          statusText = response.statusText || 'Unknown';
          
          // Try to get some basic headers that might be available
          if (response.headers) {
            response.headers.forEach((value, key) => {
              headers[key.toLowerCase()] = value;
            });
          }
          
        } catch (noCorsError) {
          // Both attempts failed, create a basic result
          throw new Error('Unable to connect to the website. This could be due to CORS restrictions, network issues, or the site being unavailable.');
        }
      }
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      // Parse security headers
      const securityHeaders = {
        hsts: headers['strict-transport-security'] || null,
        csp: headers['content-security-policy'] || null,
        xFrameOptions: headers['x-frame-options'] || null,
        xContentTypeOptions: headers['x-content-type-options'] || null,
        xXssProtection: headers['x-xss-protection'] || null,
        referrerPolicy: headers['referrer-policy'] || null,
      };
      
      // Parse performance headers
      const performanceHeaders = {
        cacheControl: headers['cache-control'] || null,
        expires: headers['expires'] || null,
        lastModified: headers['last-modified'] || null,
        etag: headers['etag'] || null,
        vary: headers['vary'] || null,
      };
      
      // Detect CDN
      const cdnInfo = {
        detected: false,
        provider: null as string | null,
        serverLocation: null as string | null,
      };
      
      // CDN detection logic
      if (headers['server']) {
        const server = headers['server'].toLowerCase();
        if (server.includes('cloudflare')) {
          cdnInfo.detected = true;
          cdnInfo.provider = 'Cloudflare';
        } else if (server.includes('akamai')) {
          cdnInfo.detected = true;
          cdnInfo.provider = 'Akamai';
        } else if (server.includes('fastly')) {
          cdnInfo.detected = true;
          cdnInfo.provider = 'Fastly';
        } else if (server.includes('aws') || server.includes('amazon')) {
          cdnInfo.detected = true;
          cdnInfo.provider = 'Amazon CloudFront';
        }
      }
      
      // Server location detection (basic)
      if (headers['cf-ray']) {
        cdnInfo.serverLocation = 'Cloudflare Edge Location';
      } else if (headers['x-amz-cf-pop']) {
        cdnInfo.serverLocation = 'AWS CloudFront Edge';
      }
      
      // Generate troubleshooting tips
      const troubleshooting: string[] = [];
      
      if (statusCode >= 400) {
        if (statusCode === 404) {
          troubleshooting.push('Page not found - check if the URL is correct');
        } else if (statusCode === 403) {
          troubleshooting.push('Access forbidden - the server is blocking requests');
        } else if (statusCode === 500) {
          troubleshooting.push('Server error - the website is experiencing issues');
        } else if (statusCode >= 500) {
          troubleshooting.push('Server error - contact the website administrator');
        }
      }
      
      if (responseTime > 3000) {
        troubleshooting.push('Slow response time - consider using a CDN or optimizing server performance');
      }
      
      if (!securityHeaders.hsts && testUrl.startsWith('https://')) {
        troubleshooting.push('Missing HSTS header - consider enabling HTTP Strict Transport Security');
      }
      
      if (!securityHeaders.csp) {
        troubleshooting.push('Missing CSP header - consider adding Content Security Policy for security');
      }
      
      // Add CORS-specific tips if we had limited access
      if (Object.keys(headers).length === 0) {
        troubleshooting.push('Limited header information available due to CORS restrictions');
        troubleshooting.push('This is normal for cross-origin requests from web browsers');
        troubleshooting.push('For full analysis, consider using server-side testing tools');
      }
      
      const result: HttpResult = {
        url: testUrl,
        finalUrl: finalUrl,
        statusCode: statusCode,
        statusText: statusText,
        responseTime,
        protocol: 'HTTP/' + (response?.headers?.get('x-http-version') || '1.1'),
        server: headers['server'] || 'Unknown',
        contentType: headers['content-type'] || 'Unknown',
        contentLength: headers['content-length'] || 'Unknown',
        redirects: [], // Will be populated if we implement redirect following
        headers,
        securityHeaders,
        performanceHeaders,
        cdnInfo,
        status: 'success',
        troubleshooting
      };
      
      setHttpResults([result]);
      
    } catch (error) {
      // Handle all errors gracefully
      const troubleshooting: string[] = [
        'CORS policy blocked this request - this is normal for cross-origin requests',
        'Try testing from the same domain or use server-side testing tools',
        'Some websites block automated requests for security reasons',
        'Consider using browser developer tools for detailed header analysis'
      ];
      
      setHttpResults([{
        url: httpUrl,
        finalUrl: httpUrl,
        statusCode: 0,
        statusText: 'Error',
        responseTime: 0,
        protocol: 'Unknown',
        server: 'Unknown',
        contentType: 'Unknown',
        contentLength: 'Unknown',
        redirects: [],
        headers: {},
        securityHeaders: {
          hsts: null,
          csp: null,
          xFrameOptions: null,
          xContentTypeOptions: null,
          xXssProtection: null,
          referrerPolicy: null,
        },
        performanceHeaders: {
          cacheControl: null,
          expires: null,
          lastModified: null,
          etag: null,
          vary: null,
        },
        cdnInfo: {
          detected: false,
          provider: null,
          serverLocation: null,
        },
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        troubleshooting
      }]);
    }
    
    setIsLoading(false);
  }, [httpUrl]);

  // SSL/TLS Certificate Info
  const runSslTest = useCallback(async () => {
    if (!sslDomain.trim()) return;
    
    setIsLoading(true);
    setActiveTest('ssl');
    
    try {
      // For SSL info, we'll use a public API
      const response = await fetch(`https://api.certspotter.com/v1/issuers?domain=${sslDomain}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const cert = data[0];
          const validFrom = new Date(cert.not_before);
          const validTo = new Date(cert.not_after);
          const now = new Date();
          const daysRemaining = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          const result: SslResult = {
            domain: sslDomain,
            issuer: cert.issuer_name || 'Unknown',
            validFrom: validFrom.toLocaleDateString(),
            validTo: validTo.toLocaleDateString(),
            daysRemaining,
            status: 'success'
          };
          
          setSslResults([result]);
        } else {
          setSslResults([{
            domain: sslDomain,
            issuer: '',
            validFrom: '',
            validTo: '',
            daysRemaining: 0,
            status: 'error',
            error: 'No certificates found'
          }]);
        }
      } else {
        setSslResults([{
          domain: sslDomain,
          issuer: '',
          validFrom: '',
          validTo: '',
          daysRemaining: 0,
          status: 'error',
          error: `HTTP ${response.status}`
        }]);
      }
    } catch (error) {
      setSslResults([{
        domain: sslDomain,
        issuer: '',
        validFrom: '',
        validTo: '',
        daysRemaining: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    }
    
    setIsLoading(false);
  }, [sslDomain]);

  const resetAllTests = () => {
    setDnsResults([]);
    setHttpResults([]);
    setSslResults([]);
    setActiveTest(null);
  };

  return (
    <div className="space-y-8">
      {/* DNS Tests Header */}
      <Card 
        title="DNS Tests" 
        subtitle="Test DNS resolution, HTTP status, and SSL certificates"
      >
        <div className="space-y-4">
          {/* Usage Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              💡 How to Use DNS Tests
            </h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p><strong>🔍 DNS Resolution:</strong> Enter a domain name (e.g., google.com) to check how different DNS providers resolve it. This helps identify DNS issues and compare response times.</p>
              <p><strong>🌐 HTTP Status:</strong> Test any website URL to check if it's accessible, get response codes, and measure response times. Useful for monitoring website availability.</p>
              <p><strong>🔒 SSL Certificate:</strong> Check SSL certificate details including issuer, validity dates, and days until expiration. Important for security and compliance.</p>
              <p><strong>💡 Tip:</strong> Start with common domains like google.com or github.com to test the functionality, then try your own domains.</p>
            </div>
          </div>

          {!activeTest ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                DNS Testing Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Test DNS resolution, HTTP status, and SSL certificate information.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveTest('dns')}
                  variant="primary"
                  size="lg"
                  className="px-6"
                >
                  🔍 DNS Resolution
                </Button>
                <Button
                  onClick={() => setActiveTest('http')}
                  variant="primary"
                  size="lg"
                  className="px-6"
                >
                  🌐 HTTP Status
                </Button>
                <Button
                  onClick={() => setActiveTest('ssl')}
                  variant="primary"
                  size="lg"
                  className="px-6"
                >
                  🔒 SSL Certificate
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* DNS Resolution Test */}
              {activeTest === 'dns' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={dnsDomain}
                      onChange={(e) => setDnsDomain(e.target.value)}
                      placeholder="Enter domain (e.g., google.com)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <Button
                      onClick={runDnsTest}
                      disabled={isLoading}
                      variant="primary"
                      size="md"
                    >
                      {isLoading ? 'Testing...' : 'Test DNS'}
                    </Button>
                    <Button
                      onClick={() => setActiveTest(null)}
                      variant="secondary"
                      size="md"
                    >
                      Back
                    </Button>
                  </div>
                  
                  {dnsResults.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">DNS Results for {dnsDomain}</h4>
                      
                      {/* Results Explanation */}
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h5 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                          📊 Understanding Your DNS Results
                        </h5>
                        <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
                          <p><strong>🔍 What This Test Shows:</strong> DNS resolution maps domain names to IP addresses and provides essential network configuration information.</p>
                          <p><strong>🌐 Multiple Providers:</strong> Testing with both Cloudflare and Google DNS helps identify any provider-specific issues.</p>
                          <p><strong>⚡ Response Times:</strong> Lower response times indicate faster DNS resolution, which improves website loading speed.</p>
                          <p><strong>💡 Common Issues:</strong> If one provider fails but another succeeds, there may be network routing or firewall issues.</p>
                        </div>
                      </div>
                      
                      {dnsResults.map((result, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">{result.provider}</span>
                            <Badge variant={result.status === 'success' ? 'success' : 'danger'}>
                              {result.status === 'success' ? 'Success' : 'Error'}
                            </Badge>
                          </div>
                          
                          {/* Provider-specific insights */}
                          {result.status === 'success' && (
                            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200">
                              <strong>💡 {result.provider} Insights:</strong> {
                                result.provider === 'Cloudflare' 
                                  ? 'Cloudflare DNS is optimized for speed and privacy, often providing the fastest response times.'
                                  : 'Google DNS offers excellent reliability and global distribution, with consistent performance worldwide.'
                              }
                            </div>
                          )}
                          {result.status === 'success' ? (
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="grid grid-cols-1 gap-2">
                                <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                  IP Addresses (A Records)
                                  <span className="text-xs text-gray-500 dark:text-gray-400" title="A Records map domain names to IPv4 addresses. These are the actual server locations for the website.">
                                    ℹ️
                                  </span>
                                </div>
                                <div className="pl-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                  {result.ipAddresses.length > 0 ? result.ipAddresses.join('\n') : 'None'}
                                </div>
                                
                                {result.cnameRecords.length > 0 && (
                                  <>
                                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                      CNAME Records
                                      <span className="text-xs text-gray-500 dark:text-gray-400" title="CNAME records create aliases for domain names. They redirect one domain to another.">
                                        ℹ️
                                      </span>
                                    </div>
                                    <div className="pl-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                      {result.cnameRecords.join('\n')}
                                    </div>
                                  </>
                                )}
                                
                                {result.mxRecords.length > 0 && (
                                  <>
                                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                      MX Records (Mail Servers)
                                      <span className="text-xs text-gray-500 dark:text-gray-400" title="MX records specify which servers handle email for this domain. Lower priority numbers have higher priority.">
                                        ℹ️
                                      </span>
                                    </div>
                                    <div className="pl-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                      {result.mxRecords.join('\n')}
                                    </div>
                                  </>
                                )}
                                
                                {result.txtRecords.length > 0 && (
                                  <>
                                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                      TXT Records
                                      <span className="text-xs text-gray-500 dark:text-gray-400" title="TXT records contain text information, often used for SPF (email security), DKIM verification, or other domain verification purposes.">
                                        ℹ️
                                      </span>
                                    </div>
                                    <div className="pl-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                      {result.txtRecords.map((txt, idx) => (
                                        <div key={idx} className="break-all">{txt}</div>
                                      ))}
                                    </div>
                                  </>
                                )}
                                
                                {result.nsRecords.length > 0 && (
                                  <>
                                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                      Name Servers (NS)
                                      <span className="text-xs text-gray-500 dark:text-gray-400" title="NS records specify which servers are authoritative for this domain's DNS zone. These are the servers that know the domain's DNS information.">
                                        ℹ️
                                      </span>
                                    </div>
                                    <div className="pl-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                      {result.nsRecords.join('\n')}
                                    </div>
                                  </>
                                )}
                                
                                {result.soaRecord && (
                                  <>
                                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                      SOA Record
                                      <span className="text-xs text-gray-500 dark:text-gray-400" title="SOA (Start of Authority) records contain administrative information about the DNS zone, including transfer settings and contact information.">
                                        ℹ️
                                      </span>
                                    </div>
                                    <div className="pl-2 text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                      <div>Primary NS: {result.soaRecord.mname}</div>
                                      <div>Admin Email: {result.soaRecord.rname}</div>
                                      <div>Serial: {result.soaRecord.serial}</div>
                                      <div>Refresh: {result.soaRecord.refresh}s</div>
                                      <div>Retry: {result.soaRecord.retry}s</div>
                                      <div>Expire: {result.soaRecord.expire}s</div>
                                      <div>Minimum TTL: {result.soaRecord.minimum}s</div>
                                    </div>
                                  </>
                                )}
                                
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                  <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    Response Time: {result.responseTime}ms
                                    <span className="text-xs" title="Response time shows how quickly this DNS provider resolved the domain. Lower times are better for faster website loading.">
                                      ℹ️
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-red-600 dark:text-red-400">
                              Error: {result.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HTTP Status Test */}
              {activeTest === 'http' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={httpUrl}
                      onChange={(e) => setHttpUrl(e.target.value)}
                      placeholder="Enter URL (e.g., https://google.com)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <Button
                      onClick={runHttpTest}
                      disabled={isLoading}
                      variant="primary"
                      size="md"
                    >
                      {isLoading ? 'Testing...' : 'Test HTTP'}
                    </Button>
                    <Button
                      onClick={() => setActiveTest(null)}
                      variant="secondary"
                      size="md"
                    >
                      Back
                    </Button>
                  </div>
                  
                  {httpResults.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">HTTP Results for {httpUrl}</h4>
                      
                      {/* HTTP Test Explanation */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          🌐 Understanding HTTP Status Tests
                        </h5>
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                          <p><strong>🔍 What This Test Shows:</strong> HTTP status testing reveals how websites respond to requests, including security headers, performance settings, and server configuration.</p>
                          <p><strong>🛡️ Security Analysis:</strong> Checks for important security headers like HSTS, CSP, and X-Frame-Options that protect against common web attacks.</p>
                          <p><strong>⚡ Performance Insights:</strong> Analyzes caching headers, compression, and CDN usage to understand website optimization.</p>
                          <p><strong>💡 Troubleshooting:</strong> Provides specific recommendations based on the test results to improve website security and performance.</p>
                        </div>
                      </div>
                      
                      {/* CORS Information */}
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                          ⚠️ Browser Security Limitations
                        </h5>
                        <div className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
                          <p><strong>🌐 CORS Restrictions:</strong> Due to browser security policies, some websites may block cross-origin requests, limiting the information we can retrieve.</p>
                          <p><strong>📊 What You'll See:</strong> We'll show available information and clearly indicate when data is limited due to CORS restrictions.</p>
                          <p><strong>🔧 Alternative Testing:</strong> For comprehensive analysis, consider using browser developer tools, server-side tools, or testing from the same domain.</p>
                        </div>
                      </div>
                      
                      {httpResults.map((result, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">HTTP Status Analysis</span>
                            <Badge variant={result.status === 'success' ? 'success' : 'danger'}>
                              {result.status === 'success' ? `${result.statusCode} ${result.statusText}` : 'Error'}
                            </Badge>
                          </div>
                          
                          {result.status === 'success' ? (
                            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                              {/* Basic HTTP Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Basic Information</h6>
                                  <div className="space-y-1">
                                    <div><span className="font-medium">URL:</span> {result.url}</div>
                                    <div><span className="font-medium">Final URL:</span> {result.finalUrl}</div>
                                    <div><span className="font-medium">Protocol:</span> {result.protocol}</div>
                                    <div><span className="font-medium">Server:</span> {result.server}</div>
                                    <div><span className="font-medium">Content Type:</span> {result.contentType}</div>
                                    <div><span className="font-medium">Content Length:</span> {result.contentLength}</div>
                                    <div><span className="font-medium">Response Time:</span> {result.responseTime}ms</div>
                                  </div>
                                </div>
                                
                                {/* CDN Information */}
                                <div>
                                  <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2">CDN & Infrastructure</h6>
                                  <div className="space-y-1">
                                    <div><span className="font-medium">CDN Detected:</span> {result.cdnInfo.detected ? 'Yes' : 'No'}</div>
                                    {result.cdnInfo.provider && (
                                      <div><span className="font-medium">Provider:</span> {result.cdnInfo.provider}</div>
                                    )}
                                    {result.cdnInfo.serverLocation && (
                                      <div><span className="font-medium">Location:</span> {result.cdnInfo.serverLocation}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Security Headers */}
                              <div>
                                <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                  Security Headers
                                  <span className="text-xs text-gray-500 dark:text-gray-400" title="Security headers protect against common web vulnerabilities and attacks">
                                    🛡️
                                  </span>
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {Object.entries(result.securityHeaders).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        value ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                                      }`}>
                                        {value || 'Missing'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Performance Headers */}
                              <div>
                                <h6 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                  Performance Headers
                                  <span className="text-xs text-gray-500 dark:text-gray-400" title="Performance headers control caching, compression, and optimization">
                                    ⚡
                                  </span>
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {Object.entries(result.performanceHeaders).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span className={`px-2 py-1 rounded text-xs ${
                                        value ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                      }`}>
                                        {value || 'Not Set'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Troubleshooting Tips */}
                              {result.troubleshooting && result.troubleshooting.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                                    💡 Troubleshooting Tips
                                  </h6>
                                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                    <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200">
                                      {result.troubleshooting.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="text-sm text-red-600 dark:text-red-400">
                                <strong>Error:</strong> {result.error}
                              </div>
                              
                              {/* Troubleshooting for errors */}
                              {result.troubleshooting && result.troubleshooting.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                                    💡 Troubleshooting Tips
                                  </h6>
                                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                                    <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200">
                                      {result.troubleshooting.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SSL Certificate Test */}
              {activeTest === 'ssl' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={sslDomain}
                      onChange={(e) => setSslDomain(e.target.value)}
                      placeholder="Enter domain (e.g., google.com)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <Button
                      onClick={runSslTest}
                      disabled={isLoading}
                      variant="primary"
                      size="md"
                    >
                      {isLoading ? 'Testing...' : 'Test SSL'}
                    </Button>
                    <Button
                      onClick={() => setActiveTest(null)}
                      variant="secondary"
                      size="md"
                    >
                      Back
                    </Button>
                  </div>
                  
                  {sslResults.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">SSL Certificate Results for {sslDomain}</h4>
                      {sslResults.map((result, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">Certificate Info</span>
                            <Badge variant={result.status === 'success' ? 'success' : 'danger'}>
                              {result.status === 'success' ? 'Valid' : 'Error'}
                            </Badge>
                          </div>
                          {result.status === 'success' ? (
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div>Issuer: {result.issuer}</div>
                              <div>Valid From: {result.validFrom}</div>
                              <div>Valid To: {result.validTo}</div>
                              <div>Days Remaining: {result.daysRemaining}</div>
                            </div>
                          ) : (
                            <div className="text-sm text-red-600 dark:text-red-400">
                              Error: {result.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center">
                <Button
                  onClick={resetAllTests}
                  variant="secondary"
                  size="md"
                >
                  Reset All Tests
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
