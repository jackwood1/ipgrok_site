const express = require('express');
const Joi = require('joi');
const TestResult = require('../models/TestResult');

const router = express.Router();

// Validation schemas
const testResultSchema = Joi.object({
  testType: Joi.string().valid('quickTest', 'detailedAnalysis', 'manualTest').required(),
  networkData: Joi.object().optional(),
  mediaData: Joi.object().optional(),
  systemData: Joi.object().optional(),
  advancedTestsData: Joi.object().optional(),
  userId: Joi.string().optional(),
  ipAddress: Joi.string().optional(),
  userAgent: Joi.string().optional(),
  location: Joi.object().optional(),
  deviceInfo: Joi.object().optional()
});

const filterSchema = Joi.object({
  testType: Joi.string().valid('quickTest', 'detailedAnalysis', 'manualTest').optional(),
  userId: Joi.string().optional(),
  startDate: Joi.string().isoDate().optional(),
  endDate: Joi.string().isoDate().optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

// POST /api/test-results - Create new test result
router.post('/', async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = testResultSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Extract client information
    const clientInfo = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      location: req.body.location || null
    };

    // Create test result
    const testResult = new TestResult({
      ...value,
      ...clientInfo
    });

    // Save to database
    const testId = await testResult.save();

    res.status(201).json({
      success: true,
      testId: testId,
      message: 'Test result saved successfully'
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/test-results - Get test results with optional filters
router.get('/', async (req, res, next) => {
  try {
    // Validate query parameters
    const { error, value } = filterSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { limit = 50, ...filters } = value;
    const results = await TestResult.getWithFilters(filters, parseInt(limit));

    res.json({
      success: true,
      count: results.length,
      results: results
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/test-results/recent - Get recent test results
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const results = await TestResult.getRecent(limit);

    res.json({
      success: true,
      count: results.length,
      results: results
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/test-results/user/:userId - Get test results by user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const results = await TestResult.getByUserId(userId, limit);

    res.json({
      success: true,
      userId: userId,
      count: results.length,
      results: results
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/test-results/type/:testType - Get test results by type
router.get('/type/:testType', async (req, res, next) => {
  try {
    const { testType } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const results = await TestResult.getByTestType(testType, limit);

    res.json({
      success: true,
      testType: testType,
      count: results.length,
      results: results
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/test-results/:testId - Get specific test result
router.get('/:testId', async (req, res, next) => {
  try {
    const { testId } = req.params;
    const result = await TestResult.getById(testId);

    if (!result) {
      return res.status(404).json({
        error: 'Test result not found',
        message: `No test result found with ID: ${testId}`
      });
    }

    res.json({
      success: true,
      result: result
    });

  } catch (error) {
    next(error);
  }
});

// DELETE /api/test-results/:testId - Delete test result
router.delete('/:testId', async (req, res, next) => {
  try {
    const { testId } = req.params;
    await TestResult.delete(testId);

    res.json({
      success: true,
      message: 'Test result deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/test-results/stats/summary - Get test statistics summary
router.get('/stats/summary', async (req, res, next) => {
  try {
    const recentResults = await TestResult.getRecent(100);
    
    // Calculate statistics
    const stats = {
      totalTests: recentResults.length,
      testTypes: {},
      averageDownloadSpeed: 0,
      averageUploadSpeed: 0,
      averageLatency: 0,
      topLocations: {},
      recentActivity: {}
    };

    let totalDownload = 0;
    let totalUpload = 0;
    let totalLatency = 0;
    let speedCount = 0;
    let latencyCount = 0;

    recentResults.forEach(result => {
      // Count test types
      stats.testTypes[result.testType] = (stats.testTypes[result.testType] || 0) + 1;

      // Calculate speed averages
      if (result.networkData && result.networkData.speedTest) {
        const download = parseFloat(result.networkData.speedTest.download);
        const upload = parseFloat(result.networkData.speedTest.upload);
        const latency = result.networkData.speedTest.latency;

        if (!isNaN(download)) {
          totalDownload += download;
          speedCount++;
        }
        if (!isNaN(upload)) {
          totalUpload += upload;
        }
        if (latency && !isNaN(latency)) {
          totalLatency += latency;
          latencyCount++;
        }
      }

      // Count locations
      if (result.ipAddress) {
        stats.topLocations[result.ipAddress] = (stats.topLocations[result.ipAddress] || 0) + 1;
      }

      // Recent activity (last 7 days)
      const testDate = new Date(result.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      if (testDate > weekAgo) {
        const dateKey = testDate.toISOString().split('T')[0];
        stats.recentActivity[dateKey] = (stats.recentActivity[dateKey] || 0) + 1;
      }
    });

    // Calculate averages
    if (speedCount > 0) {
      stats.averageDownloadSpeed = (totalDownload / speedCount).toFixed(2);
      stats.averageUploadSpeed = (totalUpload / speedCount).toFixed(2);
    }
    if (latencyCount > 0) {
      stats.averageLatency = (totalLatency / latencyCount).toFixed(2);
    }

    // Sort top locations
    stats.topLocations = Object.entries(stats.topLocations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 