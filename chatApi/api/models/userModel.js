'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  email: {
    type: String,
    required: 'user name'
  },
  password: {
    type: String,
    required: 'password'
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', UserSchema);