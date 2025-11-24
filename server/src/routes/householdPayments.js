const express = require('express');
const {body, param} = require('express-validator');
const router = express.Router();
const {createHouseholdPayment, listHouseholdPayments, getHouseholdPaymentById} =
    require('../controllers/householdPaymentController');

router.post(
    '/',
    [
      body('household_id').isInt().toInt(),
      body('payment_type_id').isInt().toInt(),
      body('amount_paid').isFloat({min: 0}).toFloat(),
      body('payment_date').optional().isISO8601().toDate(),
      body('notes').optional().isString(),
    ],
    createHouseholdPayment);

// List all household payments
router.get('/', listHouseholdPayments);

// Get household payment by id
router.get('/:id', [param('id').isInt().toInt()], getHouseholdPaymentById);

module.exports = router;
