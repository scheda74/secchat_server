'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./api/models/userModel');

var ChatSchema = new Schema({
  user: {
    type: User,
    required: 'User'
  },
  receiver: {
    type: String,
    required: 'Receiver'
  },
  text: {
    type: String,
    required: 'encrypted message'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Chats', ChatSchema);