const {validationResult} = require('express-validator');
const HouseholdPayment = require('../models/HouseholdPayment');
const {findById: findHouseholdById} = require('../models/Household');
const {sendSuccess, sendError, validationFailed} = require('../utils/response');

async function createHouseholdPayment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationFailed(res, errors.array());
  try {
    const {household_id, payment_type_id, amount_paid, payment_date, notes} =
        req.body;

    const h = await findHouseholdById(household_id);
    if (!h)
      return sendError(res, {
        status: 404,
        message: 'Household not found',
        code: 'HOUSEHOLD_NOT_FOUND'
      });

    const payment = await HouseholdPayment.create(
        {household_id, payment_type_id, amount_paid, payment_date, notes});
    return sendSuccess(res, {payment}, {status: 201});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {createHouseholdPayment};

async function listHouseholdPayments(_req, res) {
  try {
    const payments = await HouseholdPayment.list();
    return sendSuccess(res, {payments});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

async function getHouseholdPaymentById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const payment = await HouseholdPayment.findById(id);
    if (!payment) {
      return sendError(res, {
        status: 404,
        message: 'Payment not found',
        code: 'PAYMENT_NOT_FOUND'
      });
    }
    return sendSuccess(res, {payment});
  } catch (err) {
    console.error(err);
    return sendError(res);
  }
}

module.exports = {
  createHouseholdPayment,
  listHouseholdPayments,
  getHouseholdPaymentById
};
