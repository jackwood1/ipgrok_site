# Backend Setup Guide - DynamoDB + API

Complete guide to set up the IPGrok backend with DynamoDB and REST API.

## 🏗️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Frontend  │ ──────▶ │  Express    │ ──────▶ │  DynamoDB    │
│  (React)    │  HTTP   │   API       │  AWS    │   Tables     │
└─────────────┘         └─────────────┘         └──────────────┘
```

## 📋 What's Already Built

The backend is already scaffolded with:
- ✅ Express.js server (`server.js`)
- ✅ DynamoDB configuration (`config/dynamodb.js`)
- ✅ Data models (`models/TestResult.js`)
- ✅ API routes (`routes/testResults.js`, `routes/analytics.js`)
- ✅ Setup scripts (`scripts/setup-tables.js`)
- ✅ Frontend API service (`frontend/src/services/api.ts`)

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure AWS Credentials

#### Option A: Using AWS CLI (Recommended)
```bash
# Install AWS CLI if not already installed
# Mac:
brew install awscli

# Configure with your credentials
aws configure
# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-2
# - Default output format: json
```

#### Option B: Environment Variables
```bash
# Copy the example env file
cp env.example .env

# Edit .env and add your credentials
nano .env
```

Add:
```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AWS Configuration
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB Table Names
TEST_RESULTS_TABLE=ipgrok-test-results
ANALYTICS_TABLE=ipgrok-analytics

# Security
JWT_SECRET=your_random_secret_key_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Step 3: Create DynamoDB Tables

```bash
# Run the setup script
npm run setup-tables
```

This will create:
- ✅ `ipgrok-test-results` - Stores all test results
- ✅ `ipgrok-analytics` - Stores aggregated analytics

### Step 4: Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 IPGrok Backend API running on port 3001
📊 Health check: http://localhost:3001/health
🔗 API Base URL: http://localhost:3001/api
```

### Step 5: Test the API

```bash
# Health check
curl http://localhost:3001/health

# Should return:
{
  "status": "OK",
  "timestamp": "2025-10-12T...",
  "service": "IPGrok Backend API"
}
```

## 📊 Database Schema

### Table: `ipgrok-test-results`

| Attribute | Type | Description |
|-----------|------|-------------|
| `testId` | String (PK) | Unique test identifier (UUID) |
| `timestamp` | String (SK) | ISO timestamp |
| `userId` | String | User identifier (GSI) |
| `testType` | String | quickTest, detailedAnalysis, manualTest (GSI) |
| `networkData` | Object | Speed, latency, etc. |
| `mediaData` | Object | Camera, mic test results |
| `systemData` | Object | Browser, OS, IP info |
| `advancedTestsData` | Object | DNS, CDN, security tests |
| `ipAddress` | String | Client IP |
| `userAgent` | String | Browser user agent |
| `location` | Object | Geo location data |
| `deviceInfo` | Object | Device information |

**Indexes:**
- `UserIdIndex` (GSI): Query by `userId`
- `TestTypeIndex` (GSI): Query by `testType`

## 🔌 API Endpoints

### Test Results

#### POST `/api/test-results`
Save a new test result
```bash
curl -X POST http://localhost:3001/api/test-results \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "quickTest",
    "networkData": {
      "download": 245.67,
      "upload": 20.5,
      "latency": 15
    },
    "systemData": {
      "browser": "Chrome",
      "os": "macOS"
    }
  }'
```

#### GET `/api/test-results`
Get test results with filters
```bash
# All results
curl http://localhost:3001/api/test-results

# Filter by test type
curl http://localhost:3001/api/test-results?testType=quickTest

# Filter by date range
curl http://localhost:3001/api/test-results?startDate=2025-10-01&endDate=2025-10-12
```

#### GET `/api/test-results/:testId`
Get a specific test result
```bash
curl http://localhost:3001/api/test-results/abc-123-def
```

#### GET `/api/test-results/stats/summary`
Get test statistics
```bash
curl http://localhost:3001/api/test-results/stats/summary
```

### Analytics

#### GET `/api/analytics/performance`
Get performance analytics
```bash
curl http://localhost:3001/api/analytics/performance
```

#### GET `/api/analytics/trends`
Get trend analysis
```bash
curl http://localhost:3001/api/analytics/trends?limit=200
```

#### GET `/api/analytics/comparison`
Compare performance across criteria
```bash
curl http://localhost:3001/api/analytics/comparison
```

## 🔗 Frontend Integration

The frontend API service is already created at `frontend/src/services/api.ts`.

### Example Usage in Frontend

```typescript
import { apiService } from '../services/api';

