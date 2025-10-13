"""
IPGrok Backend API - Python Flask Version
Main application file
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os
from datetime import datetime

from routes.test_results import test_results_bp
from routes.analytics import analytics_bp
from routes.auth import auth_bp
from config.dynamodb import init_dynamodb

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# CORS configuration
allowed_origins = [
    os.getenv('FRONTEND_URL', 'http://localhost:5173'),
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://www.ipgrok.com'
]

CORS(app, resources={
    r"/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per 15 minutes"],
    storage_uri="memory://"
)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max request size
app.config['JSON_SORT_KEYS'] = False

# Initialize DynamoDB connection
init_dynamodb()

# Register blueprints
app.register_blueprint(test_results_bp, url_prefix='/api/test-results')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'service': 'IPGrok Backend API (Python)'
    }), 200

# Root endpoint
@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        'service': 'IPGrok Backend API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'test_results': '/api/test-results',
            'analytics': '/api/analytics'
        }
    }), 200

# 404 handler
@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Endpoint not found',
        'message': f'The requested endpoint does not exist'
    }), 404

# Global error handler
@app.errorhandler(Exception)
def handle_error(error):
    """Global error handler"""
    app.logger.error(f'Unhandled error: {str(error)}')
    
    if app.config['ENV'] == 'development':
        return jsonify({
            'error': 'Internal server error',
            'message': str(error)
        }), 500
    
    return jsonify({
        'error': 'Internal server error',
        'message': 'Something went wrong'
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    debug = os.getenv('NODE_ENV', 'development') == 'development'
    
    print(f'🚀 IPGrok Backend API (Python) running on port {port}')
    print(f'📊 Health check: http://localhost:{port}/health')
    print(f'🔗 API Base URL: http://localhost:{port}/api')
    
    app.run(host='0.0.0.0', port=port, debug=debug)

