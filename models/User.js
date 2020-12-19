const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const Follower = require('./Follower');

const UserSchema = new mongoose.Schema({
  id: String,
  followers: [{ type: ObjectId, ref: Follower }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);