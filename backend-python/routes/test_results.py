"""
Test Results API Routes
"""

from flask import Blueprint, jsonify, request
from marshmallow import Schema, fields, ValidationError, validate
from models.test_result import TestResult
from datetime import datetime

test_results_bp = Blueprint('test_results', __name__)

# Validation schemas
class TestResultSchema(Schema):
    """Schema for validating test result input"""
    testType = fields.Str(required=True, validate=validate.OneOf(['quickTest', 'detailedAnalysis', 'manualTest']))
    networkData = fields.Dict(required=False)
    mediaData = fields.Dict(required=False)
    systemData = fields.Dict(required=False)
    advancedTestsData = fields.Dict(required=False)
    userId = fields.Str(required=False)
    ipAddress = fields.Str(required=False)
    userAgent = fields.Str(required=False)
    location = fields.Dict(required=False)
    deviceInfo = fields.Dict(required=False)

class FilterSchema(Schema):
    """Schema for validating filter parameters"""
    testType = fields.Str(required=False, validate=validate.OneOf(['quickTest', 'detailedAnalysis', 'manualTest']))
    userId = fields.Str(required=False)
    startDate = fields.DateTime(required=False)
    endDate = fields.DateTime(required=False)
    limit = fields.Int(required=False, validate=validate.Range(min=1, max=100))

# POST /api/test-results - Create new test result
@test_results_bp.route('', methods=['POST'])
def create_test_result():
    """Create a new test result"""
    try:
        # Validate request body
        schema = TestResultSchema()
        data = schema.load(request.json)
        
        # Extract client information
        client_info = {
            'ipAddress': request.remote_addr,
            'userAgent': request.headers.get('User-Agent'),
            'location': data.get('location')
        }
        
        # Merge client info with provided data
        data.update(client_info)
        
        # Create and save test result
        test_result = TestResult(data)
        test_id = test_result.save()
        
        return jsonify({
            'success': True,
            'testId': test_id,
            'message': 'Test result saved successfully'
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/test-results - Get test results with optional filters
@test_results_bp.route('', methods=['GET'])
def get_test_results():
    """Get test results with optional filters"""
    try:
        # Validate query parameters
        schema = FilterSchema()
        filters = schema.load(request.args)
        
        limit = int(filters.get('limit', 50))
        del filters['limit'] if 'limit' in filters else None
        
        # Get results
        results = TestResult.get_with_filters(filters, limit)
        
        return jsonify({
            'success': True,
            'count': len(results),
            'results': results
        }), 200
        
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': e.messages
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/test-results/recent - Get recent test results
@test_results_bp.route('/recent', methods=['GET'])
def get_recent_test_results():
    """Get recent test results"""
    try:
        limit = int(request.args.get('limit', 20))
        results = TestResult.get_recent(limit)
        
        return jsonify({
            'success': True,
            'count': len(results),
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/test-results/user/<userId> - Get test results by user
@test_results_bp.route('/user/<user_id>', methods=['GET'])
def get_test_results_by_user(user_id):
    """Get test results by user"""
    try:
        limit = int(request.args.get('limit', 50))
        results = TestResult.get_by_user_id(user_id, limit)
        
        return jsonify({
            'success': True,
            'userId': user_id,
            'count': len(results),
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/test-results/type/<testType> - Get test results by type
@test_results_bp.route('/type/<test_type>', methods=['GET'])
def get_test_results_by_type(test_type):
    """Get test results by type"""
    try:
        limit = int(request.args.get('limit', 50))
        results = TestResult.get_by_test_type(test_type, limit)
        
        return jsonify({
            'success': True,
            'testType': test_type,
            'count': len(results),
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/test-results/<testId> - Get specific test result
@test_results_bp.route('/<test_id>', methods=['GET'])
def get_test_result(test_id):
    """Get a specific test result"""
    try:
        result = TestResult.get_by_id(test_id)
        
        if not result:
            return jsonify({
                'error': 'Test result not found',
                'message': f'No test result found with ID: {test_id}'
            }), 404
        
        return jsonify({
            'success': True,
            'result': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# DELETE /api/test-results/<testId> - Delete test result
@test_results_bp.route('/<test_id>', methods=['DELETE'])
def delete_test_result(test_id):
    """Delete a test result"""
    try:
        TestResult.delete(test_id)
        
        return jsonify({
            'success': True,
            'message': 'Test result deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/test-results/stats/summary - Get test statistics summary
@test_results_bp.route('/stats/summary', methods=['GET'])
def get_test_statistics():
    """Get test statistics summary"""
    try:
        recent_results = TestResult.get_recent(100)
        
        # Calculate statistics
        stats = {
            'totalTests': len(recent_results),
            'testTypes': {},
            'averageDownloadSpeed': 0,
            'averageUploadSpeed': 0,
            'averageLatency': 0,
            'topLocations': {},
            'recentActivity': {}
        }
        
        total_download = 0
        total_upload = 0
        total_latency = 0
        speed_count = 0
        latency_count = 0
        
        for result in recent_results:
            # Count test types
            test_type = result.get('testType')
            stats['testTypes'][test_type] = stats['testTypes'].get(test_type, 0) + 1
            
            # Calculate speed averages
            network_data = result.get('networkData', {})
            if network_data.get('speedTest'):
                speed_test = network_data['speedTest']
                download = float(speed_test.get('download', 0))
                upload = float(speed_test.get('upload', 0))
                latency = speed_test.get('latency')
                
                if download:
                    total_download += download
                    speed_count += 1
                if upload:
                    total_upload += upload
                if latency:
                    total_latency += latency
                    latency_count += 1
            
            # Count locations
            ip_address = result.get('ipAddress')
            if ip_address:
                stats['topLocations'][ip_address] = stats['topLocations'].get(ip_address, 0) + 1
            
            # Recent activity (last 7 days)
            timestamp = result.get('timestamp', '')
            if timestamp:
                try:
                    test_date = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    date_key = test_date.strftime('%Y-%m-%d')
                    stats['recentActivity'][date_key] = stats['recentActivity'].get(date_key, 0) + 1
                except:
                    pass
        
        # Calculate averages
        if speed_count > 0:
            stats['averageDownloadSpeed'] = round(total_download / speed_count, 2)
            stats['averageUploadSpeed'] = round(total_upload / speed_count, 2)
        if latency_count > 0:
            stats['averageLatency'] = round(total_latency / latency_count, 2)
        
        # Sort top locations
        stats['topLocations'] = dict(sorted(
            stats['topLocations'].items(),
            key=lambda x: x[1],
            reverse=True
        )[:10])
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

