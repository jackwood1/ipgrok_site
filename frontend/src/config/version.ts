export const APP_VERSION = '1.0.6';

export const VERSION_HISTORY = [
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
    version: '1.0.0',
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
