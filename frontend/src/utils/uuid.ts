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
 * Gets or creates a client UUID from localStorage
 * @returns The client UUID string
 */
export function getClientUUID(): string {
  const storageKey = 'ipgrok_client_uuid';
  let clientUUID = localStorage.getItem(storageKey);
  
  if (!clientUUID) {
    clientUUID = generateUUID();
    localStorage.setItem(storageKey, clientUUID);
    console.log('Generated new client UUID:', clientUUID);
  }
  
  return clientUUID;
}

/**
 * Gets client UUID without creating a new one if it doesn't exist
 * @returns The client UUID string or null if not found
 */
export function getExistingClientUUID(): string | null {
  const storageKey = 'ipgrok_client_uuid';
  return localStorage.getItem(storageKey);
}
