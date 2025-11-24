const {validationResult} = require('express-validator');
const {
  createHousehold: modelCreateHousehold,
  updateHousehold: updateHouseholdDAO,
  findById: findHouseholdById,
  searchHouseholds
} = require('../models/Household');
const {findById: findResidentById, updateResident} =
    require('../models/Resident');
const {sendSuccess, sendError, validationFailed} = require('../utils/response');

async function createHouseholdHandler(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const {household_head_id, house_number, street, ward, district} = req.body;

    const h = await modelCreateHousehold(
        {household_head_id: null, house_number, street, ward, district});

    if (household_head_id) {
      const resident = await findResidentById(household_head_id);
      if (!resident)
        return sendError(res, {
          status: 404,
          message: 'Resident (household_head_id) not found',
          code: 'RESIDENT_NOT_FOUND'
        });
      await updateResident(resident.id, {household_id: h.id});
      const updated =
          await updateHouseholdDAO(h.id, {household_head_id: resident.id});
      return sendSuccess(res, {household: updated}, {status: 201});
    }
    return sendSuccess(res, {household: h}, {status: 201});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function updateHousehold(req, res) {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const payload = req.body;

    if (payload.household_head_id) {
      const resident = await findResidentById(payload.household_head_id);
      if (!resident)
        return sendError(res, {
          status: 404,
          message: 'Resident not found',
          code: 'RESIDENT_NOT_FOUND'
        });
      await updateResident(resident.id, {household_id: id});
    }

    const household = await updateHouseholdDAO(id, payload);
    if (!household)
      return sendError(res, {
        status: 404,
        message: 'Household not found',
        code: 'HOUSEHOLD_NOT_FOUND'
      });
    return sendSuccess(res, {household});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function searchHouseholdsHandler(req, res) {
  try {
    const keyword = (req.query.keyword || '').trim();
    if (!keyword)
      return sendError(res, {
        status: 400,
        message: 'keyword query is required',
        code: 'MISSING_KEYWORD'
      });

    const results = await searchHouseholds(keyword);
    return sendSuccess(res, {results});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createHousehold : createHouseholdHandler, updateHousehold,
  searchHouseholds : searchHouseholdsHandler
};
