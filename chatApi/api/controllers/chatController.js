'use strict';


var mongoose = require('mongoose'),
  Chat = mongoose.model('Chats');

  exports.list_all_messages = function(req, res) {
    Chat.find({}, function(err, msg) {
      if (err)
        res.send(err);
      res.json(msg);
    });
  };

  exports.send_a_message = function(req, res) {
      var new_msg = new Chat(req.body)
      new_msg.save(function(err, msg) {
        if(err)
            res.send(err);
        res.json(msg);
      })
  }

  // exports.get_a_message = function()