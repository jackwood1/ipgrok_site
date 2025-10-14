const express = require('express');
const router = express.Router();

// Download speed test endpoint - serves random data
router.get('/download', (req, res) => {
  const size = parseInt(req.query.size) || 10; // Default 10MB
  const sizeBytes = Math.min(size, 100) * 1024 * 1024; // Max 100MB
  
  console.log(`Speed test download request: ${size}MB`);
  
  // Set headers
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', sizeBytes);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Generate and send random data in chunks
  const chunkSize = 1024 * 1024; // 1MB chunks
  let sent = 0;
  
  const sendChunk = () => {
    if (sent >= sizeBytes) {
      res.end();
      return;
    }
    
    const remaining = sizeBytes - sent;
    const currentChunkSize = Math.min(chunkSize, remaining);
    const chunk = Buffer.alloc(currentChunkSize);
    
    // Fill with random data (prevents compression)
    for (let i = 0; i < currentChunkSize; i++) {
      chunk[i] = Math.floor(Math.random() * 256);
    }
    
    sent += currentChunkSize;
    res.write(chunk);
    
    // Continue sending
    setImmediate(sendChunk);
  };
  
  sendChunk();
});

// Upload speed test endpoint - receives data
router.post('/upload', express.raw({ limit: '100mb', type: 'application/octet-stream' }), (req, res) => {
  const receivedBytes = req.body.length;
  const receivedMB = (receivedBytes / (1024 * 1024)).toFixed(2);
  
  console.log(`Speed test upload received: ${receivedMB}MB`);
  
  res.json({
    success: true,
    receivedBytes,
    receivedMB,
    message: 'Upload test completed'
  });
});

// Ping test endpoint
router.get('/ping', (req, res) => {
  res.json({
    success: true,
    timestamp: Date.now(),
    server: 'IPGrok Backend'
  });
});

module.exports = router;

