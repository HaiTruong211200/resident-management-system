const express = require('express');
const {body, param} = require('express-validator');
const router = express.Router();
const {auth, adminOnly} = require('../middleware/auth');
const {
  createPaymentType,
  listPaymentTypes,
  getPaymentTypeById,
  updatePaymentType,
  deletePaymentType,
} = require('../controllers/paymentTypeController');

// Admin only routes
router.post(
    '/', auth, adminOnly,
    [
      body('name').isString().notEmpty(),
      body('paymentType').isIn(['Bắt buộc', 'Tự nguyện']),
      body('amountPerPerson').optional().isFloat({min: 0}).toFloat(),
      body('createdAt').optional().isISO8601().toDate(),
      body('startDate').optional().isISO8601().toDate(),
      body('dateExpired')
          .optional()
          .isISO8601()
          .toDate()
          .custom((value, {req}) => {
            if (value && req.body.startDate) {
              const startDate = new Date(req.body.startDate);
              const expiredDate = new Date(value);
              if (expiredDate <= startDate) {
                throw new Error('dateExpired must be after startDate');
              }
            }
            return true;
          }),
      body('description').optional().isString(),
    ],
    createPaymentType);

router.patch(
    '/:id', auth, adminOnly,
    [
      body('name').optional().isString().notEmpty(),
      body('paymentType').optional().isIn(['Bắt buộc', 'Tự nguyện']),
      body('amountPerPerson')
          .optional({nullable: true})
          .isFloat({min: 0})
          .toFloat(),
      body('createdAt').optional().isISO8601().toDate(),
      body('startDate').optional().isISO8601().toDate(),
      body('dateExpired')
          .optional()
          .isISO8601()
          .toDate()
          .custom((value, {req}) => {
            if (value && req.body.startDate) {
              const startDate = new Date(req.body.startDate);
              const expiredDate = new Date(value);
              if (expiredDate <= startDate) {
                throw new Error('dateExpired must be after startDate');
              }
            }
            return true;
          }),
      body('description').optional({nullable: true}).isString(),
    ],
    updatePaymentType);

// List all payment types
router.get('/', auth, listPaymentTypes);

// Get payment type by id
router.get('/:id', auth, [param('id').isInt().toInt()], getPaymentTypeById);

// Delete payment type
router.delete(
    '/:id', auth, adminOnly, [param('id').isInt().toInt()], deletePaymentType);

module.exports = router;
