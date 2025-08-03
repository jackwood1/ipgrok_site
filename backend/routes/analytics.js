const express = require('express');
const Joi = require('joi');
const TestResult = require('../models/TestResult');
const { dynamodb, TABLES } = require('../config/dynamodb');

const router = express.Router();

// Validation schemas
const analyticsQuerySchema = Joi.object({
  startDate: Joi.string().isoDate().optional(),
  endDate: Joi.string().isoDate().optional(),
  testType: Joi.string().valid('quickTest', 'detailedAnalysis', 'manualTest').optional(),
  groupBy: Joi.string().valid('day', 'week', 'month', 'testType', 'location').optional(),
  limit: Joi.number().integer().min(1).max(1000).optional()
});

// GET /api/analytics/performance - Get performance analytics
router.get('/performance', async (req, res, next) => {
  try {
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate, testType, limit = 100 } = value;
    
    // Build filters
    const filters = {};
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    if (testType) {
      filters.testType = testType;
    }

    const results = await TestResult.getWithFilters(filters, limit);

    // Calculate performance metrics
    const performanceData = {
      downloadSpeeds: [],
      uploadSpeeds: [],
      latencies: [],
      connectionQualities: {},
      testTypeDistribution: {},
      timeSeriesData: {},
      summary: {
        totalTests: results.length,
        averageDownloadSpeed: 0,
        averageUploadSpeed: 0,
        averageLatency: 0,
        bestDownloadSpeed: 0,
        bestUploadSpeed: 0,
        lowestLatency: Infinity
      }
    };

    let totalDownload = 0;
    let totalUpload = 0;
    let totalLatency = 0;
    let speedCount = 0;
    let latencyCount = 0;

    results.forEach(result => {
      // Count test types
      performanceData.testTypeDistribution[result.testType] = 
        (performanceData.testTypeDistribution[result.testType] || 0) + 1;

      if (result.networkData && result.networkData.speedTest) {
        const download = parseFloat(result.networkData.speedTest.download);
        const upload = parseFloat(result.networkData.speedTest.upload);
        const latency = result.networkData.speedTest.latency;
        const quality = result.networkData.speedTest.connectionQuality;

        if (!isNaN(download)) {
          performanceData.downloadSpeeds.push(download);
          totalDownload += download;
          speedCount++;
          performanceData.summary.bestDownloadSpeed = Math.max(performanceData.summary.bestDownloadSpeed, download);
        }

        if (!isNaN(upload)) {
          performanceData.uploadSpeeds.push(upload);
          totalUpload += upload;
          performanceData.summary.bestUploadSpeed = Math.max(performanceData.summary.bestUploadSpeed, upload);
        }

        if (latency && !isNaN(latency)) {
          performanceData.latencies.push(latency);
          totalLatency += latency;
          latencyCount++;
          performanceData.summary.lowestLatency = Math.min(performanceData.summary.lowestLatency, latency);
        }

        if (quality) {
          performanceData.connectionQualities[quality] = 
            (performanceData.connectionQualities[quality] || 0) + 1;
        }
      }

      // Time series data
      const testDate = new Date(result.timestamp);
      const dateKey = testDate.toISOString().split('T')[0];
      if (!performanceData.timeSeriesData[dateKey]) {
        performanceData.timeSeriesData[dateKey] = {
          tests: 0,
          avgDownload: 0,
          avgUpload: 0,
          avgLatency: 0
        };
      }
      performanceData.timeSeriesData[dateKey].tests++;
    });

    // Calculate averages
    if (speedCount > 0) {
      performanceData.summary.averageDownloadSpeed = (totalDownload / speedCount).toFixed(2);
      performanceData.summary.averageUploadSpeed = (totalUpload / speedCount).toFixed(2);
    }
    if (latencyCount > 0) {
      performanceData.summary.averageLatency = (totalLatency / latencyCount).toFixed(2);
    }

    // Sort time series data
    performanceData.timeSeriesData = Object.entries(performanceData.timeSeriesData)
      .sort(([a], [b]) => a.localeCompare(b))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    res.json({
      success: true,
      data: performanceData
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/trends - Get trend analysis
router.get('/trends', async (req, res, next) => {
  try {
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate, limit = 200 } = value;
    
    const filters = {};
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const results = await TestResult.getWithFilters(filters, limit);

    // Group by time periods
    const trends = {
      daily: {},
      weekly: {},
      monthly: {},
      testTypeTrends: {},
      performanceTrends: {
        download: {},
        upload: {},
        latency: {}
      }
    };

    results.forEach(result => {
      const testDate = new Date(result.timestamp);
      const dayKey = testDate.toISOString().split('T')[0];
      const weekKey = getWeekKey(testDate);
      const monthKey = testDate.toISOString().slice(0, 7); // YYYY-MM

      // Daily trends
      if (!trends.daily[dayKey]) {
        trends.daily[dayKey] = {
          tests: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      trends.daily[dayKey].tests++;

      // Weekly trends
      if (!trends.weekly[weekKey]) {
        trends.weekly[weekKey] = {
          tests: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      trends.weekly[weekKey].tests++;

      // Monthly trends
      if (!trends.monthly[monthKey]) {
        trends.monthly[monthKey] = {
          tests: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      trends.monthly[monthKey].tests++;

      // Test type trends
      if (!trends.testTypeTrends[result.testType]) {
        trends.testTypeTrends[result.testType] = {
          daily: {},
          weekly: {},
          monthly: {}
        };
      }
      trends.testTypeTrends[result.testType].daily[dayKey] = 
        (trends.testTypeTrends[result.testType].daily[dayKey] || 0) + 1;

      // Performance data
      if (result.networkData && result.networkData.speedTest) {
        const download = parseFloat(result.networkData.speedTest.download);
        const upload = parseFloat(result.networkData.speedTest.upload);
        const latency = result.networkData.speedTest.latency;

        if (!isNaN(download)) {
          trends.daily[dayKey].downloadSpeeds.push(download);
          trends.weekly[weekKey].downloadSpeeds.push(download);
          trends.monthly[monthKey].downloadSpeeds.push(download);
        }

        if (!isNaN(upload)) {
          trends.daily[dayKey].uploadSpeeds.push(upload);
          trends.weekly[weekKey].uploadSpeeds.push(upload);
          trends.monthly[monthKey].uploadSpeeds.push(upload);
        }

        if (latency && !isNaN(latency)) {
          trends.daily[dayKey].latencies.push(latency);
          trends.weekly[weekKey].latencies.push(latency);
          trends.monthly[monthKey].latencies.push(latency);
        }
      }
    });

    // Calculate averages for each period
    Object.keys(trends.daily).forEach(day => {
      const dayData = trends.daily[day];
      dayData.avgDownload = dayData.downloadSpeeds.length > 0 
        ? (dayData.downloadSpeeds.reduce((a, b) => a + b, 0) / dayData.downloadSpeeds.length).toFixed(2)
        : 0;
      dayData.avgUpload = dayData.uploadSpeeds.length > 0
        ? (dayData.uploadSpeeds.reduce((a, b) => a + b, 0) / dayData.uploadSpeeds.length).toFixed(2)
        : 0;
      dayData.avgLatency = dayData.latencies.length > 0
        ? (dayData.latencies.reduce((a, b) => a + b, 0) / dayData.latencies.length).toFixed(2)
        : 0;
    });

    res.json({
      success: true,
      data: trends
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/comparison - Compare performance across different criteria
router.get('/comparison', async (req, res, next) => {
  try {
    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const { startDate, endDate, limit = 500 } = value;
    
    const filters = {};
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const results = await TestResult.getWithFilters(filters, limit);

    const comparison = {
      testTypes: {},
      timeOfDay: {},
      dayOfWeek: {},
      locations: {},
      devices: {}
    };

    results.forEach(result => {
      const testDate = new Date(result.timestamp);
      const hour = testDate.getHours();
      const dayOfWeek = testDate.toDayString();
      const location = result.ipAddress || 'Unknown';
      const device = result.userAgent ? getDeviceType(result.userAgent) : 'Unknown';

      // Test type comparison
      if (!comparison.testTypes[result.testType]) {
        comparison.testTypes[result.testType] = {
          count: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      comparison.testTypes[result.testType].count++;

      // Time of day comparison
      const timeSlot = getTimeSlot(hour);
      if (!comparison.timeOfDay[timeSlot]) {
        comparison.timeOfDay[timeSlot] = {
          count: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      comparison.timeOfDay[timeSlot].count++;

      // Day of week comparison
      if (!comparison.dayOfWeek[dayOfWeek]) {
        comparison.dayOfWeek[dayOfWeek] = {
          count: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      comparison.dayOfWeek[dayOfWeek].count++;

      // Location comparison
      if (!comparison.locations[location]) {
        comparison.locations[location] = {
          count: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      comparison.locations[location].count++;

      // Device comparison
      if (!comparison.devices[device]) {
        comparison.devices[device] = {
          count: 0,
          downloadSpeeds: [],
          uploadSpeeds: [],
          latencies: []
        };
      }
      comparison.devices[device].count++;

      // Add performance data
      if (result.networkData && result.networkData.speedTest) {
        const download = parseFloat(result.networkData.speedTest.download);
        const upload = parseFloat(result.networkData.speedTest.upload);
        const latency = result.networkData.speedTest.latency;

        if (!isNaN(download)) {
          comparison.testTypes[result.testType].downloadSpeeds.push(download);
          comparison.timeOfDay[timeSlot].downloadSpeeds.push(download);
          comparison.dayOfWeek[dayOfWeek].downloadSpeeds.push(download);
          comparison.locations[location].downloadSpeeds.push(download);
          comparison.devices[device].downloadSpeeds.push(download);
        }

        if (!isNaN(upload)) {
          comparison.testTypes[result.testType].uploadSpeeds.push(upload);
          comparison.timeOfDay[timeSlot].uploadSpeeds.push(upload);
          comparison.dayOfWeek[dayOfWeek].uploadSpeeds.push(upload);
          comparison.locations[location].uploadSpeeds.push(upload);
          comparison.devices[device].uploadSpeeds.push(upload);
        }

        if (latency && !isNaN(latency)) {
          comparison.testTypes[result.testType].latencies.push(latency);
          comparison.timeOfDay[timeSlot].latencies.push(latency);
          comparison.dayOfWeek[dayOfWeek].latencies.push(latency);
          comparison.locations[location].latencies.push(latency);
          comparison.devices[device].latencies.push(latency);
        }
      }
    });

    // Calculate averages for each category
    Object.keys(comparison).forEach(category => {
      Object.keys(comparison[category]).forEach(key => {
        const data = comparison[category][key];
        data.avgDownload = data.downloadSpeeds.length > 0
          ? (data.downloadSpeeds.reduce((a, b) => a + b, 0) / data.downloadSpeeds.length).toFixed(2)
          : 0;
        data.avgUpload = data.uploadSpeeds.length > 0
          ? (data.uploadSpeeds.reduce((a, b) => a + b, 0) / data.uploadSpeeds.length).toFixed(2)
          : 0;
        data.avgLatency = data.latencies.length > 0
          ? (data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length).toFixed(2)
          : 0;
      });
    });

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    next(error);
  }
});

// Helper functions
function getWeekKey(date) {
  const year = date.getFullYear();
  const week = Math.ceil((date.getDate() + date.getDay()) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getTimeSlot(hour) {
  if (hour >= 6 && hour < 12) return 'Morning (6-12)';
  if (hour >= 12 && hour < 18) return 'Afternoon (12-18)';
  if (hour >= 18 && hour < 24) return 'Evening (18-24)';
  return 'Night (0-6)';
}

function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

module.exports = router; 