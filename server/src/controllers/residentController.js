const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Resident = require('../models/Resident');
const Household = require('../models/Household');

async function createResident(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  try {
    const payload = req.body;

    // Ensure household exists
    if (!payload.household ||
        !mongoose.Types.ObjectId.isValid(payload.household)) {
      return res.status(400).json({message: 'Valid household id is required'});
    }
    const household = await Household.findById(payload.household);
    if (!household)
      return res.status(404).json({message: 'Household not found'});

    const resident = await Resident.create(payload);
    return res.status(201).json({resident});
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({message: 'Duplicate id_card_number'});
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function updateResident(req, res) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({message: 'Invalid id'});

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  try {
    const payload = req.body;

    // If household provided, ensure it's valid
    if (payload.household &&
        !mongoose.Types.ObjectId.isValid(payload.household)) {
      return res.status(400).json({message: 'Invalid household id'});
    }

    const resident = await Resident.findByIdAndUpdate(
        id, payload, {new: true, runValidators: true});
    if (!resident) return res.status(404).json({message: 'Resident not found'});
    return res.json({resident});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function searchResidents(req, res) {
  try {
    const keyword = (req.query.keyword || '').trim();
    if (!keyword)
      return res.status(400).json({message: 'keyword query is required'});

    const or = [];
    // search by name (case-insensitive)
    or.push({full_name: {$regex: keyword, $options: 'i'}});
    // id_card_number exact or contains
    or.push({id_card_number: {$regex: keyword, $options: 'i'}});
    // if keyword looks like ObjectId, search by household
    if (mongoose.Types.ObjectId.isValid(keyword)) {
      or.push({household: mongoose.Types.ObjectId(keyword)});
    }

    const results = await Resident.find({$or: or}).populate(
        'household', 'house_number street ward district');
    return res.json({results});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

module.exports = {
  createResident,
  updateResident,
  searchResidents
};
