const express = require('express');
const {body, param, query} = require('express-validator');
const router = express.Router();

const householdController = require('../controllers/householdController');

// Get all households
router.get(
    '/search', [query('keyword').optional().isString()],
    householdController.searchHouseholds);
router.get('/', householdController.getAllHouseholds);

router.post(
    '/',
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
    '/:id', [param('id').isString()], householdController.deleteHousehold);

router.put(
    '/:id', [param('id').isString()], householdController.updateHousehold);

module.exports = router;