// Save test results
const saveResults = async (testData) => {
  try {
    const response = await apiService.saveTestResult({
      testType: 'quickTest',
      networkData: testData.network,
      systemData: testData.system,
      ipAddress: testData.ip,
      userAgent: navigator.userAgent
    });
    
    console.log('Saved with ID:', response.testId);
  } catch (error) {
    console.error('Failed to save:', error);
  }
};

// Get recent results
const getRecent = async () => {
  const response = await apiService.getRecentTestResults(20);
  console.log('Recent tests:', response.results);
};

// Get statistics
const getStats = async () => {
  const response = await apiService.getTestStatistics();
  console.log('Stats:', response.stats);
};
```

## 🔒 Security Features

Already implemented:
- ✅ Helmet (security headers)
- ✅ CORS (cross-origin protection)
- ✅ Rate limiting (100 requests per 15 min)
- ✅ Input validation (Joi schemas)
- ✅ Request size limits (10MB)

## 📈 Monitoring & Logging

### View Logs
```bash
# Development
npm run dev  # Shows all logs

# Production
NODE_ENV=production npm start
```

### Monitor DynamoDB
```bash
# AWS CLI commands
aws dynamodb describe-table --table-name ipgrok-test-results
aws dynamodb scan --table-name ipgrok-test-results --max-items 10
```

## 🚀 Deployment Options

### Option 1: AWS Amplify (Current Setup)
Deploy backend alongside frontend:
1. Add backend build to `amplify.yml`
2. Configure environment variables in Amplify Console
3. Deploy

### Option 2: AWS Lambda (Serverless)
```bash
# Install Serverless Framework
npm install -g serverless

# Deploy
cd backend
npm run deploy
```

### Option 3: EC2 / Elastic Beanstalk
Traditional server deployment

### Option 4: Docker
```dockerfile
# Dockerfile example
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🧪 Testing

### Test API Endpoints
```bash
# Run tests
cd backend
npm test
```

### Manual Testing
```bash
# Save a test
curl -X POST http://localhost:3001/api/test-results \
  -H "Content-Type: application/json" \
  -d '{"testType":"quickTest","networkData":{"download":245}}'

# Get it back
curl http://localhost:3001/api/test-results/recent
```

## 🔧 Troubleshooting

### Issue: "Cannot find module 'aws-sdk'"
```bash
cd backend
npm install
```

### Issue: "Access Denied" when creating tables
```bash
# Check AWS credentials
aws sts get-caller-identity

# Ensure IAM user has DynamoDB permissions
```

### Issue: "Port 3001 already in use"
```bash
# Kill the process
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm start
```

### Issue: "CORS error from frontend"
```bash
# Update FRONTEND_URL in .env
FRONTEND_URL=http://localhost:3000

# Or for production
FRONTEND_URL=https://www.ipgrok.com
```

## 📝 Next Steps

### 1. Start Backend Locally
```bash
cd backend
npm install
npm run setup-tables
npm run dev
```

### 2. Update Frontend to Use API
In your test completion handlers, add:
```typescript
import { apiService } from '../services/api';

// After test completes
await apiService.saveTestResult({
  testType: 'quickTest',
  networkData: results.network,
  systemData: results.system
});
```

### 3. Test End-to-End
1. Start backend: `npm run dev`
2. Start frontend: `cd frontend && npm run dev` (on port 3000)
3. Run a speed test
4. Check backend logs for saved data
5. Query API to see results

### 4. Deploy to Production
1. Set up environment variables in Amplify
2. Update API URL in frontend: `VITE_API_URL=https://api.ipgrok.com`
3. Deploy backend (Lambda, EC2, or with Amplify)
4. Update CORS settings for production domain

## 📚 Documentation

- Full Backend API docs: `backend/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Frontend API Service: `frontend/src/services/api.ts`

## ✅ Checklist

Before deploying:
- [ ] AWS credentials configured
- [ ] DynamoDB tables created
- [ ] Backend running locally (port 3001)
- [ ] Frontend can connect to backend
- [ ] Test data being saved successfully
- [ ] Environment variables set for production
- [ ] CORS configured correctly
- [ ] Rate limiting tested

---

**You're all set! The backend is ready to track and store all your speed test results!** 🎉

