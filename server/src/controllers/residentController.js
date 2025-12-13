const { validationResult } = require("express-validator");
const {
  createResident,
  updateResident,
  searchResidents,
  findById: findResidentById,
  getAllResidents,
} = require("../models/Resident");
const { findById: findHouseholdById } = require("../models/Household");
const {
  sendSuccess,
  sendError,
  validationFailed,
} = require("../utils/response");

async function createResidentHandler(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const payload = req.body;

    if (payload.householdId) {
      const household = await findHouseholdById(payload.householdId);
      if (!household)
        return sendError(res, {
          status: 404,
          message: "Household not found",
          code: "HOUSEHOLD_NOT_FOUND",
        });
    }

    const resident = await createResident(payload);
    return sendSuccess(res, { resident }, { status: 201 });
  } catch (err) {
    if (err.code === "23505") console.log(err);
    return sendError(res, {
      status: 409,
      message: "Duplicate id_card_number",
      code: "DUPLICATE_ID_CARD",
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

    if (payload.householdId) {
      const household = await findHouseholdById(payload.householdId);
      if (!household)
        return sendError(res, {
          status: 400,
          message: "Invalid household id",
          code: "INVALID_HOUSEHOLD",
        });
    }

    const resident = await updateResident(id, payload);
    if (!resident)
      return sendError(res, {
        status: 404,
        message: "Resident not found",
        code: "RESIDENT_NOT_FOUND",
      });
    return sendSuccess(res, { resident });
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function searchResidentsHandler(req, res) {
  try {
    const keyword = (req.query.keyword || "").trim();
    if (!keyword)
      return sendError(res, {
        status: 400,
        message: "keyword query is required",
        code: "MISSING_KEYWORD",
      });

    const results = await searchResidents(keyword);
    return sendSuccess(res, { results });
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function getAllResidentsHandler(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const householdId = req.query.householdId
      ? Number(req.query.householdId)
      : undefined;

    // Parse optional sorting params
    const sort_by = req.query.sort_by ? String(req.query.sort_by) : undefined;
    const order = req.query.order ? String(req.query.order) : undefined;

    const { data, count } = await getAllResidents({
      page,
      limit,
      householdId,
      sort_by,
      order,
    });

    return sendSuccess(res, {
      residents: data,
      meta: { total: count, page, limit },
    });
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createResident: createResidentHandler,
  updateResident: updateResidentHandler,
  searchResidents: searchResidentsHandler,
  getAllResidents: getAllResidentsHandler,
};
