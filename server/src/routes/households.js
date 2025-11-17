const express = require('express');
const {body, param, query} = require('express-validator');
const router = express.Router();

const householdController = require('../controllers/householdController');

router.post(
    '/',
    [
      body('house_number').optional().isInt().toInt(),
      body('street').optional().isString(),
    ],
    householdController.createHousehold,
);

router.put(
    '/:id', [param('id').isMongoId()], householdController.updateHousehold);

router.get(
    '/search', [query('keyword').optional().isString()],
    householdController.searchHouseholds);

module.exports = router;
