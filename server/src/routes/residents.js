const express = require('express');
const {body, param, query} = require('express-validator');
const router = express.Router();

const residentController = require('../controllers/residentController');

// Create resident
router.post(
    '/',
    [
      body('household').notEmpty().withMessage('household is required'),
      body('full_name').isLength({min: 2}).withMessage('full_name is required'),
      body('date_of_birth')
          .isISO8601()
          .toDate()
          .withMessage('date_of_birth is required'),
      body('gender')
          .isIn(['male', 'female', 'other'])
          .withMessage('Invalid gender'),
      body('id_card_number')
          .notEmpty()
          .withMessage('id_card_number is required'),
    ],
    residentController.createResident,
);

// Update resident
router.put(
    '/:id',
    [param('id').isMongoId().withMessage('Invalid id')],
    residentController.updateResident,
);

// Search residents
router.get(
    '/search', [query('keyword').optional().isString()],
    residentController.searchResidents);

module.exports = router;
