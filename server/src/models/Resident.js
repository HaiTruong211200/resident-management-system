const mongoose = require('mongoose');
const {Schema} = mongoose;

const GENDERS = ['male', 'female', 'other'];

const ResidentSchema = new Schema(
    {
      household: {
        type: Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
      },
      full_name: {type: String, required: true, trim: true},
      date_of_birth: {type: Date, required: true},
      gender: {type: String, enum: GENDERS, required: true},
      place_of_birth: {type: String, trim: true},
      hometown: {type: String, trim: true},
      ethnicity: {type: String, trim: true},
      occupation: {type: String, trim: true},
      workplace: {type: String, trim: true},
      id_card_number:
          {type: String, required: true, unique: true, index: true, trim: true},
      id_card_issue_place: {type: String, trim: true},
      id_card_issue_date: {type: Date},
      residence_registration_date: {type: Date},
      previous_address: {type: String, trim: true},
      relationship_to_head: {type: String, trim: true},
    },
    {
      timestamps: true,
      toJSON: {virtuals: true},
      toObject: {virtuals: true},
    });

ResidentSchema.index({household: 1, full_name: 1});

module.exports =
    mongoose.models.Resident || mongoose.model('Resident', ResidentSchema);
