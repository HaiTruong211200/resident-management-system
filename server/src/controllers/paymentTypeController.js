const {validationResult} = require('express-validator');
const PaymentType = require('../models/PaymentType');
const {sendSuccess, sendError, validationFailed} = require('../utils/response');

async function createPaymentType(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());
  try {
    const payload =
        req.body;  // {name, pass, type, amount_per_person?, date_created?}
    const pt = await PaymentType.create(payload);
    return sendSuccess(res, {payment_type: pt}, {status: 201});
  } catch (err) {
    if (err && err.code === '23505') {
      return sendError(res, {
        status: 409,
        message: 'Duplicate name',
        code: 'DUPLICATE_PAYMENT_TYPE'
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
    return sendSuccess(res, {payment_types: list});
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
        code: 'PAYMENT_TYPE_NOT_FOUND'
      });
    }
    return sendSuccess(res, {payment_type: item});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createPaymentType,
  listPaymentTypes,
  getPaymentTypeById
};
