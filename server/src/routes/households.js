const express = require('express');
const {body, param, query} = require('express-validator');
const router = express.Router();
const {auth, adminOnly} = require('../middleware/auth');

const householdController = require('../controllers/householdController');

// Get all households
router.get(
    '/search', auth, [query('keyword').optional().isString()],
    householdController.searchHouseholds);
router.get('/', auth, householdController.getAllHouseholds);

// Admin only routes
router.post(
    '/', auth, adminOnly,
    [
      body('houseNumber').optional().isInt().toInt(),
      body('street').optional().isString().trim(),
      body('ward').optional().isString().trim(),
      body('district').optional().isString().trim(),
      body('householdHeadId')
          .notEmpty()
          .withMessage('householdHeadId is required')
          .isInt()
          .toInt(),
    ],
    householdController.createHousehold);

router.delete(
    '/:id', auth, adminOnly, [param('id').isString()],
    householdController.deleteHousehold);

router.put(
    '/:id', auth, adminOnly, [param('id').isString()],
    householdController.updateHousehold);

module.exports = router;
