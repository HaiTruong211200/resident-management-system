const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const {
  createHouseholdPayment,
  listHouseholdPayments,
  getHouseholdPaymentById,
  updateHouseholdPayment,
} = require("../controllers/householdPaymentController");

router.post(
  "/",
  [
    body("householdId")
      .isInt({ min: 1 })
      .withMessage("householdId must be an integer")
      .toInt(),

    body("paymentTypeId")
      .isInt({ min: 1 })
      .withMessage("paymentTypeId must be an integer")
      .toInt(),

    body("amountPaid")
      .isFloat({ min: 0 })
      .withMessage("amountPaid must be >= 0")
      .toFloat(),

    body("amountExpected")
      .isFloat({ min: 0 })
      .withMessage("amountExpected must be >= 0")
      .toFloat(),

    body("status")
      .optional()
      .isIn(["Đã đóng", "Một phần", "Chưa đóng", "Quá hạn", "Chưa bắt đầu"])
      .withMessage("Invalid payment status"),

    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("startDate must be ISO 8601")
      .toDate(),

    body("paymentDate")
      .optional()
      .isISO8601()
      .withMessage("paymentDate must be ISO8601")
      .toDate(),

    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("dueDate must be ISO8601")
      .toDate(),

    body("notes").optional().isString().trim(),
  ],
  createHouseholdPayment
);

router.patch(
  "/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("id must be an integer").toInt(),

    body("amountPaid")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("amountPaid must be >= 0")
      .toFloat(),

    body("status")
      .optional()
      .isIn(["Đã đóng", "Một phần", "Chưa đóng", "Quá hạn", "Chưa bắt đầu"])
      .withMessage("Invalid payment status"),

    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("startDate must be ISO8601")
      .toDate(),

    body("paymentDate")
      .optional()
      .isISO8601()
      .withMessage("paymentDate must be ISO8601")
      .toDate(),

    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("dueDate must be ISO8601")
      .toDate(),

    body("notes")
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage("notes is too long"),
  ],
  updateHouseholdPayment
);

// List all household payments
router.get("/", listHouseholdPayments);

// Get household payment by id
router.get("/:id", [param("id").isInt().toInt()], getHouseholdPaymentById);

module.exports = router;
