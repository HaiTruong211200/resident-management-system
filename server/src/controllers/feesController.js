const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const FeeCampaign = require('../models/FeeCampaign');
const FeePayment = require('../models/FeePayment');
const Household = require('../models/Household');

async function createCampaign(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  try {
    const payload = req.body;
    const campaign = await FeeCampaign.create(payload);
    return res.status(201).json({campaign});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function createPayment(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  try {
    const {campaign, household, amount_paid, payment_date, notes} = req.body;
    if (!mongoose.Types.ObjectId.isValid(campaign) ||
        !mongoose.Types.ObjectId.isValid(household)) {
      return res.status(400).json(
          {message: 'Invalid campaign or household id'});
    }
    const c = await FeeCampaign.findById(campaign);
    if (!c) return res.status(404).json({message: 'Campaign not found'});
    const h = await Household.findById(household);
    if (!h) return res.status(404).json({message: 'Household not found'});

    const payment = await FeePayment.create(
        {campaign, household, amount_paid, payment_date, notes});
    return res.status(201).json({payment});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function getPayments(req, res) {
  try {
    const campaignId = req.query.campaignId;
    if (!campaignId || !mongoose.Types.ObjectId.isValid(campaignId))
      return res.status(400).json({message: 'campaignId query required'});
    const payments =
        await FeePayment.find({campaign: campaignId})
            .populate('household', 'house_number street ward district');
    return res.json({payments});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function campaignStatistics(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({message: 'Invalid campaign id'});

    const totalHouseholds = await Household.countDocuments();
    // households that have at least one payment for this campaign
    const paidHouseholds =
        await FeePayment.distinct('household', {campaign: id});
    const paidCount = paidHouseholds.length;
    const notPaidCount = Math.max(0, totalHouseholds - paidCount);

    return res.json({campaignId: id, totalHouseholds, paidCount, notPaidCount});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

module.exports = {
  createCampaign,
  createPayment,
  getPayments,
  campaignStatistics
};
