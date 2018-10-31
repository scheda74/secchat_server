'use strict';

const UserData = require('../models/userModel');

var mongoose = require('mongoose'),
  Chat = mongoose.model('Chats'),
  User = mongoose.model('Users');

exports.list_all_messages = function(req, res) {
Chat.find({}, function(err, msg) {
    if (err) {
        res.send(err);
    }
    res.json(msg);
})
};

exports.send_a_message = function(req, res) {
    console.log(req.params.userId);
    var new_msg = new Chat(req.body)
    new_msg.save(function(err, msg) {
    if(err) {
        res.send(err);
    }
    res.json(msg);
    });
}

exports.get_a_chat = function(req, res) {
    //console.log(req.params.userId);
    User.findById(req.params.userId, function(err, usr) {
        //res.json(usr);
        if(err) {
            res.send(err)
        }
        Chat.find({ $or: [{ sender: usr.email }, { receiver: usr.email }] }, function(err, messages) {
            if(err) return res.status(500).send(err);
            if(messages !== null) res.status(200).send(messages);
        });
        //res.json(messages)
    }).catch((err) => console.log(err));
}

exports.login = function(req, res) {
    User.findOne({email: req.body.email}, function(err, usr) {
        if(err) {
            res.send(err);
        } else if(usr === null) {
            return res.status(500).send({email: req.params.email + ' does not exist'});
        }
        if(req.body.password === usr.password) {
            return res.send('authentication successfull!');
        }
        res.json(usr);
    }).catch((err) => console.log(err));
}

exports.create_user = function(req, res) {
    var newUser = new User(req.body);
    // console.log(req.body);
    newUser.save(function(err, createdUser) {
        if(err) 
            return res.send(err);
        res.status(200).send(createdUser);
    });
}