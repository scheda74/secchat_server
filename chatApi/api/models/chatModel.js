'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userModel = {
  name: {
    type: String,
    required: 'user name'
  },
  email: {
    type: String,
    required: 'email'
  },
  password: {
    type: String,
    required: 'password'
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
}

var dataModel = {
    keys: {
      type: String,
      required: 'keys'
    },
    cipher: {
      type: String,
      required: 'cipher'
    },
    tag: {
      type: String,
      required: 'tag'
    }
}

var ChatSchema = new Schema({
  user: [userModel],
  sender: {
    type: String,
    required: 'Sender'
  },
  receiver: {
    type: String,
    required: 'Receiver'
  },
  data: [dataModel],
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