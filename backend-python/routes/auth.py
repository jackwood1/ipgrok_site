"""
Authentication API Routes
"""

from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
import os
from datetime import datetime, timedelta
import hashlib

auth_bp = Blueprint('auth', __name__)

# Admin credentials (in production, use environment variables and hashed passwords)
ADMIN_USERS = {
    'admin': hashlib.sha256(os.getenv('ADMIN_PASSWORD', 'changeme').encode()).hexdigest(),
    # Add more admin users here
}

JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_EXPIRY_HOURS = 24

def hash_password(password):
    """Hash a password"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({
                'error': 'Authentication required',
                'message': 'No token provided'
            }), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({
                'error': 'Authentication failed',
                'message': 'Invalid or expired token'
            }), 401
        
        # Add user info to request
        request.user = payload
        return f(*args, **kwargs)
    
    return decorated_function

# POST /api/auth/login - Admin login
@auth_bp.route('/login', methods=['POST'])
def login():
    """Admin login endpoint"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'message': 'Username and password required'
            }), 400
        
        # Check credentials
        password_hash = hash_password(password)
        
        if username in ADMIN_USERS and ADMIN_USERS[username] == password_hash:
            # Generate JWT token
            payload = {
                'username': username,
                'role': 'admin',
                'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRY_HOURS)
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
            
            return jsonify({
                'success': True,
                'token': token,
                'username': username,
                'expiresIn': JWT_EXPIRY_HOURS * 3600  # seconds
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# POST /api/auth/verify - Verify token
@auth_bp.route('/verify', methods=['POST'])
def verify():
    """Verify JWT token"""
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({
                'valid': False,
                'message': 'No token provided'
            }), 401
        
        payload = verify_token(token)
        
        if payload:
            return jsonify({
                'valid': True,
                'username': payload.get('username'),
                'role': payload.get('role')
            }), 200
        else:
            return jsonify({
                'valid': False,
                'message': 'Invalid or expired token'
            }), 401
            
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# POST /api/auth/logout - Logout (client-side token deletion)
@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout endpoint (token invalidation happens client-side)"""
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200

# GET /api/auth/me - Get current user info
@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user"""
    return jsonify({
        'success': True,
        'user': {
            'username': request.user.get('username'),
            'role': request.user.get('role')
        }
    }), 200

