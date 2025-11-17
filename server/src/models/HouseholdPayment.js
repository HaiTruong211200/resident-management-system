const mongoose = require('mongoose');
const {Schema} = mongoose;

const HouseholdPaymentSchema = new Schema(
    {
      household: {
        type: Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
      },
      payment_type: {
        type: Schema.Types.ObjectId,
        ref: 'PaymentType',
        required: true,
        index: true
      },
      amount_paid: {type: Number, required: true, min: 0},
      payment_date: {type: Date, required: true, default: Date.now},
      notes: {type: String, default: null, trim: true},
    },
    {timestamps: true});

HouseholdPaymentSchema.index({household: 1, payment_date: -1});

module.exports = mongoose.models.HouseholdPayment ||
    mongoose.model('HouseholdPayment', HouseholdPaymentSchema);
