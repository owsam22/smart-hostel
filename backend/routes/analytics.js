import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import Issue from '../models/Issue.js';
import LostFound from '../models/LostFound.js';
import User from '../models/User.js';

const router = express.Router();

// Get comprehensive analytics (management only)
router.get('/dashboard', authenticateToken, authorizeRoles('management'), async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    // Calculate date range based on timeframe
    const now = new Date();
    let startDate;
    
    switch (timeframe) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Basic stats
    const totalIssues = await Issue.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    const resolvedIssues = await Issue.countDocuments({
      status: 'resolved',
      createdAt: { $gte: startDate }
    });
    
    const pendingIssues = await Issue.countDocuments({
      status: { $in: ['reported', 'assigned', 'in_progress'] },
      createdAt: { $gte: startDate }
    });

    // Average resolution time (in hours)
    const resolvedIssuesWithData = await Issue.find({
      status: 'resolved',
      createdAt: { $gte: startDate }
    }).select('createdAt updatedAt');

    let totalResolutionTime = 0;
    let resolvedCount = 0;
    
    resolvedIssuesWithData.forEach(issue => {
      const resolutionTime = (new Date(issue.updatedAt) - new Date(issue.createdAt)) / (1000 * 60 * 60);
      totalResolutionTime += resolutionTime;
      resolvedCount++;
    });

    const averageResolutionTime = resolvedCount > 0 ? Math.round(totalResolutionTime / resolvedCount) : 0;

    // Category breakdown
    const categoryBreakdown = await Issue.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Priority breakdown
    const priorityBreakdown = await Issue.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Hostel breakdown
    const hostelBreakdown = await Issue.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$hostel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly trends (last 6 months)
    const monthlyTrends = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          reported: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          month: {
            $let: {
              vars: {
                months: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: { $arrayElemAt: ['$$months', { $subtract: ['$_id.month', 1] }] }
            }
          },
          reported: 1,
          resolved: 1
        }
      }
    ]);

    // Resolution rate
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    // Peak reporting hours
    const peakHours = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // Lost & Found stats
    const lostItems = await LostFound.countDocuments({
      type: 'lost',
      createdAt: { $gte: startDate }
    });

    const foundItems = await LostFound.countDocuments({
      type: 'found',
      createdAt: { $gte: startDate }
    });

    const claimedItems = await LostFound.countDocuments({
      status: 'claimed',
      createdAt: { $gte: startDate }
    });

    // User stats
    const totalUsers = await User.countDocuments({ isActive: true });
    const studentUsers = await User.countDocuments({ role: 'student', isActive: true });
    const managementUsers = await User.countDocuments({ role: 'management', isActive: true });

    res.json({
      totalIssues,
      resolvedIssues,
      pendingIssues,
      averageResolutionTime,
      resolutionRate,
      categoryBreakdown: categoryBreakdown.map(item => ({ category: item._id, count: item.count })),
      priorityBreakdown: priorityBreakdown.map(item => ({ priority: item._id, count: item.count })),
      hostelBreakdown: hostelBreakdown.map(item => ({ hostel: item._id, count: item.count })),
      monthlyTrends,
      peakHours: peakHours.map(item => ({ hour: item._id, count: item.count })),
      lostFound: {
        lostItems,
        foundItems,
        claimedItems
      },
      users: {
        total: totalUsers,
        students: studentUsers,
        management: managementUsers
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get issue trends over time
router.get('/trends', authenticateToken, authorizeRoles('management'), async (req, res) => {
  try {
    const { period = 'daily', days = 30 } = req.query;
    const daysNum = parseInt(days);
    
    let groupBy;
    switch (period) {
      case 'hourly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const startDate = new Date(new Date().getTime() - daysNum * 24 * 60 * 60 * 1000);

    const trends = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: groupBy,
          reported: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          },
          emergency: {
            $sum: {
              $cond: [{ $eq: ['$priority', 'emergency'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ trends });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get hostel performance metrics
router.get('/hostels', authenticateToken, authorizeRoles('management'), async (req, res) => {
  try {
    const hostelMetrics = await Issue.aggregate([
      {
        $group: {
          _id: '$hostel',
          totalIssues: { $sum: 1 },
          resolvedIssues: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          },
          emergencyIssues: {
            $sum: {
              $cond: [{ $eq: ['$priority', 'emergency'] }, 1, 0]
            }
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'resolved'] },
                {
                  $divide: [
                    { $subtract: ['$updatedAt', '$createdAt'] },
                    1000 * 60 * 60 // Convert to hours
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $addFields: {
          resolutionRate: {
            $multiply: [
              { $divide: ['$resolvedIssues', '$totalIssues'] },
              100
            ]
          }
        }
      },
      { $sort: { totalIssues: -1 } }
    ]);

    res.json({ hostelMetrics });
  } catch (error) {
    console.error('Hostel metrics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;