const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {
  getDashboardStatistics,
  getPaymentTypeStatistics,
  getHouseholdStatistics,
} = require('../controllers/statisticsController');

// Get overall dashboard statistics
router.get('/dashboard', auth, getDashboardStatistics);

// Get statistics by payment type
router.get('/payment-types', auth, getPaymentTypeStatistics);

// Get statistics for a specific household
router.get('/household/:householdId', auth, getHouseholdStatistics);

module.exports = router;
