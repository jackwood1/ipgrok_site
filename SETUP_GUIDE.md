# IPGrok Setup Guide

Complete setup guide for IPGrok - Internet Performance Testing Application with AWS DynamoDB backend.

## 🏗️ Architecture Overview

```
IPGrok Application
├── Frontend (React + TypeScript)
│   ├── Network Testing
│   ├── Media Testing
│   ├── System Information
│   └── Results Dashboard
└── Backend (Node.js + Express)
    ├── AWS DynamoDB
    ├── RESTful API
    └── Analytics Engine
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **AWS Account** with DynamoDB access
- **Git** for version control
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ipgrok_site

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. AWS Configuration

#### Create AWS Account
1. Go to [AWS Console](https://aws.amazon.com/)
2. Create a new account or sign in
3. Navigate to IAM (Identity and Access Management)

#### Create IAM User
1. Go to IAM → Users → Create User
2. Name: `ipgrok-backend-user`
3. Select "Programmatic access"
4. Attach policy: `AmazonDynamoDBFullAccess` (for development)
5. Create user and download the access keys

#### Configure Environment Variables

```bash
# In backend directory
cp env.example .env
```

Edit `.env` with your AWS credentials:
```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Create DynamoDB Tables

```bash
# In backend directory
npm run setup-tables
```

This will create:
- `ipgrok-test-results` - Stores test results
- `ipgrok-analytics` - Stores analytics data

### 4. Create Speed Test Files

The application requires test files in S3 for accurate download speed testing.

#### Create Test Files

Run one of these commands in the `backend/scripts` directory:

**Option 1: Using Python (Recommended)**
```bash
cd backend/scripts
python3 create-test-files.py
```

**Option 2: Using Shell Script**
```bash
cd backend/scripts
./create-test-files.sh
```

**Option 3: Manual Creation**
```bash
# Mac/Linux
dd if=/dev/urandom of=10MB.test bs=1m count=10

# Or using Python one-liner
python3 -c "import os; open('10MB.test', 'wb').write(os.urandom(10 * 1024 * 1024))"
```

#### Upload to S3

```bash
# Upload the test file
aws s3 cp 10MB.test s3://download-test-files-ipgrok/10MB.test --acl public-read

# Verify it's accessible
curl -I https://download-test-files-ipgrok.s3.us-east-2.amazonaws.com/10MB.test
```

#### Configure S3 CORS

Ensure your S3 bucket has proper CORS configuration:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply CORS configuration:
```bash
# Save the above JSON to cors-config.json, then:
aws s3api put-bucket-cors --bucket download-test-files-ipgrok --cors-configuration file://cors-config.json
```

> **⚠️ Important**: Without these test files, the speed test will fall back to simulated speeds in development mode, which won't be accurate.

### 5. Start the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## 📊 Database Schema

### Test Results Table (`ipgrok-test-results`)

| Attribute | Type | Description |
|-----------|------|-------------|
| `testId` | String (Hash Key) | Unique test identifier |
| `timestamp` | String (Range Key) | Test timestamp |
| `userId` | String | User identifier |
| `testType` | String | Test type (quickTest, detailedAnalysis, manualTest) |
| `networkData` | Object | Network test results |
| `mediaData` | Object | Media test results |
| `systemData` | Object | System information |
| `advancedTestsData` | Object | Advanced test results |
| `ipAddress` | String | Client IP address |
| `userAgent` | String | Browser user agent |
| `location` | Object | Geographic location |
| `deviceInfo` | Object | Device information |

### Global Secondary Indexes
- **UserIdIndex**: Query by user ID
- **TestTypeIndex**: Query by test type

## 🔌 API Endpoints

### Base URL: `http://localhost:3001/api`

#### Test Results
- `POST /test-results` - Save test result
- `GET /test-results` - Get test results with filters
- `GET /test-results/recent` - Get recent results
- `GET /test-results/user/:userId` - Get results by user
- `GET /test-results/type/:testType` - Get results by type
- `GET /test-results/:testId` - Get specific result
- `DELETE /test-results/:testId` - Delete result
- `GET /test-results/stats/summary` - Get statistics

#### Analytics
- `GET /analytics/performance` - Performance analytics
- `GET /analytics/trends` - Trend analysis
- `GET /analytics/comparison` - Performance comparison

#### Health Check
- `GET /health` - API health status

## 🔧 Configuration Options

### Frontend Configuration

Create `.env` in frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
```

### Backend Configuration

Environment variables in `backend/.env`:
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Tables (optional)
TEST_RESULTS_TABLE=ipgrok-test-results
ANALYTICS_TABLE=ipgrok-analytics

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing the Setup

### 1. Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "IPGrok Backend API"
}
```

### 2. Test API Endpoint
```bash
curl -X POST http://localhost:3001/api/test-results \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "quickTest",
    "networkData": {
      "speedTest": {
        "download": "25.5",
        "upload": "10.2",
        "latency": 15
      }
    }
  }'
```

### 3. Frontend Integration
1. Open `http://localhost:5173`
2. Run a Quick Test
3. Check the Results Dashboard
4. Verify data is saved to DynamoDB

## 📈 Analytics Features

### Performance Metrics
- Average download/upload speeds
- Latency analysis
- Connection quality distribution
- Best/worst performance records

### Trend Analysis
- Daily, weekly, monthly trends
- Test type distribution over time
- Performance patterns

### Comparison Analytics
- Test type comparisons
- Time of day analysis
- Device type comparisons
- Geographic comparisons

## 🚀 Deployment Options

### Option 1: AWS Lambda (Serverless)
```bash
cd backend
npm run deploy
```

### Option 2: Docker
```bash
# Build and run backend
cd backend
docker build -t ipgrok-backend .
docker run -p 3001:3001 ipgrok-backend

# Build and run frontend
cd frontend
docker build -t ipgrok-frontend .
docker run -p 5173:5173 ipgrok-frontend
```

### Option 3: Traditional Server
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🔒 Security Considerations

### Production Security
1. **Use IAM Roles** instead of access keys
2. **Enable DynamoDB Encryption** at rest
3. **Configure VPC** for network isolation
4. **Set up CloudWatch** for monitoring
5. **Enable AWS WAF** for API protection

### Environment Variables
- Never commit `.env` files
- Use AWS Secrets Manager for production
- Rotate access keys regularly

## 📊 Monitoring and Logging

### CloudWatch Setup
1. Create CloudWatch Log Group
2. Configure log retention
3. Set up alarms for errors
4. Monitor API performance

### Application Logging
```javascript
// Backend logging
console.log('Test result saved:', testId);
console.error('Database error:', error);
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. DynamoDB Connection Error
```
Error: Unable to connect to DynamoDB
```
**Solution:**
- Verify AWS credentials
- Check AWS region
- Ensure IAM permissions

#### 2. CORS Error
```
Access to fetch at 'http://localhost:3001/api' from origin 'http://localhost:5173' has been blocked
```
**Solution:**
- Check CORS configuration in backend
- Verify FRONTEND_URL in .env

#### 3. Table Not Found
```
Error: Requested resource not found
```
**Solution:**
- Run `npm run setup-tables`
- Check table names in .env
- Verify AWS region

#### 4. Rate Limiting
```
Too many requests from this IP
```
**Solution:**
- Increase rate limit in .env
- Implement request caching
- Use connection pooling

### Debug Mode
```bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
REACT_APP_DEBUG=true npm run dev
```

## 📚 Additional Resources

- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review AWS CloudWatch logs
3. Create an issue in the repository
4. Check the API documentation

## 📄 License

MIT License - see LICENSE file for details 