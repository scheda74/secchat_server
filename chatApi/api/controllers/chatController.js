'use strict';


var mongoose = require('mongoose'),
  Chat = mongoose.model('Chats');

exports.list_all_messages = function(req, res) {
Chat.find({}, function(err, msg) {
    if (err) {
        res.send(err);
    }
    res.json(msg);
}).catch((err) => console.log(err));
};

exports.send_a_message = function(req, res) {
    var new_msg = new Chat(req.body)
    new_msg.save(function(err, msg) {
    if(err) {
        res.send(err);
    }
    res.json(msg);
    }).catch((err) => console.log(err));
}

exports.get_a_chat = function(req, res) {
    Chat.findById(req.params.chatId, function(err, messages) {
        if(err)
        res.send(err)
        res.json(messages)
    }).catch((err) => console.log(err));
}