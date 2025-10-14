export const APP_VERSION = '1.0.13';

export const VERSION_HISTORY = [
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
