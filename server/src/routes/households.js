const express = require('express');
const {body, param, query} = require('express-validator');
const router = express.Router();

const householdController = require('../controllers/householdController');

router.post(
    '/',
    [
      body('house_number').optional().isInt().toInt(),
      body('street').optional().isInt().toInt(),
      body('ward').optional().isInt().toInt(),
      body('district').optional().isInt().toInt(),
      body('household_head_id').optional().isInt().toInt(),
    ],
    householdController.createHousehold);

router.put('/:id', [param('id').isInt()], householdController.updateHousehold);

router.get(
    '/search', [query('keyword').optional().isString()],
    householdController.searchHouseholds);

module.exports = router;
