const {validationResult} = require('express-validator');
const {
  createResident,
  updateResident,
  searchResidents,
  findById: findResidentById
} = require('../models/Resident');
const {findById: findHouseholdById} = require('../models/Household');
const {sendSuccess, sendError, validationFailed} = require('../utils/response');

async function createResidentHandler(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const payload = req.body;

    if (payload.household_id) {
      const household = await findHouseholdById(payload.household_id);
      if (!household)
        return sendError(res, {
          status: 404,
          message: 'Household not found',
          code: 'HOUSEHOLD_NOT_FOUND'
        });
    }

    const resident = await createResident(payload);
    return sendSuccess(res, {resident}, {status: 201});
  } catch (err) {
    if (err.code === '23505')
      return sendError(res, {
        status: 409,
        message: 'Duplicate id_card_number',
        code: 'DUPLICATE_ID_CARD'
      });
    console.error(err);
    return sendError(res);
  }
}

async function updateResidentHandler(req, res) {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const payload = req.body;

    if (payload.household_id) {
      const household = await findHouseholdById(payload.household_id);
      if (!household)
        return sendError(res, {
          status: 400,
          message: 'Invalid household id',
          code: 'INVALID_HOUSEHOLD'
        });
    }

    const resident = await updateResident(id, payload);
    if (!resident)
      return sendError(res, {
        status: 404,
        message: 'Resident not found',
        code: 'RESIDENT_NOT_FOUND'
      });
    return sendSuccess(res, {resident});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function searchResidentsHandler(req, res) {
  try {
    const keyword = (req.query.keyword || '').trim();
    if (!keyword)
      return sendError(res, {
        status: 400,
        message: 'keyword query is required',
        code: 'MISSING_KEYWORD'
      });

    const results = await searchResidents(keyword);
    return sendSuccess(res, {results});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createResident : createResidentHandler,
  updateResident : updateResidentHandler,
  searchResidents : searchResidentsHandler
};
