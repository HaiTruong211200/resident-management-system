const express = require("express");
const { body, param, query } = require("express-validator");
const router = express.Router();

const householdController = require("../controllers/householdController");

// Get all households
router.get(
  "/search",
  [query("keyword").optional().isString()],
  householdController.searchHouseholds
);
router.get("/", householdController.getAllHouseholds);

// router.post(
//   "/",
//   [
//     body("id").optional().isString().toString(),
//     body("houseNumber").optional().isInt().toInt(),
//     body("street").optional().isString().toString(),
//     body("ward").optional().isString().toString(),
//     body("district").optional().isString().toString(),
//     body("householdHeadId").optional().isInt().toInt(),
//   ],
//   householdController.createHousehold
// );

router.put(
  "/:id",
  [param("id").isString()],
  householdController.updateHousehold
);

module.exports = router;
