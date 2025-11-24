const express = require('express');
const {body, param} = require('express-validator');
const router = express.Router();
const {createPaymentType, listPaymentTypes, getPaymentTypeById} =
    require('../controllers/paymentTypeController');

router.post(
    '/',
    [
      body('name').isString().notEmpty(),
      body('pass').isString().notEmpty(),
      body('type').isIn(['mandatory', 'voluntary', 'other']),
      body('amount_per_person').optional().isFloat({min: 0}).toFloat(),
      body('date_created').optional().isISO8601().toDate(),
    ],
    createPaymentType);
// List all payment types
router.get('/', listPaymentTypes);

// Get payment type by id
router.get('/:id', [param('id').isInt().toInt()], getPaymentTypeById);

module.exports = router;