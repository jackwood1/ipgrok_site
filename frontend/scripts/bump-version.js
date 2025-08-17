#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionFile = path.join(__dirname, '../src/config/version.ts');

function bumpVersion(type = 'patch') {
  try {
    // Read the current version file
    const content = fs.readFileSync(versionFile, 'utf8');
    
    // Extract current version
    const versionMatch = content.match(/APP_VERSION = '(\d+)\.(\d+)\.(\d+)'/);
    if (!versionMatch) {
      console.error('Could not parse current version');
      process.exit(1);
    }
    
    let [_, major, minor, patch] = versionMatch;
    major = parseInt(major);
    minor = parseInt(minor);
    patch = parseInt(patch);
    
    // Bump version based on type
    switch (type) {
      case 'major':
        major++;
        minor = 0;
        patch = 0;
        break;
      case 'minor':
        minor++;
        patch = 0;
        break;
      case 'patch':
      default:
        patch++;
        break;
    }
    
    const newVersion = `${major}.${minor}.${patch}`;
    const today = new Date().toISOString().split('T')[0];
    
    // Create new version entry
    const newVersionEntry = `  {
    version: '${newVersion}',
    date: '${today}',
    changes: [
      'Update description here'
    ]
  },`;
    
    // Update the file
    let newContent = content.replace(
      /APP_VERSION = '[\d.]+'/,
      `APP_VERSION = '${newVersion}'`
    );
    
    // Add new version entry to the top of VERSION_HISTORY
    newContent = newContent.replace(
      /export const VERSION_HISTORY = \[/,
      `export const VERSION_HISTORY = [\n${newVersionEntry}`
    );
    
    fs.writeFileSync(versionFile, newContent);
    
    console.log(`✅ Version bumped to ${newVersion}`);
    console.log(`📝 Don't forget to update the changes array in the version file!`);
    
  } catch (error) {
    console.error('Error bumping version:', error);
    process.exit(1);
  }
}

// Get command line argument
const type = process.argv[2] || 'patch';

if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Usage: node bump-version.js [major|minor|patch]');
  console.error('Default: patch');
  process.exit(1);
}

bumpVersion(type);
