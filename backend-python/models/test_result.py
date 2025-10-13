"""
TestResult Model for DynamoDB operations
"""

from datetime import datetime
from uuid import uuid4
from boto3.dynamodb.conditions import Key
from config.dynamodb import get_table, TABLES

class TestResult:
    """Model for test results"""
    
    def __init__(self, data=None):
        """Initialize test result"""
        data = data or {}
        self.test_id = data.get('testId', str(uuid4()))
        self.timestamp = data.get('timestamp', datetime.utcnow().isoformat() + 'Z')
        self.user_id = data.get('userId', 'anonymous')
        self.test_type = data.get('testType')  # 'quickTest', 'detailedAnalysis', 'manualTest'
        self.network_data = data.get('networkData')
        self.media_data = data.get('mediaData')
        self.system_data = data.get('systemData')
        self.advanced_tests_data = data.get('advancedTestsData')
        self.ip_address = data.get('ipAddress')
        self.user_agent = data.get('userAgent')
        self.location = data.get('location')
        self.device_info = data.get('deviceInfo')
    
    def save(self):
        """Save test result to DynamoDB"""
        table = get_table(TABLES['TEST_RESULTS'])
        
        item = {
            'testId': self.test_id,
            'timestamp': self.timestamp,
            'userId': self.user_id,
            'testType': self.test_type,
            'networkData': self.network_data or {},
            'mediaData': self.media_data or {},
            'systemData': self.system_data or {},
            'advancedTestsData': self.advanced_tests_data or {},
            'ipAddress': self.ip_address,
            'userAgent': self.user_agent,
            'location': self.location or {},
            'deviceInfo': self.device_info or {},
            'createdAt': datetime.utcnow().isoformat() + 'Z',
            'updatedAt': datetime.utcnow().isoformat() + 'Z'
        }
        
        try:
            table.put_item(Item=item)
            return self.test_id
        except Exception as e:
            print(f'Error saving test result: {str(e)}')
            raise Exception('Failed to save test result')
    
    @staticmethod
    def get_by_id(test_id, timestamp=None):
        """Get test result by ID"""
        table = get_table(TABLES['TEST_RESULTS'])
        
        try:
            if timestamp:
                # If timestamp provided, use both keys
                response = table.get_item(Key={'testId': test_id, 'timestamp': timestamp})
            else:
                # Query by testId only (will return all items with this testId)
                response = table.query(
                    KeyConditionExpression=Key('testId').eq(test_id),
                    Limit=1
                )
                return response.get('Items', [{}])[0] if response.get('Items') else None
            
            return response.get('Item')
        except Exception as e:
            print(f'Error getting test result: {str(e)}')
            raise Exception('Failed to get test result')
    
    @staticmethod
    def get_by_user_id(user_id, limit=50):
        """Get test results by user ID"""
        table = get_table(TABLES['TEST_RESULTS'])
        
        try:
            response = table.query(
                IndexName='UserIdIndex',
                KeyConditionExpression=Key('userId').eq(user_id),
                ScanIndexForward=False,  # Most recent first
                Limit=limit
            )
            return response.get('Items', [])
        except Exception as e:
            print(f'Error getting test results by user: {str(e)}')
            raise Exception('Failed to get test results by user')
    
    @staticmethod
    def get_by_test_type(test_type, limit=50):
        """Get test results by type"""
        table = get_table(TABLES['TEST_RESULTS'])
        
        try:
            response = table.query(
                IndexName='TestTypeIndex',
                KeyConditionExpression=Key('testType').eq(test_type),
                ScanIndexForward=False,  # Most recent first
                Limit=limit
            )
            return response.get('Items', [])
        except Exception as e:
            print(f'Error getting test results by type: {str(e)}')
            raise Exception('Failed to get test results by type')
    
    @staticmethod
    def get_recent(limit=20):
        """Get recent test results"""
        table = get_table(TABLES['TEST_RESULTS'])
        
        try:
            response = table.scan(Limit=limit)
            items = response.get('Items', [])
            
            # Sort by timestamp (most recent first)
            items.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            return items[:limit]
        except Exception as e:
            print(f'Error getting recent test results: {str(e)}')
            raise Exception('Failed to get recent test results')
    
    @staticmethod
    def delete(test_id):
        """Delete test result"""
        table = get_table(TABLES['TEST_RESULTS'])
        
        try:
            table.delete_item(Key={'testId': test_id})
            return True
        except Exception as e:
            print(f'Error deleting test result: {str(e)}')
            raise Exception('Failed to delete test result')
    
    @staticmethod
    def get_with_filters(filters=None, limit=50):
        """Get test results with filters"""
        table = get_table(TABLES['TEST_RESULTS'])
        filters = filters or {}
        
        try:
            scan_kwargs = {'Limit': limit}
            
            # Build filter expression
            filter_expressions = []
            expression_attribute_values = {}
            expression_attribute_names = {}
            
            if filters.get('testType'):
                filter_expressions.append('#testType = :testType')
                expression_attribute_names['#testType'] = 'testType'
                expression_attribute_values[':testType'] = filters['testType']
            
            if filters.get('userId'):
                filter_expressions.append('#userId = :userId')
                expression_attribute_names['#userId'] = 'userId'
                expression_attribute_values[':userId'] = filters['userId']
            
            if filters.get('startDate') and filters.get('endDate'):
                filter_expressions.append('#timestamp BETWEEN :startDate AND :endDate')
                expression_attribute_names['#timestamp'] = 'timestamp'
                expression_attribute_values[':startDate'] = filters['startDate']
                expression_attribute_values[':endDate'] = filters['endDate']
            
            if filter_expressions:
                scan_kwargs['FilterExpression'] = ' AND '.join(filter_expressions)
                scan_kwargs['ExpressionAttributeValues'] = expression_attribute_values
                scan_kwargs['ExpressionAttributeNames'] = expression_attribute_names
            
            response = table.scan(**scan_kwargs)
            return response.get('Items', [])
        except Exception as e:
            print(f'Error getting test results with filters: {str(e)}')
            raise Exception('Failed to get test results with filters')

