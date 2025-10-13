# Admin Dashboard Guide

## 🔐 Overview

The admin dashboard provides secure access to analytics and test result management.

## 🎯 Features

### ✅ **Secure Authentication**
- JWT-based login system
- Password hashing (SHA-256)
- Token-based sessions (24-hour expiry)
- Protected routes requiring authentication

### ✅ **Dashboard Tabs**

#### 1. **Overview Tab**
- Total tests count
- Average download/upload speeds
- Average latency
- Test type distribution
- Recent activity (last 7 days)
- Top locations by IP

#### 2. **Recent Tests Tab**
- Table of all recent tests
- Sortable columns
- Test type badges
- IP addresses
- Timestamps

#### 3. **Analytics Tab**
- Performance metrics
- Download/upload statistics
- Best vs average speeds
- Lowest latency
- Connection quality distribution
- Time series data

## 🚀 Setup

### Step 1: Set Admin Password

```bash
cd backend-python
cp env.example .env
nano .env
```

Add:
```env
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=your_random_secret_key_here
```

### Step 2: Restart Backend

```bash
# Kill existing server
pkill -f "python app.py"

# Start with new config
cd backend-python
source venv/bin/activate
python app.py
```

### Step 3: Access Admin

1. Go to your app (http://localhost:3000 or www.ipgrok.com)
2. Click **"🔐 Admin"** button in the header
3. Login with:
   - **Username**: `admin`
   - **Password**: (what you set in ADMIN_PASSWORD)
4. You'll see the admin dashboard!

## 🔒 Security Features

### Password Hashing
```python
# Passwords are hashed with SHA-256
password_hash = hashlib.sha256(password.encode()).hexdigest()
```

### JWT Tokens
- **Expiry**: 24 hours
- **Algorithm**: HS256
- **Stored**: In localStorage (client-side)
- **Verified**: On every protected endpoint request

### Protected Routes
```python
@require_auth
def protected_endpoint():
    # Only accessible with valid JWT token
    pass
```

## 📊 Default Credentials

**⚠️ IMPORTANT: Change these in production!**

- **Username**: `admin`
- **Password**: `changeme` (default, set via ADMIN_PASSWORD env var)

### To Change Password:

1. **Generate a secure password**:
   ```bash
   # Generate random password
   openssl rand -base64 32
   ```

2. **Update .env**:
   ```env
   ADMIN_PASSWORD=your_new_secure_password
   JWT_SECRET=your_new_random_secret
   ```

3. **Restart backend**

## 🎨 Admin Dashboard Features

### Overview Tab
```
📊 Statistics Cards:
- Total Tests: 150
- Avg Download: 245 Mbps
- Avg Upload: 20 Mbps
- Avg Latency: 15 ms

📈 Test Types:
- Quick Test: 100
- Detailed Analysis: 40
- Manual Test: 10

📅 Recent Activity:
- 2025-10-12: 50 tests
- 2025-10-11: 45 tests
- ...

🌍 Top Locations:
- 192.168.1.1: 25 tests
- 10.0.0.5: 20 tests
- ...
```

### Recent Tests Tab
```
Table with columns:
- Time (sortable)
- Type (badge)
- Download speed
- Upload speed
- Latency
- IP address
```

### Analytics Tab
```
Performance Cards:
- Download: Avg / Best
- Upload: Avg / Best
- Latency: Avg / Lowest

Connection Quality Distribution:
- A: 50 tests
- B: 30 tests
- C: 15 tests
...

Time Series Chart:
- Tests per day over last 14 days
```

## 🔗 API Endpoints Used

### Authentication
```
POST /api/auth/login      # Login
POST /api/auth/verify     # Verify token
POST /api/auth/logout     # Logout
GET  /api/auth/me         # Get current user
```

### Data
```
GET /api/test-results/stats/summary    # Overview stats
GET /api/test-results/recent           # Recent tests
GET /api/analytics/performance         # Performance data
```

## 🛡️ Security Best Practices

### For Development:
- ✅ Use `.env` file with secure password
- ✅ Don't commit `.env` to git
- ✅ Use different password than production

### For Production:
- ✅ Use strong password (32+ characters)
- ✅ Use environment variables (not .env file)
- ✅ Enable HTTPS only
- ✅ Rotate JWT_SECRET regularly
- ✅ Add IP whitelist if needed
- ✅ Enable audit logging
- ✅ Add 2FA (future enhancement)

## 🔧 Customization

### Add More Admin Users

Edit `backend-python/routes/auth.py`:

```python
ADMIN_USERS = {
    'admin': hash_of_password,
    'john': hash_of_johns_password,
    'jane': hash_of_janes_password,
}
```

To generate password hash:
```python
import hashlib
password = "your_password"
hash = hashlib.sha256(password.encode()).hexdigest()
print(hash)
```

### Change Token Expiry

Edit `backend-python/routes/auth.py`:

```python
JWT_EXPIRY_HOURS = 24  # Change to desired hours
```

### Add More Admin Features

Ideas:
- Delete test results
- Export data to CSV/Excel
- Email reports
- User management
- System health monitoring
- Database backup/restore

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"changeme"}'
```

Should return:
```json
{
  "success": true,
  "token": "eyJ...",
  "username": "admin",
  "expiresIn": 86400
}
```

### Test Protected Endpoint
```bash
TOKEN="your_jwt_token_here"

curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🎯 User Flow

1. User clicks "🔐 Admin" in header
2. Shows login page
3. User enters username/password
4. Backend verifies credentials
5. Returns JWT token
6. Frontend stores token in localStorage
7. Shows admin dashboard
8. Dashboard loads data from API
9. User can view analytics, manage data
10. Click "Logout" to sign out

## 📱 Mobile Responsive

The admin dashboard is fully responsive:
- Mobile: Single column layout
- Tablet: 2 column layout
- Desktop: 3-4 column layout

## 🐛 Troubleshooting

### "Invalid credentials"
- Check ADMIN_PASSWORD in .env
- Ensure backend was restarted after changing .env
- Password is case-sensitive

### "Failed to connect to server"
- Check backend is running (http://localhost:3001/health)
- Check CORS settings
- Check network tab for errors

### "Token expired"
- Login again
- Token lasts 24 hours by default

### Can't see admin button
- Make sure Header component has onShowAdmin prop
- Check App.tsx has startAdmin function

## ✅ Checklist

- [ ] Backend running
- [ ] ADMIN_PASSWORD set in .env
- [ ] JWT_SECRET set in .env
- [ ] PyJWT installed (`pip install PyJWT==2.8.0`)
- [ ] Can access login page
- [ ] Can login successfully
- [ ] Dashboard loads data
- [ ] All tabs working
- [ ] Can logout
- [ ] Changed default password (production)

---

**Your admin dashboard is ready! Click "🔐 Admin" in the header to access it!** 🎉

