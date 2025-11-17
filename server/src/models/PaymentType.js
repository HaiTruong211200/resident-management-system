const mongoose = require('mongoose');
const {Schema} = mongoose;

const PAYMENT_TYPES = ['one_time', 'recurring', 'fee'];

const PaymentTypeSchema = new Schema(
    {
      name: {type: String, required: true, trim: true},
      pass: {
        type: String,
        trim: true
      },  // optional code or pass-through field from ERD
      type: {
        type: String,
        enum: PAYMENT_TYPES,
        required: true,
        default: 'one_time'
      },
      amount_per_person: {type: Number, default: null},
      date_created: {type: Date, default: Date.now},
    },
    {timestamps: true});

PaymentTypeSchema.index({name: 1}, {unique: true, sparse: true});

module.exports = mongoose.models.PaymentType ||
    mongoose.model('PaymentType', PaymentTypeSchema);
