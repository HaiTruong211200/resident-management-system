const { validationResult } = require("express-validator");
const {
  createResident,
  updateResident,
  searchResidents,
  findById: findResidentById,
  getAllResidents,
  deleteResident,
} = require("../models/Resident");
const {
  findById: findHouseholdById,
  updateNumberCount,
} = require("../models/Household");
const {
  sendSuccess,
  sendError,
  validationFailed,
} = require("../utils/response");

function getAgeDifference(date1, date2) {
  const diff = Math.abs(new Date(date1) - new Date(date2));
  return diff / (1000 * 60 * 60 * 24 * 365.25);
}

// Helper function to validate age based on relationship
async function validateAgeForRelationship(residentData, householdHeadId) {
  if (!residentData.dateOfBirth || !residentData.relationshipToHead) {
    return { valid: true };
  }

  const relationship = residentData.relationshipToHead.toLowerCase();

  // Only validate for specific relationships
  if (!["Con", "Cha/Mẹ"].some((rel) => relationship.includes(rel))) {
    return { valid: true };
  }

  const head = await findResidentById(householdHeadId);
  if (!head || !head.dateOfBirth) {
    return { valid: true }; // Skip validation if head DOB not available
  }

  const ageDiff = getAgeDifference(residentData.dateOfBirth, head.dateOfBirth);

  // Child relationship - must be at least 18 years younger
  if (relationship.includes("Con")) {
    if (new Date(residentData.dateOfBirth) <= new Date(head.dateOfBirth)) {
      return {
        valid: false,
        message: "Child must be younger than household head",
      };
    }
    if (ageDiff < 18) {
      return {
        valid: false,
        message: "Child must be at least 18 years younger than household head",
      };
    }
  }

  // Parent relationship - must be at least 18 years older
  if (["Cha/Mẹ"].some((rel) => relationship.includes(rel))) {
    if (new Date(residentData.dateOfBirth) >= new Date(head.dateOfBirth)) {
      return {
        valid: false,
        message: "Parent must be older than household head",
      };
    }
    if (ageDiff < 18) {
      return {
        valid: false,
        message: "Parent must be at least 18 years older than household head",
      };
    }
  }

  return { valid: true };
}

async function createResidentHandler(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const payload = req.body;
    let household = null;

    if (payload.householdId) {
      household = await findHouseholdById(payload.householdId);
      if (!household)
        return sendError(res, {
          status: 404,
          message: "Household not found",
          code: "HOUSEHOLD_NOT_FOUND",
        });

      // Validate age if household has a head
      if (household.householdHeadId) {
        const ageValidation = await validateAgeForRelationship(
          payload,
          household.householdHeadId
        );
        if (!ageValidation.valid) {
          return sendError(res, {
            status: 400,
            message: ageValidation.message,
            code: "INVALID_AGE_FOR_RELATIONSHIP",
          });
        }
      }
    }

    const resident = await createResident(payload);

    // Update number count if added to household
    if (payload.householdId) {
      await updateNumberCount(payload.householdId, true);
    }

    return sendSuccess(res, { resident }, { status: 201 });
  } catch (err) {
    if (err.code === "23505") {
      console.log(err);
      return sendError(res, {
        status: 409,
        message: "Duplicate idCardNumber",
        code: "DUPLICATE_ID_CARD",
      });
    }
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
    const currentResident = await findResidentById(id);

    if (!currentResident)
      return sendError(res, {
        status: 404,
        message: "Resident not found",
        code: "RESIDENT_NOT_FOUND",
      });

    const oldHouseholdId = currentResident.householdId;
    const newHouseholdId = payload.householdId;

    if (newHouseholdId !== undefined && newHouseholdId !== oldHouseholdId) {
      // Validate new household exists
      if (newHouseholdId) {
        const household = await findHouseholdById(newHouseholdId);
        if (!household)
          return sendError(res, {
            status: 400,
            message: "Invalid household id",
            code: "INVALID_HOUSEHOLD",
          });

        // Validate age if household has a head
        if (household.householdHeadId) {
          const residentData = { ...currentResident, ...payload };
          const ageValidation = await validateAgeForRelationship(
            residentData,
            household.householdHeadId
          );
          if (!ageValidation.valid) {
            return sendError(res, {
              status: 400,
              message: ageValidation.message,
              code: "INVALID_AGE_FOR_RELATIONSHIP",
            });
          }
        }

        // Increment new household count
        await updateNumberCount(newHouseholdId, true);
      }

      // Decrement old household count
      if (oldHouseholdId) {
        await updateNumberCount(oldHouseholdId, false);
      }
    }

    const resident = await updateResident(id, payload);
    return sendSuccess(res, { resident });
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function deleteResidentHandler(req, res) {
  const id = req.params.id;

  try {
    const resident = await findResidentById(id);
    if (!resident)
      return sendError(res, {
        status: 404,
        message: "Resident not found",
        code: "RESIDENT_NOT_FOUND",
      });

    // Check if resident is household head
    if (resident.householdId) {
      const household = await findHouseholdById(resident.householdId);
      if (household && household.householdHeadId === resident.id) {
        return sendError(res, {
          status: 400,
          message:
            "Cannot delete household head. Please change household head first.",
          code: "CANNOT_DELETE_HOUSEHOLD_HEAD",
        });
      }
    }

    const deleted = await deleteResident(id);

    // Decrement household number count
    if (resident.householdId) {
      await updateNumberCount(resident.householdId, false);
    }

    return sendSuccess(res, { resident: deleted });
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
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
    const order = req.query.order ? String(req.query.order) : undefined;

    const { data, count } = await getAllResidents({
      page,
      limit,
      householdId,
      sortBy,
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
  deleteResident: deleteResidentHandler,
};
