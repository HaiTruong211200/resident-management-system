const {validationResult} = require('express-validator');
const {
  createHousehold: modelCreateHousehold,
  updateHousehold: updateHouseholdDAO,
  findById: findHouseholdById,
  searchHouseholds,
  getAllHouseholds,
  updateNumberCount,
} = require('../models/Household');
const {
  findById: findResidentById,
  updateResident,
} = require('../models/Resident');
const {
  sendSuccess,
  sendError,
  validationFailed,
} = require('../utils/response');

async function createHouseholdHandler(req, res) {
  const errors = validationResult(req);
  console.log('Validation errors:', errors.array());
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const {householdHeadId, houseNumber, street, ward, district} = req.body;
    console.log('Creating household with data:', req.body);

    // Household head is mandatory
    if (!householdHeadId) {
      return sendError(res, {
        status: 400,
        message: 'householdHeadId is required when creating a household',
        code: 'HOUSEHOLD_HEAD_REQUIRED',
      });
    }

    const resident = await findResidentById(householdHeadId);
    if (!resident)
      return sendError(res, {
        status: 404,
        message: 'Resident (householdHeadId) not found',
        code: 'RESIDENT_NOT_FOUND',
      });

    const h = await modelCreateHousehold({
      householdHeadId: householdHeadId,
      houseNumber,
      street,
      ward,
      district,
      numberCount: 1,
    });

    // Update the resident to be part of this household as head
    await updateResident(resident.id, {
      householdId: h.id,
      relationshipToHead: 'Chủ hộ',
    });

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
    const household = await findHouseholdById(id);

    if (!household)
      return sendError(res, {
        status: 404,
        message: 'Household not found',
        code: 'HOUSEHOLD_NOT_FOUND',
      });

    // Handle household head change
    if (payload.householdHeadId &&
        payload.householdHeadId !== household.householdHeadId) {
      const newHead = await findResidentById(payload.householdHeadId);
      if (!newHead)
        return sendError(res, {
          status: 404,
          message: 'New household head not found',
          code: 'RESIDENT_NOT_FOUND',
        });

      // Update old head to "Other" relationship if exists
      if (household.householdHeadId) {
        const oldHead = await findResidentById(household.householdHeadId);
        if (oldHead) {
          await updateResident(oldHead.id, {
            relationshipToHead: 'Khác',
          });
        }
      }

      // Update new head
      await updateResident(newHead.id, {
        householdId: id,
        relationshipToHead: 'Chủ hộ',
      });
    }

    const updated = await updateHouseholdDAO(id, payload);
    return sendSuccess(res, {household: updated});
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
        code: 'MISSING_KEYWORD',
      });

    const results = await searchHouseholds(keyword);
    return sendSuccess(res, {results});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function getAllHouseholdsHandler(req, res) {
  try {
    const households = await getAllHouseholds();
    return sendSuccess(res, {households});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createHousehold : createHouseholdHandler, updateHousehold,
  searchHouseholds : searchHouseholdsHandler,
  getAllHouseholds : getAllHouseholdsHandler,
};
