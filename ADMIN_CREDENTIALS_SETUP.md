# 🔐 Admin Credentials Setup Guide

## ✅ **Your Secure Credentials (Save These!):**

### **Production Admin Password:**
```
IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=
```

### **JWT Secret Key:**
```
/q+DVyNCT3HAYfBQ8Ilw6KzsXz4+dgFzjl0jOZOkSQqRyPfrdqP4y9Y4vwmW0Bvw
KOwhkbtY6K3NRk0GnL9kxA==
```

**⚠️ SAVE THESE IN A SECURE LOCATION! You'll need them to login.**

---

## 🚀 **Step-by-Step Setup:**

### **Step 1: Configure AWS Lambda Environment Variables**

1. Go to **AWS Lambda Console**: https://console.aws.amazon.com/lambda/

2. Search for and select: **`ipgrok-backend-production`**

3. Click **Configuration** tab

4. Click **Environment variables** (left sidebar)

5. Click **Edit**

6. Click **Add environment variable** for each:

   **Variable 1:**
   ```
   Key:   ADMIN_PASSWORD
   Value: IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=
   ```

   **Variable 2:**
   ```
   Key:   JWT_SECRET
   Value: /q+DVyNCT3HAYfBQ8Ilw6KzsXz4+dgFzjl0jOZOkSQqRyPfrdqP4y9Y4vwmW0Bvw
KOwhkbtY6K3NRk0GnL9kxA==
   ```

   **Variable 3:**
   ```
   Key:   FRONTEND_URL
   Value: https://www.ipgrok.com
   ```

7. Click **Save**

---

### **Step 2: Configure AWS Amplify Environment Variables**

1. Go to **AWS Amplify Console**: https://console.aws.amazon.com/amplify/

2. Select your app (should be named **ipgrok_site** or similar)

3. Click **Environment variables** (left sidebar)

4. Click **Add variable**

5. Add:
   ```
   Key:   VITE_API_URL
   Value: https://lw0rbd63sc.execute-api.us-east-2.amazonaws.com/production/api
   ```

6. Click **Save**

7. Go back to **App settings** → **General**

8. Click **Redeploy this version**

---

### **Step 3: Wait for Deployment**

- **Amplify deployment**: Takes 3-5 minutes
- Monitor at: Amplify Console → your app → Build settings

---

### **Step 4: Login to Admin Dashboard**

Once Amplify deployment completes:

1. Go to: **https://www.ipgrok.com**

2. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)

3. Click **"🔐 Admin"** button in the header

4. Login with:
   ```
   Username: admin
   Password: IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=
   ```

5. ✅ You're in! View your analytics!

---

## 📝 **Save These Credentials:**

### **Login Information (www.ipgrok.com):**

```
URL:      https://www.ipgrok.com
Username: admin
Password: IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=
```

**💾 Save this in:**
- Password manager (1Password, LastPass, etc.)
- Secure note
- Encrypted file

**🚫 DO NOT:**
- Commit to git
- Share publicly
- Email unencrypted
- Store in plain text on computer

---

## 🧪 **Test Lambda Environment Variables:**

You can verify they're set correctly:

```bash
# Using AWS CLI
aws lambda get-function-configuration \
  --function-name ipgrok-backend-production \
  --region us-east-2 \
  --query 'Environment.Variables'
```

Should show:
```json
{
  "ADMIN_PASSWORD": "IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=",
  "JWT_SECRET": "/q+DVyNCT3HAYfBQ8Ilw6KzsXz4+dgFzjl0jOZOkSQqRyPfrdqP4y9Y4vwmW0Bvw...",
  "FRONTEND_URL": "https://www.ipgrok.com",
  ...
}
```

---

## 🔄 **If You Need to Change Password Later:**

### **Option 1: Generate New Password**

```bash
openssl rand -base64 32
```

### **Option 2: Update Lambda Environment**

1. Lambda Console → ipgrok-backend-production
2. Configuration → Environment variables → Edit
3. Update ADMIN_PASSWORD
4. Save

### **Option 3: Use Custom Password**

If you prefer a custom password (not random):

1. Generate hash:
   ```python
   import hashlib
   password = "YourCustomPassword123!"
   hash = hashlib.sha256(password.encode()).hexdigest()
   print(hash)
   ```

2. Add hash to Lambda environment as ADMIN_PASSWORD

3. Login with your custom password

---

## ✅ **Checklist:**

- [ ] Saved admin password securely
- [ ] Saved JWT secret securely
- [ ] Added ADMIN_PASSWORD to Lambda
- [ ] Added JWT_SECRET to Lambda
- [ ] Added FRONTEND_URL to Lambda
- [ ] Added VITE_API_URL to Amplify
- [ ] Redeployed Amplify
- [ ] Waited for deployment to complete
- [ ] Hard refreshed www.ipgrok.com
- [ ] Successfully logged in
- [ ] Viewing admin dashboard

---

## 🎯 **Quick Summary:**

### **What You Need to Do:**

1. **AWS Lambda Console**:
   - Add 3 environment variables (ADMIN_PASSWORD, JWT_SECRET, FRONTEND_URL)

2. **AWS Amplify Console**:
   - Add 1 environment variable (VITE_API_URL)
   - Redeploy

3. **Wait 5 minutes**

4. **Login**:
   - URL: https://www.ipgrok.com
   - Username: admin
   - Password: IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=

---

## 🆘 **Troubleshooting:**

### "Invalid credentials"
- Check password is exactly: `IOo9tB6hgsBJ91UAa2FftEdeKMorpviQb0WIsbQHtmQ=`
- Check Lambda environment variables are saved
- Lambda auto-restarts after env var changes

### "Failed to connect"
- Check Amplify deployment finished
- Check VITE_API_URL is set correctly in Amplify
- Hard refresh the page

### "CORS error"
- Check FRONTEND_URL in Lambda is set to: https://www.ipgrok.com
- No trailing slash!

---

**Copy the credentials above and follow the steps! You'll be logged in within 10 minutes!** 🎉

