const mongoose = require('mongoose');

const FollowerSchema = new mongoose.Schema({
  uri: String,
  name: String,
  imageUrl: String,
  followersCount: Number,
  followingCount: Number
}, { timestamps: true });

module.exports = mongoose.model('Follower', FollowerSchema);