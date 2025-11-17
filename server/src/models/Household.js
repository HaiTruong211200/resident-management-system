const mongoose = require('mongoose');
const {Schema} = mongoose;

const HouseholdSchema = new Schema(
    {
      household_head: {type: Schema.Types.ObjectId, ref: 'Resident'},
      house_number: {type: Number},
      street: {type: String, trim: true},
      ward: {type: String, trim: true},
      district: {type: String, trim: true},
    },
    {timestamps: true});

HouseholdSchema.index({district: 1, ward: 1, street: 1, house_number: 1});

module.exports =
    mongoose.models.Household || mongoose.model('Household', HouseholdSchema);
