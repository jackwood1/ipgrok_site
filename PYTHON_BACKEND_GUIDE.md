# Python Backend Guide - Complete Setup

## 🎯 Overview

I've created a complete Python/Flask version of the backend API with identical functionality to the Node.js version.

## 📁 What's Included

```
backend-python/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies  
├── setup.py                 # Automated setup script
├── env.example              # Environment variables template
├── README.md                # Full documentation
├── config/
│   └── dynamodb.py          # DynamoDB configuration & table creation
├── models/
│   └── test_result.py       # TestResult model with all CRUD operations
└── routes/
    ├── test_results.py      # Test results API endpoints
    └── analytics.py         # Analytics API endpoints
```

## 🚀 Quick Start (3 Steps!)

### Step 1: Run Setup Script

```bash
cd backend-python
python setup.py
```

This will:
- ✅ Create virtual environment
- ✅ Install all dependencies
- ✅ Check AWS credentials
- ✅ Create DynamoDB tables

### Step 2: Configure AWS (if needed)

```bash
aws configure
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-2`
- Output format: `json`

### Step 3: Start the Server

```bash
python app.py
```

You should see:
```
🚀 IPGrok Backend API (Python) running on port 3001
📊 Health check: http://localhost:3001/health
🔗 API Base URL: http://localhost:3001/api
```

## 📊 API Endpoints (Identical to Node.js version)

### Test Results
- POST   `/api/test-results` - Save test result
- GET    `/api/test-results` - Get results (with filters)
- GET    `/api/test-results/recent` - Get recent results
- GET    `/api/test-results/user/:userId` - Get by user
- GET    `/api/test-results/type/:testType` - Get by type
- GET    `/api/test-results/:testId` - Get specific result
- DELETE `/api/test-results/:testId` - Delete result
- GET    `/api/test-results/stats/summary` - Get statistics

### Analytics
- GET `/api/analytics/performance` - Performance metrics
- GET `/api/analytics/trends` - Trend analysis  
- GET `/api/analytics/comparison` - Comparison data

## 🧪 Test It

```bash
# Health check
curl http://localhost:3001/health

# Save a test
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

# Get recent tests
curl http://localhost:3001/api/test-results/recent

# Get statistics
curl http://localhost:3001/api/test-results/stats/summary
```

## 🔄 Python vs Node.js - Choose Your Preference

Both backends have **identical functionality**. Choose based on your preference:

| Aspect | Python (Flask) | Node.js (Express) |
|--------|----------------|-------------------|
| **Setup** | `python setup.py` | `npm install` |
| **Start** | `python app.py` | `npm run dev` |
| **Dependencies** | boto3, Flask | aws-sdk, express |
| **Syntax** | Python (more readable) | JavaScript |
| **Performance** | Good | Slightly faster |
| **Deployment** | Gunicorn, Lambda | PM2, Lambda |
| **Your Codebase** | Match if using Python elsewhere | Match frontend (JS) |

## 📦 Dependencies

All managed in `requirements.txt`:
- **Flask** - Web framework
- **boto3** - AWS SDK
- **Flask-CORS** - CORS handling
- **marshmallow** - Input validation
- **Flask-Limiter** - Rate limiting
- **gunicorn** - Production server

## 🚀 Deployment Options

### 1. AWS Lambda (Serverless)
```bash
pip install zappa
zappa init
zappa deploy production
```

### 2. Gunicorn (Production)
```bash
gunicorn -w 4 -b 0.0.0.0:3001 app:app
```

### 3. Docker
```bash
docker build -t ipgrok-backend .
docker run -p 3001:3001 ipgrok-backend
```

### 4. AWS Elastic Beanstalk
```bash
eb init -p python-3.11 ipgrok-backend
eb deploy
```

## 🔗 Frontend Integration

The frontend `api.ts` service works with **both** backends identically!

No changes needed in frontend code - just point to the correct backend URL:

```typescript
// In frontend/.env or vite config
VITE_API_URL=http://localhost:3001/api
```

## 💡 Development Tips

### Adding New Endpoints

1. Create function in `routes/test_results.py` or `routes/analytics.py`
2. Add route decorator: `@test_results_bp.route('/path', methods=['GET'])`
3. Add validation schema if needed
4. Return JSON response

Example:
```python
@test_results_bp.route('/my-endpoint', methods=['GET'])
def my_endpoint():
    try:
        data = do_something()
        return jsonify({'success': True, 'data': data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### Database Operations

```python
from models.test_result import TestResult

# Save
result = TestResult(data)
test_id = result.save()

# Get
result = TestResult.get_by_id(test_id)
results = TestResult.get_recent(20)

# Delete
TestResult.delete(test_id)
```

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### "Unable to locate credentials"
```bash
aws configure
# or
cp env.example .env
# Edit .env with your credentials
```

### "Port 3001 already in use"
```bash
PORT=3002 python app.py
```

### "CORS error"
Update `FRONTEND_URL` in `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

## ✅ Checklist

- [ ] Python 3.8+ installed
- [ ] AWS credentials configured
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] DynamoDB tables created (`python config/dynamodb.py`)
- [ ] Server starts successfully (`python app.py`)
- [ ] Health check works (`curl http://localhost:3001/health`)
- [ ] Can save test results
- [ ] Frontend can connect

## 📚 Documentation

- Full API docs: `backend-python/README.md`
- Setup script: `backend-python/setup.py`
- Database config: `backend-python/config/dynamodb.py`

## 🎉 You're All Set!

Your Python backend is ready to track speed test results!

**Next steps:**
1. Start backend: `python app.py`
2. Start frontend: `cd frontend && npm run dev`
3. Run a speed test
4. Check if data is saved: `curl http://localhost:3001/api/test-results/recent`

---

**Choose Python or Node.js - both work perfectly!** 🚀

