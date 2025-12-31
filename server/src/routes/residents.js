const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");

const residentController = require("../controllers/residentController");

// Get all residents
router.get("/", auth, residentController.getAllResidents);

// Create resident
router.post(
  "/",
  auth,
  adminOnly,
  [
    body("householdId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("householdId must be a positive integer")
      .toInt(),
    body("fullName").isLength({ min: 2 }).withMessage("fullName is required"),
    body("dateOfBirth").optional().isISO8601().toDate(),
    body("gender").optional().isIn(["Nam", "Nữ", "Khác"]),
    body("placeOfBirth").optional().isString(),
    body("hometown").optional().isString(),
    body("ethnicity").optional().isString(),
    body("occupation").optional().isString(),
    body("workplace").optional().isString(),
    body("idCardNumber").optional().isString(),
    body("idCardIssuePlace").optional().isString(),
    body("idCardIssueDate").optional().isISO8601().toDate(),
    body("residenceRegistrationDate").optional().isISO8601().toDate(),
    body("previousAddress").optional().isString(),
    body("relationshipToHead").optional().isString(),
  ],
  residentController.createResident
);

// Update resident
router.patch(
  "/:id",
  auth,
  adminOnly,
  [
    param("id").isInt().withMessage("Invalid id"),
    body("householdId")
      .optional()
      .isInt({ min: 1 })
      .withMessage("householdId must be a positive integer")
      .toInt(),
    body("fullName")
      .optional()
      .isLength({ min: 2 })
      .withMessage("fullName must be at least 2 characters"),
    body("dateOfBirth").optional().isISO8601().toDate(),
    body("gender").optional().isIn(["Nam", "Nữ", "Khác"]),
    body("placeOfBirth").optional().isString(),
    body("hometown").optional().isString(),
    body("ethnicity").optional().isString(),
    body("occupation").optional().isString(),
    body("workplace").optional().isString(),
    body("idCardNumber").optional().isString(),
    body("idCardIssuePlace").optional().isString(),
    body("idCardIssueDate").optional().isISO8601().toDate(),
    body("residenceRegistrationDate").optional().isISO8601().toDate(),
    body("previousAddress").optional().isString(),
    body("relationshipToHead").optional().isString(),
  ],
  residentController.updateResident
);

// Delete resident (soft delete)
router.delete(
  "/:id",
  auth,
  adminOnly,
  [param("id").isInt().withMessage("Invalid id")],
  residentController.deleteResident
);

module.exports = router;
