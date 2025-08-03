# IPGrok Backend API

A Node.js/Express backend API for storing and analyzing internet test results using AWS DynamoDB.

## 🚀 Features

- **Test Results Storage**: Store Quick Test, Detailed Analysis, and Manual Test results
- **Advanced Analytics**: Performance metrics, trends, and comparisons
- **Real-time Statistics**: Live dashboard with test statistics
- **Scalable Architecture**: Built with AWS DynamoDB for high performance
- **RESTful API**: Clean, documented API endpoints
- **Security**: Rate limiting, CORS, and input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- AWS Account with DynamoDB access
- AWS CLI configured (optional, for local development)

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your AWS credentials and configuration.

4. **Create DynamoDB tables:**
   ```bash
   npm run setup-tables
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | AWS access key | Required |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Required |
| `TEST_RESULTS_TABLE` | DynamoDB table name | `ipgrok-test-results` |
| `ANALYTICS_TABLE` | DynamoDB table name | `ipgrok-analytics` |

### AWS Setup

1. **Create an AWS account** if you don't have one
2. **Create an IAM user** with DynamoDB permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:CreateTable",
           "dynamodb:DeleteTable",
           "dynamodb:DescribeTable",
           "dynamodb:GetItem",
           "dynamodb:PutItem",
           "dynamodb:Query",
           "dynamodb:Scan",
           "dynamodb:UpdateItem",
           "dynamodb:DeleteItem"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
3. **Get your access keys** and add them to `.env`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Health Check
```
GET /health
```

### Test Results Endpoints

#### Create Test Result
```
POST /test-results
```

**Request Body:**
```json
{
  "testType": "quickTest|detailedAnalysis|manualTest",
  "networkData": {
    "speedTest": {
      "download": "25.5",
      "upload": "10.2",
      "latency": 15,
      "connectionQuality": "A"
    }
  },
  "mediaData": { ... },
  "systemData": { ... },
  "userId": "optional-user-id"
}
```

#### Get Test Results
```
GET /test-results?testType=quickTest&limit=50
```

#### Get Recent Results
```
GET /test-results/recent?limit=20
```

#### Get Results by User
```
GET /test-results/user/:userId
```

#### Get Results by Type
```
GET /test-results/type/:testType
```

#### Get Specific Result
```
GET /test-results/:testId
```

#### Delete Result
```
DELETE /test-results/:testId
```

#### Get Statistics Summary
```
GET /test-results/stats/summary
```

### Analytics Endpoints

#### Performance Analytics
```
GET /analytics/performance?startDate=2024-01-01&endDate=2024-01-31
```

#### Trend Analysis
```
GET /analytics/trends?groupBy=day&limit=100
```

#### Performance Comparison
```
GET /analytics/comparison?testType=quickTest
```

## 🗄️ Database Schema

### Test Results Table

| Attribute | Type | Description |
|-----------|------|-------------|
| `testId` | String (Hash Key) | Unique test identifier |
| `timestamp` | String (Range Key) | Test timestamp |
| `userId` | String | User identifier |
| `testType` | String | Test type |
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

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers
- **Compression**: Response compression

## 📊 Analytics Features

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

## 🚀 Deployment

### AWS Lambda (Serverless)
```bash
npm run deploy
```

### Docker
```bash
docker build -t ipgrok-backend .
docker run -p 3001:3001 ipgrok-backend
```

### Traditional Server
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 📝 Development

### Project Structure
```
backend/
├── config/          # Configuration files
├── models/          # Data models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── tests/           # Test files
├── server.js        # Main server file
└── package.json     # Dependencies
```

### Adding New Endpoints

1. Create route file in `routes/`
2. Add validation schemas
3. Implement business logic
4. Add error handling
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the troubleshooting guide 