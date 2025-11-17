const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Household = require('../models/Household');
const Resident = require('../models/Resident');

async function createHousehold(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  try {
    const {household_head, house_number, street, ward, district} = req.body;

    const h = await Household.create(
        {household_head: null, house_number, street, ward, district});

    if (household_head) {
      if (!mongoose.Types.ObjectId.isValid(household_head)) {
        return res.status(400).json({message: 'Invalid household_head id'});
      }
      const resident = await Resident.findById(household_head);
      if (!resident)
        return res.status(404).json(
            {message: 'Resident (household_head) not found'});

      // assign resident to this household and set as head
      resident.household = h._id;
      await resident.save();
      h.household_head = resident._id;
      await h.save();
    }

    return res.status(201).json({household: h});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function updateHousehold(req, res) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({message: 'Invalid id'});

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  try {
    const payload = req.body;

    // If household_head provided, validate resident
    if (payload.household_head) {
      if (!mongoose.Types.ObjectId.isValid(payload.household_head))
        return res.status(400).json({message: 'Invalid household_head id'});
      const resident = await Resident.findById(payload.household_head);
      if (!resident)
        return res.status(404).json({message: 'Resident not found'});
      // set resident.household to this household
      resident.household = id;
      await resident.save();
    }

    const household = await Household.findByIdAndUpdate(
        id, payload, {new: true, runValidators: true});
    if (!household)
      return res.status(404).json({message: 'Household not found'});
    return res.json({household});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

async function searchHouseholds(req, res) {
  try {
    const keyword = (req.query.keyword || '').trim();
    if (!keyword)
      return res.status(400).json({message: 'keyword query is required'});

    const or = [];
    or.push({street: {$regex: keyword, $options: 'i'}});
    or.push({ward: {$regex: keyword, $options: 'i'}});
    or.push({district: {$regex: keyword, $options: 'i'}});
    if (!Number.isNaN(Number(keyword)))
      or.push({house_number: Number(keyword)});

    const results = await Household.find({$or: or}).populate(
        'household_head', 'full_name id_card_number');
    return res.json({results});
  } catch (err) {
    console.error(err);
    return res.status(500).json({message: 'Server error'});
  }
}

module.exports = {
  createHousehold,
  updateHousehold,
  searchHouseholds
};
