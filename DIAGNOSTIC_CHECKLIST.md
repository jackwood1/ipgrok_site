# Diagnostic Checklist - Speed Test Issues

## Issue Report
- **50MB file downloaded 10 times** ❌
- **Speed doesn't match speedtest.net** ❌

## Where to Test

### Option 1: Production Site (www.ipgrok.com)
**Check deployment status first!**

1. Go to AWS Amplify Console
2. Check if build is complete
3. Look for commit `115c107` in the deployed version
4. Clear browser cache before testing

### Option 2: Local Development
**Dev server won't start on ports 5173/5174**

Try these ports:
```bash
# Port 3000
cd frontend && npx vite --port 3000 --host 127.0.0.1

# Port 8080
cd frontend && npx vite --port 8080 --host 127.0.0.1

# Port 4000
cd frontend && npx vite --port 4000 --host 127.0.0.1
```

## Diagnostic Steps

### 1. Check What's Actually Running

Open browser DevTools (F12) → Console, look for:

```javascript
// Should see ONCE:
"NetworkTest component mounted with props: {autoStart: true, quickTestMode: true}"
"Auto-starting network test (once on mount)..."
"Calling runTest from auto-start..."

// Should NOT see multiple times:
"Test already initiated, skipping"  // Means remounting is happening
"Test already running, skipping"    // Means runTest called multiple times
```

### 2. Check Network Tab

In DevTools → Network tab:

**What you SHOULD see:**
```
GET  50MB.test     52.4 MB    ~1.7s    (1 request)
HEAD 50MB.test     1 KB       ~12ms    (10 requests)
Total: 11 requests, ~50MB data
```

**What you should NOT see:**
```
GET  50MB.test     52.4 MB    (10+ requests)  ❌
```

### 3. Check Speed Calculation

In Console, look for:
```javascript
Download test completed: {
  receivedBytes: 52428800,    // Should be exactly this
  timeSec: "1.xx",            // Should be 1-2 seconds for 245 Mbps
  megabits: "419.43",         // (52428800 * 8) / 1000000
  speed: "245.xx Mbps"        // Should match speedtest.net
}
```

**Formula check:**
```
Speed (Mbps) = (receivedBytes * 8) / 1,000,000 / timeSec

For 245 Mbps:
245 = (52,428,800 * 8) / 1,000,000 / timeSec
245 = 419.43 / timeSec
timeSec = 419.43 / 245 = 1.71 seconds ✅
```

### 4. Common Issues

#### Issue: Old code still running
**Cause**: Browser cache or deployment not complete
**Solution**:
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
- Clear cache in DevTools
- Check Amplify deployment status

#### Issue: Dev server won't start
**Cause**: Ports in use or permission issues
**Solution**:
- Try different port (3000, 4000, 8080)
- Use `127.0.0.1` instead of `::1` (IPv4 vs IPv6)
- Check if another process is using the port:
  ```bash
  lsof -i :5173
  kill -9 <PID>
  ```

#### Issue: Still downloading 10 times
**Possible causes**:
1. **Component remounting** - check console for "component mounted" × 10
2. **useEffect loop** - check for "onDataUpdate" dependency issues
3. **Parent re-rendering** - check if QuickTest is re-rendering
4. **Old code** - check if new commits are deployed

#### Issue: Speed calculation wrong
**Check**:
1. Is it using decimal (1,000,000) or binary (1,048,576)?
2. Is receivedBytes correct (52,428,800)?
3. Is timeSec realistic (1-2 seconds)?
4. Look at the `calculation` field in console logs

## Test Comparison

### speedtest.net Results
Record these:
- Download: ____ Mbps
- Upload: ____ Mbps
- Latency: ____ ms

### ipgrok Results
Record these:
- Download: ____ Mbps
- Upload: ____ Mbps
- Latency: ____ ms

**They should match within ±10%**

## What to Report

If still broken, report:
1. **Where testing**: localhost or www.ipgrok.com
2. **Console logs**: Copy the "Download test completed" object
3. **Network tab**: How many GET requests to 50MB.test
4. **Speed comparison**:
   - speedtest.net: ___ Mbps
   - ipgrok: ___ Mbps
5. **Any error messages**

## Quick Fixes to Try

### 1. Hard Refresh + Clear Cache
```
Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
Open DevTools → Application → Clear storage → Clear site data
```

### 2. Disable Service Workers
```
DevTools → Application → Service Workers → Unregister
```

### 3. Incognito/Private Window
```
Open in incognito mode to test without cache
```

### 4. Check Amplify Deployment
```
AWS Amplify Console → Check build status
Should show commit 115c107 as deployed
```

### 5. Start Fresh Dev Server
```bash
# Kill any running processes
pkill -f vite

# Start on different port
cd frontend
npx vite --port 3000 --host 127.0.0.1
```

## Expected Behavior (After Fixes)

✅ **Console logs**:
- "NetworkTest component mounted" × 1
- "Auto-starting network test" × 1
- "runTest called" × 1
- "Download test completed" × 1

✅ **Network tab**:
- 1 GET request (50MB)
- 10 HEAD requests (1KB each)

✅ **Speed**:
- Matches speedtest.net (±10%)
- ~245 Mbps for your connection

✅ **Test duration**:
- ~2-3 seconds total
- ~1.7 seconds for download

---

**Use this checklist to diagnose the exact issue!**

