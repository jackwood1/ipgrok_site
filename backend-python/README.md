# IPGrok Backend API - Python/Flask Version

Flask-based REST API for tracking internet speed test results with AWS DynamoDB.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend-python
pip install -r requirements.txt
```

Or use a virtual environment (recommended):

```bash
cd backend-python
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy the example env file
cp env.example .env

# Edit .env and add your AWS credentials
nano .env
```

Or use AWS CLI:
```bash
aws configure
```

### 3. Create DynamoDB Tables

```bash
# Run the setup script
python config/dynamodb.py
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
python app.py

# Or with Flask CLI
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port 3001
```

### 5. Test the API

```bash
# Health check
curl http://localhost:3001/health

# Save a test result
curl -X POST http://localhost:3001/api/test-results \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "quickTest",
    "networkData": {
      "download": 245.67,
      "upload": 20.5,
      "latency": 15
    }
  }'
```

## 📁 Project Structure

```
backend-python/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── config/
│   └── dynamodb.py        # DynamoDB configuration
├── models/
│   └── test_result.py     # TestResult model
└── routes/
    ├── test_results.py    # Test results endpoints
    └── analytics.py       # Analytics endpoints
```

## 🔌 API Endpoints

### Test Results

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/test-results` | Save new test result |
| GET | `/api/test-results` | Get test results with filters |
| GET | `/api/test-results/recent` | Get recent test results |
| GET | `/api/test-results/user/<userId>` | Get results by user |
| GET | `/api/test-results/type/<testType>` | Get results by type |
| GET | `/api/test-results/<testId>` | Get specific result |
| DELETE | `/api/test-results/<testId>` | Delete result |
| GET | `/api/test-results/stats/summary` | Get statistics |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/performance` | Get performance analytics |
| GET | `/api/analytics/trends` | Get trend analysis |
| GET | `/api/analytics/comparison` | Compare performance |

## 🗄️ Database Schema

### Table: `ipgrok-test-results`

```python
{
    'testId': 'uuid-string',          # Primary Key
    'timestamp': '2025-10-12T...',    # Sort Key
    'userId': 'user-id',              # GSI
    'testType': 'quickTest',          # GSI
    'networkData': {...},
    'mediaData': {...},
    'systemData': {...},
    'ipAddress': '192.168.1.1',
    'userAgent': 'Mozilla/...'
}
```

## 🔒 Security Features

- ✅ CORS protection
- ✅ Rate limiting (100 requests / 15 min)
- ✅ Request size limits (10MB)
- ✅ Input validation (Marshmallow)
- ✅ Environment variable management

## 🧪 Testing

### Unit Tests (coming soon)

```bash
pytest
```

### Manual Testing

```bash
# Create test data
curl -X POST http://localhost:3001/api/test-results \
  -H "Content-Type: application/json" \
  -d '{"testType":"quickTest","networkData":{"download":100}}'

# Get recent tests
curl http://localhost:3001/api/test-results/recent

# Get statistics
curl http://localhost:3001/api/test-results/stats/summary
```

## 🚀 Deployment

### Option 1: AWS Lambda (Serverless)

Use Zappa:
```bash
pip install zappa
zappa init
zappa deploy production
```

### Option 2: Gunicorn (Production Server)

```bash
gunicorn -w 4 -b 0.0.0.0:3001 app:app
```

### Option 3: Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 3001
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:3001", "app:app"]
```

Build and run:
```bash
docker build -t ipgrok-backend .
docker run -p 3001:3001 --env-file .env ipgrok-backend
```

### Option 4: AWS Elastic Beanstalk

```bash
eb init -p python-3.11 ipgrok-backend
eb create ipgrok-backend-env
eb deploy
```

## 📦 Dependencies

- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **boto3** - AWS SDK for Python
- **python-dotenv** - Environment variables
- **marshmallow** - Input validation
- **Flask-Limiter** - Rate limiting
- **gunicorn** - WSGI HTTP server

## 🔧 Configuration

### Environment Variables

```env
PORT=3001                  # Server port
NODE_ENV=development       # Environment
FRONTEND_URL=http://...    # Frontend URL for CORS
AWS_REGION=us-east-2      # AWS region
AWS_ACCESS_KEY_ID=...     # AWS credentials
AWS_SECRET_ACCESS_KEY=... # AWS credentials
```

### AWS Credentials

Three ways to configure:

1. **Environment variables** (.env file)
2. **AWS CLI** (`aws configure`)
3. **IAM Role** (when running on AWS)

## 📊 Monitoring

### View Logs

```bash
# Development
python app.py

# Production with Gunicorn
gunicorn --log-level info app:app
```

### CloudWatch (AWS)

If deployed on AWS, logs go to CloudWatch automatically.

## 🐛 Troubleshooting

### Issue: "No module named 'flask'"

```bash
pip install -r requirements.txt
```

### Issue: "Unable to locate credentials"

```bash
# Set up AWS CLI
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### Issue: "Port already in use"

```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 python app.py
```

### Issue: "CORS error from frontend"

Update `FRONTEND_URL` in `.env` to match your frontend URL.

## 📝 Development

### Adding New Endpoints

1. Create route in `routes/` directory
2. Register blueprint in `app.py`
3. Add validation schema if needed
4. Test endpoint

### Database Operations

```python
from models.test_result import TestResult

# Create
result = TestResult(data)
test_id = result.save()

# Read
result = TestResult.get_by_id(test_id)
results = TestResult.get_recent(20)

# Delete
TestResult.delete(test_id)
```

## 🎯 Next Steps

1. Set up AWS credentials
2. Create DynamoDB tables
3. Start the server
4. Integrate with frontend
5. Deploy to production

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
- [AWS DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/)

## ✅ Comparison: Python vs Node.js

| Feature | Python (Flask) | Node.js (Express) |
|---------|----------------|-------------------|
| **Syntax** | More readable | JavaScript |
| **Performance** | Good | Excellent |
| **Async** | Native (async/await) | Native |
| **AWS SDK** | boto3 | aws-sdk |
| **Deployment** | Gunicorn, Lambda | PM2, Lambda |
| **Community** | Large | Very Large |

Both versions have identical functionality and API endpoints!

---

**Backend is ready to track your speed test results!** 🎉

