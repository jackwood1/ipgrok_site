export interface TestResult {
  testId: string;
  timestamp: string;
  testType: string;
  results: any;
  ipAddress?: string;
  sessionId: string;
}

export interface ClientInfo {
  uuid: string;
  createdAt: string;
  lastSeen: string;
  visitCount: number;
  userAgent: string;
  language: string;
  platform: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
  };
  publicIp?: string;
  networkType?: string;
  rtt?: number;
  downlink?: number;
  sessionId: string;
  testResults: TestResult[];
}

/**
 * Generates a UUID v4 string
 * @returns A random UUID string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generates a session ID
 * @returns A random session ID string
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Gets client information from localStorage
 * @returns The client info object
 */
export function getClientInfo(): ClientInfo {
  const storageKey = 'ipgrok_client_info';
  let clientInfo = localStorage.getItem(storageKey);
  
  if (!clientInfo) {
    // Create new client info
    const newClientInfo: ClientInfo = {
      uuid: generateUUID(),
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      visitCount: 1,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
      },
      sessionId: generateSessionId(),
      testResults: [],
    };
    
    // Try to get network information if available
    if ((navigator as any).connection) {
      const connection = (navigator as any).connection;
      newClientInfo.networkType = connection.effectiveType || connection.type || 'unknown';
      newClientInfo.rtt = connection.rtt;
      newClientInfo.downlink = connection.downlink;
    }
    
    localStorage.setItem(storageKey, JSON.stringify(newClientInfo));
    console.log('Generated new client info:', newClientInfo);
    return newClientInfo;
  }
  
  // Parse existing client info and update
  const parsedInfo: ClientInfo = JSON.parse(clientInfo);
  parsedInfo.lastSeen = new Date().toISOString();
  parsedInfo.visitCount += 1;
  parsedInfo.sessionId = generateSessionId(); // New session ID for each visit
  
  // Check for metadata changes and update if necessary
  let metadataChanged = false;
  
  // Check user agent changes
  if (parsedInfo.userAgent !== navigator.userAgent) {
    parsedInfo.userAgent = navigator.userAgent;
    metadataChanged = true;
  }
  
  // Check language changes
  if (parsedInfo.language !== navigator.language) {
    parsedInfo.language = navigator.language;
    metadataChanged = true;
  }
  
  // Check platform changes
  if (parsedInfo.platform !== navigator.platform) {
    parsedInfo.platform = navigator.platform;
    metadataChanged = true;
  }
  
  // Check screen resolution changes
  const currentScreen = {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
  };
  
  if (JSON.stringify(parsedInfo.screen) !== JSON.stringify(currentScreen)) {
    parsedInfo.screen = currentScreen;
    metadataChanged = true;
  }
  
  // Update network information if available
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    const newNetworkType = connection.effectiveType || connection.type || 'unknown';
    const newRtt = connection.rtt;
    const newDownlink = connection.downlink;
    
    if (parsedInfo.networkType !== newNetworkType || 
        parsedInfo.rtt !== newRtt || 
        parsedInfo.downlink !== newDownlink) {
      parsedInfo.networkType = newNetworkType;
      parsedInfo.rtt = newRtt;
      parsedInfo.downlink = newDownlink;
      metadataChanged = true;
    }
  }
  
  // Log metadata changes if any were detected
  if (metadataChanged) {
    console.log('Client metadata updated due to changes:', {
      userAgent: parsedInfo.userAgent,
      language: parsedInfo.language,
      platform: parsedInfo.platform,
      screen: parsedInfo.screen,
      networkType: parsedInfo.networkType,
      rtt: parsedInfo.rtt,
      downlink: parsedInfo.downlink
    });
  }
  
  localStorage.setItem(storageKey, JSON.stringify(parsedInfo));
  return parsedInfo;
}

/**
 * Gets or creates a client UUID from localStorage
 * @returns The client UUID string
 */
export function getClientUUID(): string {
  return getClientInfo().uuid;
}

/**
 * Gets client UUID without creating a new one if it doesn't exist
 * @returns The client UUID string or null if not found
 */
export function getExistingClientUUID(): string | null {
  const storageKey = 'ipgrok_client_info';
  const clientInfo = localStorage.getItem(storageKey);
  if (clientInfo) {
    const parsed = JSON.parse(clientInfo);
    return parsed.uuid;
  }
  return null;
}

/**
 * Gets the full client info object without creating new data
 * @returns The client info object or null if not found
 */
export function getExistingClientInfo(): ClientInfo | null {
  const storageKey = 'ipgrok_client_info';
  const clientInfo = localStorage.getItem(storageKey);
  if (clientInfo) {
    return JSON.parse(clientInfo);
  }
  return null;
}

/**
 * Updates the public IP address for the client
 * @param ip The public IP address
 */
