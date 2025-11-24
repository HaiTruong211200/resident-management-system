const express = require('express');
const {body, param, query} = require('express-validator');
const router = express.Router();

const residentController = require('../controllers/residentController');

// Create resident
router.post(
    '/',
    [
      body('household_id')
          .optional()
          .isInt()
          .withMessage('household_id must be int'),
      body('full_name').isLength({min: 2}).withMessage('full_name is required'),
      body('date_of_birth').optional().isISO8601().toDate(),
      body('gender').optional().isIn(['male', 'female', 'other']),
      body('place_of_birth').optional().isString(),
      body('hometown').optional().isString(),
      body('ethnicity').optional().isString(),
      body('occupation').optional().isString(),
      body('workplace').optional().isString(),
      body('id_card_number').optional().isString(),
      body('id_card_issue_place').optional().isString(),
      body('id_card_issue_date').optional().isISO8601().toDate(),
      body('residence_registration_date').optional().isISO8601().toDate(),
      body('previous_address').optional().isString(),
      body('relationship_to_head').optional().isString(),
    ],
    residentController.createResident);

// Update resident
router.put(
    '/:id', [param('id').isInt().withMessage('Invalid id')],
    residentController.updateResident);

// Search residents
router.get(
    '/search', [query('keyword').optional().isString()],
    residentController.searchResidents);

module.exports = router;
