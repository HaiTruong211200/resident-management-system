const express = require('express');
const {body, query, param} = require('express-validator');
const router = express.Router();

const feesController = require('../controllers/feesController');

// Create fee campaign
router.post(
    '/campaigns',
    [body('name').isLength({min: 1}).withMessage('name is required')],
    feesController.createCampaign,
);

// Create payment
router.post(
    '/payments',
    [
      body('campaign').notEmpty(), body('household').notEmpty(),
      body('amount_paid').isFloat({min: 0})
    ],
    feesController.createPayment,
);

// List payments by campaign
router.get(
    '/payments', [query('campaignId').notEmpty()], feesController.getPayments);

// Campaign statistics
router.get(
    '/campaigns/:id/statistics', [param('id').isMongoId()],
    feesController.campaignStatistics);

module.exports = router;