export function updateClientPublicIP(ip: string): void {
  const storageKey = 'ipgrok_client_info';
  const clientInfo = localStorage.getItem(storageKey);
  if (clientInfo) {
    const parsed: ClientInfo = JSON.parse(clientInfo);
    parsed.publicIp = ip;
    localStorage.setItem(storageKey, JSON.stringify(parsed));
  }
}

/**
 * Checks for metadata changes and updates client info if necessary
 * @returns Object indicating what changed and the updated client info
 */
export function checkAndUpdateMetadata(): { changed: boolean; changes: string[]; clientInfo: ClientInfo } {
  const storageKey = 'ipgrok_client_info';
  const clientInfo = localStorage.getItem(storageKey);
  
  if (!clientInfo) {
    // No existing client info, create new one
    return { changed: false, changes: [], clientInfo: getClientInfo() };
  }
  
  const parsed: ClientInfo = JSON.parse(clientInfo);
  const changes: string[] = [];
  
  // Check user agent changes
  if (parsed.userAgent !== navigator.userAgent) {
    parsed.userAgent = navigator.userAgent;
    changes.push('userAgent');
  }
  
  // Check language changes
  if (parsed.language !== navigator.language) {
    parsed.language = navigator.language;
    changes.push('language');
  }
  
  // Check platform changes
  if (parsed.platform !== navigator.platform) {
    parsed.platform = navigator.platform;
    changes.push('platform');
  }
  
  // Check screen resolution changes
  const currentScreen = {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth,
  };
  
  if (JSON.stringify(parsed.screen) !== JSON.stringify(currentScreen)) {
    parsed.screen = currentScreen;
    changes.push('screen');
  }
  
  // Check network information changes
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    const newNetworkType = connection.effectiveType || connection.type || 'unknown';
    const newRtt = connection.rtt;
    const newDownlink = connection.downlink;
    
    if (parsed.networkType !== newNetworkType) {
      parsed.networkType = newNetworkType;
      changes.push('networkType');
    }
    if (parsed.rtt !== newRtt) {
      parsed.rtt = newRtt;
      changes.push('rtt');
    }
    if (parsed.downlink !== newDownlink) {
      parsed.downlink = newDownlink;
      changes.push('downlink');
    }
  }
  
  // Update last seen and visit count
  parsed.lastSeen = new Date().toISOString();
  parsed.visitCount += 1;
  parsed.sessionId = generateSessionId();
  
  // Save updated info if there were changes
  if (changes.length > 0) {
    localStorage.setItem(storageKey, JSON.stringify(parsed));
    console.log('Metadata updated:', changes);
  }
  
  return {
    changed: changes.length > 0,
    changes,
    clientInfo: parsed
  };
}

/**
 * Generates a unique test ID based on timestamp, IP address, and test type
 * @param testType The type of test being run
 * @param ipAddress Optional IP address
 * @returns A unique test ID string
 */
export function generateTestId(testType: string, ipAddress?: string): string {
  const timestamp = Date.now().toString();
  const ip = ipAddress || 'unknown';
  const data = `${timestamp}-${ip}-${testType}`;
  
  // Simple hash function for the test ID
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `test_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
}

/**
 * Adds a test result to the client's test history
 * @param testType The type of test
 * @param results The test results
 * @param ipAddress Optional IP address
 */
export function addTestResult(testType: string, results: any, ipAddress?: string): void {
  const storageKey = 'ipgrok_client_info';
  const clientInfo = localStorage.getItem(storageKey);
  
  if (clientInfo) {
    const parsed: ClientInfo = JSON.parse(clientInfo);
    const testId = generateTestId(testType, ipAddress);
    
    const testResult: TestResult = {
      testId,
      timestamp: new Date().toISOString(),
      testType,
      results,
      ipAddress,
      sessionId: parsed.sessionId
    };
    
    // Add to test results array
    if (!parsed.testResults) {
      parsed.testResults = [];
    }
    parsed.testResults.push(testResult);
    
    // Keep only last 100 test results to prevent localStorage from getting too large
    if (parsed.testResults.length > 100) {
      parsed.testResults = parsed.testResults.slice(-100);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(parsed));
    console.log('Test result added:', testResult);
  }
}

/**
 * Gets all test results for the current client
 * @returns Array of test results or empty array if none
 */
export function getTestResults(): TestResult[] {
  const storageKey = 'ipgrok_client_info';
  const clientInfo = localStorage.getItem(storageKey);
  
  if (clientInfo) {
    const parsed: ClientInfo = JSON.parse(clientInfo);
    return parsed.testResults || [];
  }
  
  return [];
}

/**
 * Gets test results filtered by test type
 * @param testType The type of test to filter by
 * @returns Array of test results for the specified type
 */
export function getTestResultsByType(testType: string): TestResult[] {
  return getTestResults().filter(result => result.testType === testType);
}
