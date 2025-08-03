const { dynamodb, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class TestResult {
  constructor(data) {
    this.testId = data.testId || uuidv4();
    this.timestamp = data.timestamp || new Date().toISOString();
    this.userId = data.userId || 'anonymous';
    this.testType = data.testType; // 'quickTest', 'detailedAnalysis', 'manualTest'
    this.networkData = data.networkData;
    this.mediaData = data.mediaData;
    this.systemData = data.systemData;
    this.advancedTestsData = data.advancedTestsData;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.location = data.location;
    this.deviceInfo = data.deviceInfo;
  }

  // Save test result to DynamoDB
  async save() {
    const params = {
      TableName: TABLES.TEST_RESULTS,
      Item: {
        testId: this.testId,
        timestamp: this.timestamp,
        userId: this.userId,
        testType: this.testType,
        networkData: this.networkData,
        mediaData: this.mediaData,
        systemData: this.systemData,
        advancedTestsData: this.advancedTestsData,
        ipAddress: this.ipAddress,
        userAgent: this.userAgent,
        location: this.location,
        deviceInfo: this.deviceInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    try {
      await dynamodb.put(params).promise();
      return this.testId;
    } catch (error) {
      console.error('Error saving test result:', error);
      throw new Error('Failed to save test result');
    }
  }

  // Get test result by ID
  static async getById(testId) {
    const params = {
      TableName: TABLES.TEST_RESULTS,
      Key: {
        testId: testId
      }
    };

    try {
      const result = await dynamodb.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('Error getting test result:', error);
      throw new Error('Failed to get test result');
    }
  }

  // Get test results by user ID
  static async getByUserId(userId, limit = 50) {
    const params = {
      TableName: TABLES.TEST_RESULTS,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit
    };

    try {
      const result = await dynamodb.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting test results by user:', error);
      throw new Error('Failed to get test results by user');
    }
  }

  // Get test results by type
  static async getByTestType(testType, limit = 50) {
    const params = {
      TableName: TABLES.TEST_RESULTS,
      IndexName: 'TestTypeIndex',
      KeyConditionExpression: 'testType = :testType',
      ExpressionAttributeValues: {
        ':testType': testType
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit
    };

    try {
      const result = await dynamodb.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting test results by type:', error);
      throw new Error('Failed to get test results by type');
    }
  }

  // Get recent test results
  static async getRecent(limit = 20) {
    const params = {
      TableName: TABLES.TEST_RESULTS,
      ScanIndexForward: false, // Most recent first
      Limit: limit
    };

    try {
      const result = await dynamodb.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting recent test results:', error);
      throw new Error('Failed to get recent test results');
    }
  }

  // Delete test result
  static async delete(testId) {
    const params = {
      TableName: TABLES.TEST_RESULTS,
      Key: {
        testId: testId
      }
    };

    try {
      await dynamodb.delete(params).promise();
      return true;
    } catch (error) {
      console.error('Error deleting test result:', error);
      throw new Error('Failed to delete test result');
    }
  }

  // Get test results with filters
  static async getWithFilters(filters = {}, limit = 50) {
    let params = {
      TableName: TABLES.TEST_RESULTS,
      ScanIndexForward: false,
      Limit: limit
    };

    // Build filter expression
    const filterExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (filters.testType) {
      filterExpressions.push('#testType = :testType');
      expressionAttributeNames['#testType'] = 'testType';
      expressionAttributeValues[':testType'] = filters.testType;
    }

    if (filters.userId) {
      filterExpressions.push('#userId = :userId');
      expressionAttributeNames['#userId'] = 'userId';
      expressionAttributeValues[':userId'] = filters.userId;
    }

    if (filters.startDate && filters.endDate) {
      filterExpressions.push('#timestamp BETWEEN :startDate AND :endDate');
      expressionAttributeNames['#timestamp'] = 'timestamp';
      expressionAttributeValues[':startDate'] = filters.startDate;
      expressionAttributeValues[':endDate'] = filters.endDate;
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
      params.ExpressionAttributeValues = expressionAttributeValues;
      params.ExpressionAttributeNames = expressionAttributeNames;
    }

    try {
      const result = await dynamodb.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error getting test results with filters:', error);
      throw new Error('Failed to get test results with filters');
    }
  }
}

module.exports = TestResult; 