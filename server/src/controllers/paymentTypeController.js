const {validationResult} = require('express-validator');
const PaymentType = require('../models/PaymentType');
const Household = require('../models/Household');
const HouseholdPayment = require('../models/HouseholdPayment');
const Resident = require('../models/Resident');
const {
  sendSuccess,
  sendError,
  validationFailed,
} = require('../utils/response');

async function createPaymentType(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return validationFailed(res, errors.array());
  }
  try {
    const payload = {
      name: req.body.name,
      type: req.body.paymentType,
      pass: req.body.pass,
      amountPerPerson: req.body.amountPerPerson,
      createdAt: req.body.createdAt,
      startDate: req.body.startDate,
      dateExpired: req.body.dateExpired,
      description: req.body.description,
    };

    const pt = await PaymentType.create(payload);

    if (pt.type === 'Bắt buộc') {
      const households = await Household.getAllHouseholds();

      for (const household of households) {
        const numberCount = household.numberCount || 0;
        await HouseholdPayment.create({
          householdId: household.id,
          paymentTypeId: pt.paymentTypeId,
          amountPaid: 0,
          status: 'Chưa đóng',
          startDate: payload.startDate,
          dueDate: payload.dateExpired || pt.dateExpired,
        });
      }
    }
    return sendSuccess(res, {paymentType: pt}, {status: 201});
  } catch (err) {
    if (err && err.code === '23505') {
      console.log(err);
      return sendError(res, {
        status: 409,
        message: 'Duplicate name',
        code: 'DUPLICATE_PAYMENT_TYPE',
      });
    }
    console.error(err);
    return sendError(res);
  }
}

module.exports = {createPaymentType};
async function listPaymentTypes(_req, res) {
  try {
    const list = await PaymentType.list();
    return sendSuccess(res, {paymentTypes: list});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function getPaymentTypeById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await PaymentType.findById(id);
    if (!item) {
      return sendError(res, {
        status: 404,
        message: 'Payment type not found',
        code: 'PAYMENT_TYPE_NOT_FOUND',
      });
    }
    return sendSuccess(res, {paymentType: item});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function updatePaymentType(req, res) {
  const id = req.params.id;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());

  try {
    const payload = {
      name: req.body.name,
      type: req.body.paymentType,
      amountPerPerson: req.body.amountPerPerson,
      dateCreated: req.body.createdAt,
      dateStarted: req.body.startDate,
      dateExpired: req.body.dateExpired,
      description: req.body.description,
    };

    console.log('Update payload:', payload);
    const pt = await PaymentType.update(id, payload);

    if (pt.type === 'Bắt buộc') {
      const households = await Household.getAllHouseholds();

      for (const household of households) {
        await HouseholdPayment.updateByPaymentType(pt.paymentTypeId, {
          startDate: payload.startDate,
          dueDate: payload.dateExpired,
        });
      }
    }
    return sendSuccess(res, {paymentType: pt});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createPaymentType,
  listPaymentTypes,
  getPaymentTypeById,
  updatePaymentType,
};
