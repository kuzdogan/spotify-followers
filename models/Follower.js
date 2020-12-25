const mongoose = require('mongoose');

const FollowerSchema = new mongoose.Schema({
  uri: String,
  name: String,
  imageURL: String,
  followersCount: Number,
  followingCount: Number
}, { timestamps: true });

module.exports = mongoose.model('Follower', FollowerSchema);