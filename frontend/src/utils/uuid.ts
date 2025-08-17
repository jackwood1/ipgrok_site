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
  
  // Update network information if available
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    parsedInfo.networkType = connection.effectiveType || connection.type || 'unknown';
    parsedInfo.rtt = connection.rtt;
    parsedInfo.downlink = connection.downlink;
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
