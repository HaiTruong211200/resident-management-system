const express = require('express');
const router = express.Router();
const {
  getDashboardStatistics,
  getPaymentTypeStatistics,
  getHouseholdStatistics,
} = require('../controllers/statisticsController');

// Get overall dashboard statistics
router.get('/dashboard', getDashboardStatistics);

// Get statistics by payment type
router.get('/payment-types', getPaymentTypeStatistics);

// Get statistics for a specific household
router.get('/household/:householdId', getHouseholdStatistics);

module.exports = router;
