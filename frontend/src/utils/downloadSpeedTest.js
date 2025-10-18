/**
 * Download Speed Test Utility
 * Version: 1.0.32-stable
 *
 * This is the WORKING implementation using XMLHttpRequest.
 * DO NOT modify this file without testing thoroughly.
 *
 * This approach uses XMLHttpRequest with onprogress events,
 * similar to how Fast.com and other professional speed tests work.
 */
/**
 * Run a download speed test using XMLHttpRequest
 *
 * @param options - Configuration options for the speed test
 * @returns Promise with speed test results
 */
export async function runDownloadSpeedTest(options) {
    const { url, sizeBytes = 20971520, onProgress } = options; // Default 20MB
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        let firstByteTime = 0;
        let receivedBytes = 0;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Range', `bytes=0-${sizeBytes - 1}`);
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        // Track progress as bytes arrive
        xhr.onprogress = (event) => {
            // Start timer on first byte
            if (firstByteTime === 0 && event.loaded > 0) {
                firstByteTime = performance.now();
                console.log("First byte received, timer started");
            }
            receivedBytes = event.loaded;
            // Optional progress callback
            if (onProgress) {
                onProgress(event.loaded, event.total || sizeBytes);
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const endTime = performance.now();
                const durationSec = (endTime - (firstByteTime || startTime)) / 1000;
                const megabits = (receivedBytes * 8) / 1000000;
                const speedMbps = megabits / durationSec;
                resolve({
                    speedMbps,
                    receivedBytes,
                    durationSec,
                    firstByteTime: firstByteTime || startTime,
                    endTime
                });
            }
            else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network error during download speed test'));
        };
        xhr.ontimeout = () => {
            reject(new Error('Download speed test timed out'));
        };
        // Set a reasonable timeout (30 seconds)
        xhr.timeout = 30000;
        xhr.send();
    });
}
/**
 * Format speed for display
 */
export function formatSpeed(mbps) {
    if (mbps < 1) {
        return `${(mbps * 1000).toFixed(0)} Kbps`;
    }
    return `${mbps.toFixed(2)} Mbps`;
}
/**
 * Get quality rating based on speed
 */
export function getSpeedQuality(mbps) {
    if (mbps < 5)
        return 'poor';
    if (mbps < 25)
        return 'fair';
    if (mbps < 100)
        return 'good';
    return 'excellent';
}
