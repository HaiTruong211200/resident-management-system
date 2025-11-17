const mongoose = require('mongoose');
const {Schema} = mongoose;

const FeePaymentSchema = new Schema(
    {
      campaign: {
        type: Schema.Types.ObjectId,
        ref: 'FeeCampaign',
        required: true,
        index: true
      },
      household: {
        type: Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
      },
      amount_paid: {type: Number, required: true, min: 0},
      payment_date: {type: Date, required: true, default: Date.now},
      notes: {type: String, default: null, trim: true},
    },
    {timestamps: true});

FeePaymentSchema.index({campaign: 1, household: 1}, {unique: false});

module.exports = mongoose.models.FeePayment ||
    mongoose.model('FeePayment', FeePaymentSchema);
