# Download Speed Test - Stable Implementation

## Version: 1.0.32-stable

**Status**: ✅ **WORKING - DO NOT BREAK**

This document describes the stable, working implementation of the download speed test.

---

## What Works

The current implementation uses **XMLHttpRequest with onprogress events**, similar to how Fast.com works.

### Key Implementation Details

1. **XMLHttpRequest** (not fetch, not blob, not ReadableStream)
2. **onprogress event** to detect first byte arrival
3. **Timer starts** when `event.loaded > 0` (first byte arrives)
4. **No React state updates** during download (only at the end)
5. **Downloads 20MB** via Range header for accurate measurement

### Code Location

- **Main Implementation**: `frontend/src/components/NetworkTest.tsx` (lines ~448-480)
- **Utility Function**: `frontend/src/utils/downloadSpeedTest.ts`

---

## Protected Versions

### Git Tag
```bash
git tag v1.0.32-stable
```
- This tag marks the exact commit with the working implementation
- To revert: `git checkout v1.0.32-stable`

### Stable Branch
```bash
git branch stable/download-test
```
- Branch: `stable/download-test`
- This branch will always contain the working version
- To compare: `git diff main stable/download-test`

---

## How to Make Changes Safely

### Option 1: Create a Feature Branch
```bash
# Create a new branch for testing changes
git checkout -b feature/download-test-improvements

# Make your changes
# Test thoroughly
# If it breaks, just switch back to main
git checkout main
```

### Option 2: Use the Utility Function
The download test logic has been extracted to `downloadSpeedTest.ts`. 

To test changes:
1. Create a copy: `downloadSpeedTest.experimental.ts`
2. Make changes to the experimental version
3. Test it thoroughly
4. If it works, replace the stable version
5. If it breaks, delete it

### Option 3: Environment-Based Testing
You could add a feature flag:

```typescript
const USE_EXPERIMENTAL_DOWNLOAD_TEST = process.env.REACT_APP_EXPERIMENTAL_FEATURES === 'true';

if (USE_EXPERIMENTAL_DOWNLOAD_TEST) {
  // New experimental code
} else {
  // Stable working code
}
```

---

## Reverting to This Version

### If main branch breaks:
```bash
# Option 1: Reset to tagged version
git reset --hard v1.0.32-stable

# Option 2: Merge from stable branch
git merge stable/download-test

# Option 3: Cherry-pick specific files
git checkout stable/download-test -- frontend/src/components/NetworkTest.tsx
git checkout stable/download-test -- frontend/src/components/NetworkTest.js
```

---

## What NOT to Do

❌ **DO NOT** change the timer logic (starting on first byte)
❌ **DO NOT** add React state updates during download loop  
❌ **DO NOT** switch back to fetch/blob/ReadableStream
❌ **DO NOT** remove the Range header (20MB download)
❌ **DO NOT** add UI throttling or progress updates during download

---

## Testing New Implementations

Before deploying any changes to the download test:

1. ✅ Test on multiple network speeds (fast and slow)
2. ✅ Compare results with speedtest.net or fast.com
3. ✅ Check that speeds are consistent across multiple runs
4. ✅ Verify no slowdown compared to curl/wget
5. ✅ Test on different browsers (Chrome, Firefox, Safari)

---

## Why This Works

**XMLHttpRequest** gives us:
- Native browser progress tracking
- Accurate `onprogress` events as bytes arrive
- No JavaScript measurement overhead
- No buffering issues

**Starting timer on first byte** excludes:
- DNS lookup time
- TCP connection establishment
- SSL/TLS handshake
- Connection overhead

This matches how professional speed tests work.

---

## Contact

If you need to make changes to the download test and aren't sure if they'll break it, **test on the stable branch first** or create a feature branch.

Always keep `stable/download-test` branch and `v1.0.32-stable` tag as backups.

