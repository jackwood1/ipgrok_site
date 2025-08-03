const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create DynamoDB document client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
const TABLES = {
  TEST_RESULTS: process.env.TEST_RESULTS_TABLE || 'ipgrok-test-results',
  ANALYTICS: process.env.ANALYTICS_TABLE || 'ipgrok-analytics'
};

// Table schemas
const TABLE_SCHEMAS = {
  TEST_RESULTS: {
    TableName: TABLES.TEST_RESULTS,
    KeySchema: [
      { AttributeName: 'testId', KeyType: 'HASH' },  // Partition key
      { AttributeName: 'timestamp', KeyType: 'RANGE' }  // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: 'testId', AttributeType: 'S' },
      { AttributeName: 'timestamp', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'testType', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserIdIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'timestamp', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      },
      {
        IndexName: 'TestTypeIndex',
        KeySchema: [
          { AttributeName: 'testType', KeyType: 'HASH' },
          { AttributeName: 'timestamp', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  ANALYTICS: {
    TableName: TABLES.ANALYTICS,
    KeySchema: [
      { AttributeName: 'metricId', KeyType: 'HASH' },
      { AttributeName: 'date', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'metricId', AttributeType: 'S' },
      { AttributeName: 'date', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

// Create tables if they don't exist
const createTables = async () => {
  const dynamodbService = new AWS.DynamoDB();
  
  for (const [tableName, schema] of Object.entries(TABLE_SCHEMAS)) {
    try {
      await dynamodbService.createTable(schema).promise();
      console.log(`✅ Created table: ${schema.TableName}`);
    } catch (error) {
      if (error.code === 'ResourceInUseException') {
        console.log(`ℹ️  Table already exists: ${schema.TableName}`);
      } else {
        console.error(`❌ Error creating table ${schema.TableName}:`, error.message);
      }
    }
  }
};

module.exports = {
  dynamodb,
  TABLES,
  createTables
}; 