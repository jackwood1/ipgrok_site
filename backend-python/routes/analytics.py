"""
Analytics API Routes
"""

from flask import Blueprint, jsonify, request
from models.test_result import TestResult
from datetime import datetime, timedelta
from collections import defaultdict

analytics_bp = Blueprint('analytics', __name__)

# GET /api/analytics/performance - Get performance analytics
@analytics_bp.route('/performance', methods=['GET'])
def get_performance_analytics():
    """Get performance analytics"""
    try:
        # Get filters from query params
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        test_type = request.args.get('testType')
        limit = int(request.args.get('limit', 100))
        
        # Build filters
        filters = {}
        if start_date and end_date:
            filters['startDate'] = start_date
            filters['endDate'] = end_date
        if test_type:
            filters['testType'] = test_type
        
        results = TestResult.get_with_filters(filters, limit)
        
        # Calculate performance metrics
        performance_data = {
            'downloadSpeeds': [],
            'uploadSpeeds': [],
            'latencies': [],
            'connectionQualities': {},
            'testTypeDistribution': {},
            'timeSeriesData': {},
            'summary': {
                'totalTests': len(results),
                'averageDownloadSpeed': 0,
                'averageUploadSpeed': 0,
                'averageLatency': 0,
                'bestDownloadSpeed': 0,
                'bestUploadSpeed': 0,
                'lowestLatency': float('inf')
            }
        }
        
        total_download = 0
        total_upload = 0
        total_latency = 0
        speed_count = 0
        latency_count = 0
        
        for result in results:
            # Count test types
            test_type = result.get('testType')
            performance_data['testTypeDistribution'][test_type] = \
                performance_data['testTypeDistribution'].get(test_type, 0) + 1
            
            network_data = result.get('networkData', {})
            speed_test = network_data.get('speedTest', {})
            
            download = float(speed_test.get('download', 0))
            upload = float(speed_test.get('upload', 0))
            latency = speed_test.get('latency')
            quality = speed_test.get('connectionQuality')
            
            if download:
                performance_data['downloadSpeeds'].append(download)
                total_download += download
                speed_count += 1
                performance_data['summary']['bestDownloadSpeed'] = max(
                    performance_data['summary']['bestDownloadSpeed'], download
                )
            
            if upload:
                performance_data['uploadSpeeds'].append(upload)
                total_upload += upload
                performance_data['summary']['bestUploadSpeed'] = max(
                    performance_data['summary']['bestUploadSpeed'], upload
                )
            
            if latency:
                performance_data['latencies'].append(latency)
                total_latency += latency
                latency_count += 1
                performance_data['summary']['lowestLatency'] = min(
                    performance_data['summary']['lowestLatency'], latency
                )
            
            if quality:
                performance_data['connectionQualities'][quality] = \
                    performance_data['connectionQualities'].get(quality, 0) + 1
            
            # Time series data
            timestamp = result.get('timestamp', '')
            if timestamp:
                date_key = timestamp.split('T')[0]
                if date_key not in performance_data['timeSeriesData']:
                    performance_data['timeSeriesData'][date_key] = {
                        'tests': 0,
                        'avgDownload': 0,
                        'avgUpload': 0,
                        'avgLatency': 0
                    }
                performance_data['timeSeriesData'][date_key]['tests'] += 1
        
        # Calculate averages
        if speed_count > 0:
            performance_data['summary']['averageDownloadSpeed'] = round(total_download / speed_count, 2)
            performance_data['summary']['averageUploadSpeed'] = round(total_upload / speed_count, 2)
        if latency_count > 0:
            performance_data['summary']['averageLatency'] = round(total_latency / latency_count, 2)
        
        return jsonify({
            'success': True,
            'data': performance_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/analytics/trends - Get trend analysis
@analytics_bp.route('/trends', methods=['GET'])
def get_trend_analytics():
    """Get trend analysis"""
    try:
        limit = int(request.args.get('limit', 200))
        results = TestResult.get_recent(limit)
        
        trends = {
            'daily': defaultdict(lambda: {'tests': 0, 'downloadSpeeds': [], 'uploadSpeeds': [], 'latencies': []}),
            'testTypeTrends': defaultdict(lambda: {'daily': defaultdict(int)})
        }
        
        for result in results:
            timestamp = result.get('timestamp', '')
            if not timestamp:
                continue
            
            date_key = timestamp.split('T')[0]
            test_type = result.get('testType')
            
            # Daily trends
            trends['daily'][date_key]['tests'] += 1
            
            # Test type trends
            trends['testTypeTrends'][test_type]['daily'][date_key] += 1
            
            # Performance data
            network_data = result.get('networkData', {})
            speed_test = network_data.get('speedTest', {})
            
            if speed_test.get('download'):
                trends['daily'][date_key]['downloadSpeeds'].append(float(speed_test['download']))
            if speed_test.get('upload'):
                trends['daily'][date_key]['uploadSpeeds'].append(float(speed_test['upload']))
            if speed_test.get('latency'):
                trends['daily'][date_key]['latencies'].append(speed_test['latency'])
        
        # Convert defaultdicts to regular dicts
        trends['daily'] = dict(trends['daily'])
        trends['testTypeTrends'] = {k: {'daily': dict(v['daily'])} for k, v in trends['testTypeTrends'].items()}
        
        return jsonify({
            'success': True,
            'data': trends
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

# GET /api/analytics/comparison - Compare performance across different criteria
@analytics_bp.route('/comparison', methods=['GET'])
def get_comparison_analytics():
    """Compare performance across different criteria"""
    try:
        limit = int(request.args.get('limit', 500))
        results = TestResult.get_recent(limit)
        
        comparison = {
            'testTypes': defaultdict(lambda: {'count': 0, 'downloadSpeeds': [], 'uploadSpeeds': [], 'latencies': []}),
            'timeOfDay': defaultdict(lambda: {'count': 0, 'downloadSpeeds': [], 'uploadSpeeds': [], 'latencies': []}),
            'dayOfWeek': defaultdict(lambda: {'count': 0, 'downloadSpeeds': [], 'uploadSpeeds': [], 'latencies': []})
        }
        
        for result in results:
            test_type = result.get('testType')
            timestamp = result.get('timestamp', '')
            
            if timestamp:
                try:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    hour = dt.hour
                    day_of_week = dt.strftime('%A')
                    
                    # Determine time slot
                    if 6 <= hour < 12:
                        time_slot = 'Morning (6-12)'
                    elif 12 <= hour < 18:
                        time_slot = 'Afternoon (12-18)'
                    elif 18 <= hour < 24:
                        time_slot = 'Evening (18-24)'
                    else:
                        time_slot = 'Night (0-6)'
                    
                    # Increment counts
                    comparison['testTypes'][test_type]['count'] += 1
                    comparison['timeOfDay'][time_slot]['count'] += 1
                    comparison['dayOfWeek'][day_of_week]['count'] += 1
                    
                    # Add performance data
                    network_data = result.get('networkData', {})
                    speed_test = network_data.get('speedTest', {})
                    
                    if speed_test.get('download'):
                        download = float(speed_test['download'])
                        comparison['testTypes'][test_type]['downloadSpeeds'].append(download)
                        comparison['timeOfDay'][time_slot]['downloadSpeeds'].append(download)
                        comparison['dayOfWeek'][day_of_week]['downloadSpeeds'].append(download)
                    
                    if speed_test.get('upload'):
                        upload = float(speed_test['upload'])
                        comparison['testTypes'][test_type]['uploadSpeeds'].append(upload)
                        comparison['timeOfDay'][time_slot]['uploadSpeeds'].append(upload)
                        comparison['dayOfWeek'][day_of_week]['uploadSpeeds'].append(upload)
                    
                    if speed_test.get('latency'):
                        latency = speed_test['latency']
                        comparison['testTypes'][test_type]['latencies'].append(latency)
                        comparison['timeOfDay'][time_slot]['latencies'].append(latency)
                        comparison['dayOfWeek'][day_of_week]['latencies'].append(latency)
                except:
                    pass
        
        # Calculate averages for each category
        for category in comparison:
            for key in comparison[category]:
                data = comparison[category][key]
                data['avgDownload'] = round(sum(data['downloadSpeeds']) / len(data['downloadSpeeds']), 2) if data['downloadSpeeds'] else 0
                data['avgUpload'] = round(sum(data['uploadSpeeds']) / len(data['uploadSpeeds']), 2) if data['uploadSpeeds'] else 0
                data['avgLatency'] = round(sum(data['latencies']) / len(data['latencies']), 2) if data['latencies'] else 0
        
        # Convert defaultdicts to regular dicts
        comparison = {k: dict(v) for k, v in comparison.items()}
        
        return jsonify({
            'success': True,
            'data': comparison
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

