"""
DynamoDB Configuration
"""

import boto3
from botocore.exceptions import ClientError
import os

# DynamoDB client
dynamodb = None
dynamodb_resource = None

# Table names
TABLES = {
    'TEST_RESULTS': os.getenv('TEST_RESULTS_TABLE', 'ipgrok-test-results'),
    'ANALYTICS': os.getenv('ANALYTICS_TABLE', 'ipgrok-analytics')
}

def init_dynamodb():
    """Initialize DynamoDB client and resource"""
    global dynamodb, dynamodb_resource
    
    # Configure AWS
    aws_config = {
        'region_name': os.getenv('AWS_REGION', 'us-east-2')
    }
    
    # Add credentials if provided
    if os.getenv('AWS_ACCESS_KEY_ID'):
        aws_config['aws_access_key_id'] = os.getenv('AWS_ACCESS_KEY_ID')
    if os.getenv('AWS_SECRET_ACCESS_KEY'):
        aws_config['aws_secret_access_key'] = os.getenv('AWS_SECRET_ACCESS_KEY')
    
    dynamodb = boto3.client('dynamodb', **aws_config)
    dynamodb_resource = boto3.resource('dynamodb', **aws_config)
    
    print(f"✅ DynamoDB initialized in region: {aws_config['region_name']}")
    return dynamodb, dynamodb_resource

def get_table(table_name):
    """Get a DynamoDB table resource"""
    if dynamodb_resource is None:
        init_dynamodb()
    return dynamodb_resource.Table(table_name)

# Table schemas for creation
TABLE_SCHEMAS = {
    'TEST_RESULTS': {
        'TableName': TABLES['TEST_RESULTS'],
        'KeySchema': [
            {'AttributeName': 'testId', 'KeyType': 'HASH'},  # Partition key
            {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}  # Sort key
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'testId', 'AttributeType': 'S'},
            {'AttributeName': 'timestamp', 'AttributeType': 'S'},
            {'AttributeName': 'userId', 'AttributeType': 'S'},
            {'AttributeName': 'testType', 'AttributeType': 'S'}
        ],
        'GlobalSecondaryIndexes': [
            {
                'IndexName': 'UserIdIndex',
                'KeySchema': [
                    {'AttributeName': 'userId', 'KeyType': 'HASH'},
                    {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
                ],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            },
            {
                'IndexName': 'TestTypeIndex',
                'KeySchema': [
                    {'AttributeName': 'testType', 'KeyType': 'HASH'},
                    {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
                ],
                'Projection': {'ProjectionType': 'ALL'},
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            }
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    },
    'ANALYTICS': {
        'TableName': TABLES['ANALYTICS'],
        'KeySchema': [
            {'AttributeName': 'metricId', 'KeyType': 'HASH'},
            {'AttributeName': 'date', 'KeyType': 'RANGE'}
        ],
        'AttributeDefinitions': [
            {'AttributeName': 'metricId', 'AttributeType': 'S'},
            {'AttributeName': 'date', 'AttributeType': 'S'}
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    }
}

def create_tables():
    """Create DynamoDB tables if they don't exist"""
    if dynamodb is None:
        init_dynamodb()
    
    for table_name, schema in TABLE_SCHEMAS.items():
        try:
            dynamodb.create_table(**schema)
            print(f"✅ Created table: {schema['TableName']}")
            
            # Wait for table to be created
            waiter = dynamodb.get_waiter('table_exists')
            waiter.wait(TableName=schema['TableName'])
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'ResourceInUseException':
                print(f"ℹ️  Table already exists: {schema['TableName']}")
            else:
                print(f"❌ Error creating table {schema['TableName']}: {str(e)}")
                raise

if __name__ == '__main__':
    """Run this file directly to create tables"""
    from dotenv import load_dotenv
    load_dotenv()
    
    print('🚀 Setting up DynamoDB tables...')
    create_tables()
    print('✅ DynamoDB tables setup completed!')

