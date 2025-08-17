/**
 * Generates a UUID v4 string
 * @returns A random UUID string
 */
export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Generates a session ID
 * @returns A random session ID string
 */
export function generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
/**
 * Gets client information from localStorage
 * @returns The client info object
 */
export function getClientInfo() {
    const storageKey = 'ipgrok_client_info';
    let clientInfo = localStorage.getItem(storageKey);
    if (!clientInfo) {
        // Create new client info
        const newClientInfo = {
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
        if (navigator.connection) {
            const connection = navigator.connection;
            newClientInfo.networkType = connection.effectiveType || connection.type || 'unknown';
            newClientInfo.rtt = connection.rtt;
            newClientInfo.downlink = connection.downlink;
        }
        localStorage.setItem(storageKey, JSON.stringify(newClientInfo));
        console.log('Generated new client info:', newClientInfo);
        return newClientInfo;
    }
    // Parse existing client info and update
    const parsedInfo = JSON.parse(clientInfo);
    parsedInfo.lastSeen = new Date().toISOString();
    parsedInfo.visitCount += 1;
    parsedInfo.sessionId = generateSessionId(); // New session ID for each visit
    // Update network information if available
    if (navigator.connection) {
        const connection = navigator.connection;
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
export function getClientUUID() {
    return getClientInfo().uuid;
}
/**
 * Gets client UUID without creating a new one if it doesn't exist
 * @returns The client UUID string or null if not found
 */
export function getExistingClientUUID() {
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
export function getExistingClientInfo() {
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
export function updateClientPublicIP(ip) {
    const storageKey = 'ipgrok_client_info';
    const clientInfo = localStorage.getItem(storageKey);
    if (clientInfo) {
        const parsed = JSON.parse(clientInfo);
        parsed.publicIp = ip;
        localStorage.setItem(storageKey, JSON.stringify(parsed));
    }
}
/**
 * Generates a unique test ID based on timestamp, IP address, and test type
 * @param testType The type of test being run
 * @param ipAddress Optional IP address
 * @returns A unique test ID string
 */
export function generateTestId(testType, ipAddress) {
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
export function addTestResult(testType, results, ipAddress) {
    const storageKey = 'ipgrok_client_info';
    const clientInfo = localStorage.getItem(storageKey);
    if (clientInfo) {
        const parsed = JSON.parse(clientInfo);
        const testId = generateTestId(testType, ipAddress);
        const testResult = {
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
export function getTestResults() {
    const storageKey = 'ipgrok_client_info';
    const clientInfo = localStorage.getItem(storageKey);
    if (clientInfo) {
        const parsed = JSON.parse(clientInfo);
        return parsed.testResults || [];
    }
    return [];
}
/**
 * Gets test results filtered by test type
 * @param testType The type of test to filter by
 * @returns Array of test results for the specified type
 */
export function getTestResultsByType(testType) {
    return getTestResults().filter(result => result.testType === testType);
}
