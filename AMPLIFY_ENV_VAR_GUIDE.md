# How to Add Environment Variable to AWS Amplify

## 🎯 The Problem

Your frontend is trying to connect to:
```
❌ http://localhost:3001/api/auth/login
```

But it should connect to:
```
✅ https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api/auth/login
```

## 🔧 The Solution

Add the `VITE_API_URL` environment variable to Amplify.

---

## 📋 **Step-by-Step Instructions:**

### **Step 1: Open AWS Amplify Console**

Go to: https://console.aws.amazon.com/amplify/home?region=us-east-2

You should see your app listed (might be named `ipgrok_site`, `main`, or similar).

---

### **Step 2: Select Your App**

Click on your app name to open it.

---

### **Step 3: Go to Environment Variables**

On the left sidebar, look for:
- **"Hosting"** section
- Under it, click **"Environment variables"**

Or look for **"App settings"** → **"Environment variables"**

---

### **Step 4: Add Variable**

1. Click the **"Manage variables"** or **"Add variable"** button

2. You'll see a form with two fields:
   - **Key** (variable name)
   - **Value** (variable value)

3. Enter:
   ```
   Key:   VITE_API_URL
   Value: https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api
   ```

4. Click **"Save"**

---

### **Step 5: Redeploy**

After saving the environment variable:

1. Go to **"Hosting"** in the left sidebar

2. You'll see your branches (probably just "main")

3. Click the **"Redeploy this version"** button
   - OR -
   Find the latest build and click the **"Redeploy"** option

4. Wait for the build to complete (~3-5 minutes)

---

## 🔍 **How to Verify It Worked:**

### **Check Build Logs:**

1. Click on the build in progress
2. Expand the **"Build"** section
3. Look for environment variables being used
4. Should see something like:
   ```
   Environment variables:
   - VITE_API_URL=https://lw0rbd63sc...
   ```

### **Check Built App:**

1. After deployment completes
2. Go to https://www.ipgrok.com
3. Open DevTools (F12)
4. Go to Console tab
5. Type: `import.meta.env.VITE_API_URL`
6. Should show: `https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api`

---

## 🎯 **What This Does:**

The `VITE_API_URL` environment variable tells your frontend where the backend API is located.

**Build time:**
```javascript
// In your code:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Without env var:
API_BASE_URL = 'http://localhost:3001/api'  ❌ Wrong!

// With env var set in Amplify:
API_BASE_URL = 'https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api'  ✅ Correct!
```

---

## 🐛 **Troubleshooting:**

### "I don't see Environment variables option"

Look in these locations:
1. **App settings** → **Environment variables**
2. **Hosting** → **Environment variables**
3. **Build settings** → **Environment variables**

### "Variable was added but still shows localhost"

- Did you **redeploy** after adding the variable?
- Did you **hard refresh** the browser (Cmd+Shift+R)?
- Check the **build logs** to confirm variable was included

### "Build failed after adding variable"

- Check the variable name is exactly: `VITE_API_URL` (case-sensitive!)
- Check the URL doesn't have trailing spaces
- Check Amplify build logs for errors

---

## ✅ **Checklist:**

- [ ] Opened AWS Amplify Console
- [ ] Selected ipgrok_site app
- [ ] Found "Environment variables" section
- [ ] Clicked "Add variable"
- [ ] Entered key: `VITE_API_URL`
- [ ] Entered value: `https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api`
- [ ] Clicked "Save"
- [ ] Clicked "Redeploy this version"
- [ ] Waited for build to complete
- [ ] Checked build logs show env var
- [ ] Hard refreshed www.ipgrok.com
- [ ] Checked console shows Lambda URL (not localhost)
- [ ] Tried logging in again

---

## 🎯 **After Adding:**

The error will change from:
```
❌ POST http://localhost:3001/api/auth/login 401 (UNAUTHORIZED)
```

To:
```
✅ POST https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api/auth/login 200 (OK)
```

And login will work! 🎉

---

**Add the environment variable to Amplify and redeploy - that's all you need!** 🚀

