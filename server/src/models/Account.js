const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const ROLES = ['admin', 'staff', 'user'];

const AccountSchema = new Schema(
    {
      user_name:
          {type: String, required: true, unique: true, trim: true, index: true},
      pass: {type: String, required: true},
      role: {type: String, enum: ROLES, default: 'user'},
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
      },
      refreshToken: {type: String, default: null},
    },
    {timestamps: true});

AccountSchema.pre('save', async function(next) {
  if (!this.isModified('pass')) return next();
  const salt = await bcrypt.genSalt(10);
  this.pass = await bcrypt.hash(this.pass, salt);
  next();
});

AccountSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.pass);
};

// Remove sensitive fields when converting to JSON
AccountSchema.methods.toJSON = function() {
  const obj = this.toObject({versionKey: false});
  delete obj.pass;
  return obj;
};

module.exports =
    mongoose.models.Account || mongoose.model('Account', AccountSchema);
