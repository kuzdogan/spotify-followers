const mongoose = require('mongoose');

const UserTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expireDate: {
        type: Date,
        required: true
    },
  }, { timestamps: true });

  module.exports = mongoose.model('UserToken', UserTokenSchema);