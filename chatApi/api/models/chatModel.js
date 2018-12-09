'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

import UserSchema from './userModel';

var ChatSchema = new Schema({
  user: [UserSchema],
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