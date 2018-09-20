'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ChatSchema = new Schema({
  sender: {
    type: String,
    required: 'Sender'
  },
  receiver: {
    type: String,
    required: 'Receiver'
  },
  enc_text: {
    type: String,
    required: 'encrypted message'
  },
  sent_date: {
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