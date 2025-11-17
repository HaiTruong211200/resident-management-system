const mongoose = require('mongoose');
const {Schema} = mongoose;

const CAMPAIGN_TYPES = ['mandatory', 'voluntary'];

const FeeCampaignSchema = new Schema(
    {
      name: {type: String, required: true, trim: true},
      payment_type:
          {type: Schema.Types.ObjectId, ref: 'PaymentType', required: false},
      type: {type: String, enum: CAMPAIGN_TYPES, default: 'mandatory'},
      amount_per_person: {type: Number, default: null},
      start_date: {type: Date, default: Date.now},
      end_date: {type: Date, default: null},
      notes: {type: String, default: null, trim: true},
    },
    {timestamps: true});

FeeCampaignSchema.index({name: 1});

module.exports = mongoose.models.FeeCampaign ||
    mongoose.model('FeeCampaign', FeeCampaignSchema);
