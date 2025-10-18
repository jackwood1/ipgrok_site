export const APP_VERSION = '1.0.28';

export const VERSION_HISTORY = [
  {
    version: '1.0.28',
    date: '2025-10-18',
    changes: [
      'Reverted to version 1.0.25 implementation',
      'Pure download with simple progress animation',
      'No speed simulation or extra state updates',
      'Stable and fast'
    ]
  },
  {
    version: '1.0.27',
    date: '2025-10-18',
    changes: [
      'FIXED: Removed speed simulation during download',
      'ANY state updates during download cause slowdown',
      'Only progress bar animates (visual only)',
      'Absolute minimum overhead for maximum speed'
    ]
  },
  {
    version: '1.0.26',
    date: '2025-10-18',
    changes: [
      'Added simulated bandwidth meter during download',
      'Odometer-style speed display with ramp-up and fluctuation',
      'Visual feedback without impacting download performance',
      'Pure native download still used for accurate final measurement'
    ]
  },
  {
    version: '1.0.25',
    date: '2025-10-18',
    changes: [
      'SIMPLEST FIX: Pure download with NO progress tracking',
      'Let browser handle download natively - no chunk reading',
      'No UI updates during download - maximum speed',
      'Download 20MB for accurate measurements'
    ]
  },
  {
    version: '1.0.24',
    date: '2025-10-18',
    changes: [
      'PROPER FIX: ReadableStream with UI throttling (250ms)',
      'Real-time download progress without performance penalty',
      'Timer starts on first byte (excludes connection overhead)',
      'Download only 10MB for faster, accurate measurements'
    ]
  },
  {
    version: '1.0.23',
    date: '2025-10-18',
    changes: [
      'Reverted to version 1.0.20 download implementation',
      'Uses arrayBuffer() for better browser compatibility',
      'Stable download speed measurements'
    ]
  },
  {
    version: '1.0.18',
    date: '2025-10-14',
    changes: [
      'Update description here'
    ]
  },
  {
    version: '1.0.17',
    date: '2025-10-14',
    changes: [
      'FIXED: Start timer on first data byte (not on fetch start)',
      'Speed now accurate - matches curl and Speedtest.net',
      'Excludes connection overhead from measurements'
    ]
  },
  {
    version: '1.0.16',
    date: '2025-10-14',
    changes: [
      'Added detailed download logging',
      'Fixed speed calculation accuracy',
      'Enhanced error reporting'
    ]
  },
  {
    version: '1.0.15',
    date: '2025-10-14',
    changes: [
      'Fixed speed test to actually use S3 files',
      'Removed premature fallback that prevented real testing',
      'Results now match other speed test sites',
      'Accurate network speed measurements'
    ]
  },
  {
    version: '1.0.14',
    date: '2025-10-14',
    changes: [
      'Fixed GitHub CORS error',
      'Created S3 CORS configuration guide',
      'Speed tests will work once S3 is configured',
      'Graceful fallback when files unavailable'
    ]
  },
  {
    version: '1.0.13',
    date: '2025-10-14',
    changes: [
      'Removed backend upload endpoint dependency',
      'Upload speed now estimated from download (realistic ratio)',
      'All tests work without any backend calls',
      'No more 404 errors'
    ]
  },
  {
    version: '1.0.12',
    date: '2025-10-14',
    changes: [
      'Fixed crypto.getRandomValues quota error',
      'Speed tests work without backend dependency',
      'Improved error handling and fallbacks'
    ]
  },
  {
    version: '1.0.11',
    date: '2025-10-14',
    changes: [
      'Removed 3rd party CDN dependencies (no more CORS errors)',
      'Enhanced download progress visualization',
      'Speed tests now use in-memory data generation'
    ]
  },
  {
    version: '1.0.10',
    date: '2025-10-14',
    changes: [
      'Fixed download speed accuracy to match Speedtest.net',
      'Properly measure actual downloaded bytes',
      'Use larger test files for accurate measurements'
    ]
  },
  {
    version: '1.0.9',
    date: '2025-10-14',
    changes: [
      'Disabled backend API calls to prevent 500 errors',
      'Fixed download speed test to work reliably',
      'All tests work client-side only for stability'
    ]
  },
  {
    version: '1.0.8',
    date: '2025-10-13',
    changes: [
      'Fixed 403 error in download speed test',
      'Fixed 500 error in backend API logging',
      'Improved error handling and debugging'
    ]
  },
  {
    version: '1.0.7',
    date: '2025-10-13',
    changes: [
      'Added comprehensive DNS Tests feature',
      'Re-enabled backend API logging for test results',
      'Improved download speed test accuracy',
      'Fixed 500 error issues',
      'Enhanced Quick Test with collapsible debug section'
    ]
  },
  {
    version: '1.0.6',
    date: '2025-08-17',
    changes: [
      'Added version tracking system',
      'Version display in Header and Footer',
      'Automated version bumping scripts',
      'Version history documentation'
    ]
  },
  {
    version: '1.0.5',
    date: '2025-01-17',
    changes: [
      'Added progress indicators for Quick Test',
      'Fixed Quick Test functionality',
      'Added Contact Us page with bot deterrents',
      'Added About Us page',
      'Fixed Detailed Analytics flow progression'
    ]
  },
  {
    version: '1.1.0',
    date: '2025-01-17',
    changes: [
      'Initial release',
      'Network testing capabilities',
      'System information gathering',
      'Quick Test functionality',
      'Detailed Analytics workflow'
    ]
  }
];

export const getLatestVersion = () => APP_VERSION;
export const getVersionHistory = () => VERSION_HISTORY;
