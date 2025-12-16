const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const {
  createPaymentType,
  listPaymentTypes,
  getPaymentTypeById,
  updatePaymentType,
} = require("../controllers/paymentTypeController");

router.post(
  "/",
  [
    body("name").isString().notEmpty(),
    body("paymentType").isIn(["Bắt buộc", "Tự nguyện"]),
    body("amountPerPerson").optional().isFloat({ min: 0 }).toFloat(),
    body("createdAt").optional().isISO8601().toDate(),
    body("startDate").optional().isISO8601().toDate(),
    body("dateExpired").optional().isISO8601().toDate(),
    body("description").optional().isString(),
  ],
  createPaymentType
);
// List all payment types
router.get("/", listPaymentTypes);

// Get payment type by id
router.get("/:id", [param("id").isInt().toInt()], getPaymentTypeById);

router.patch(
  "/:id",
  [
    body("pass").optional().isString().notEmpty(),
    body("paymentType").optional().isIn(["Bắt buộc", "Tự nguyện"]),
    body("amountPerPerson")
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .toFloat(),
    body("createdAt").optional().isISO8601().toDate(),
    body("startDate").optional().isISO8601().toDate(),
    body("dateExpired").optional().isISO8601().toDate(),
    body("description").optional({ nullable: true }).isString(),
  ],
  updatePaymentType
);

module.exports = router;
