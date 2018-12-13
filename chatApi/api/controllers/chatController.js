'use strict';

const UserData = require('../models/userModel');

var mongoose = require('mongoose'),
  Chat = mongoose.model('Chats'),
  User = mongoose.model('Users'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');


exports.verifyToken = function(req, res, next) {
    var token = req.body.token || req.params.token || req.headers['x-access-token'];
    if(token) {
        // create a token using the servers secret & match it with provided token
        jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
            if(err) {
                return res.json({ success: false, message: 'Failed to authenticate token ' + err})
            }
            req.decoded = decoded;
            next();
        });
    } else {
        return res.status(403).send({ success: false, message: 'No token provided!'})
    }
}

exports.send_a_message = function(req, res) {
    User.findById(req.decoded.userId, function(err, usr) {
        if(err) return res.send(err);
        if(!usr) {
            return res.status(403).send({ success: false, message: 'User authentication failed'});
        } else {
            var new_msg = new Chat({ 
                user: [usr], 
                sender: usr.email,
                receiver: req.body.receiver, 
                data: [{ iv: req.body.iv, keys: req.body.keys, cipher: req.body.cipher, tag: req.body.tag }] 
            });
            new_msg.save(function(err, msg) {
                if(err) return res.send({ success: false, log: err });
                return res.send({ success: true, msg: msg, log: 'Message saved to database' });
            });
        }
    });  
}

exports.get_available_users = function(req, res) {
    User.find({}, function(err, users) {
        if(err) return res.send({success: false, msg_enc: err.message});
        Object.keys(users).map((key) => {
            users[key]['password'] = '';
        });
        return res.json({success: true, available: users});
    });
}

exports.get_a_chat = function(req, res) {
    User.findById(req.decoded.userId, function(err, usr) {
        if(err) res.send({success: false, log: err})
        
        if(!usr) {
            res.status(403).send({success: false, log: 'User authentication failed'});
        } else {
            var receiver = req.headers['receiver'];
            Chat.find({ 
                $or: [{$and: [{ sender: usr.email }, { receiver: receiver }]}, {$and: [{ sender: receiver }, { receiver: usr.email }]} ] }, function(err, messages) {
                if(err) return res.status(500).send({success: false, log: 'error: ' + err});
                return res.status(200).send({success: true, chat: messages, log: 'chat sent!'});
            });
        }
    }).catch((err) => res.send({success: false, log: err}));
}

exports.login = function(req, res) {
    User.findOne({email: req.body.email}, function(err, usr) {
        if(err) {
            res.send({success: false, message: err});
        }
        if(!usr) {
            return res.status(500).send({
                success: false,
                email: req.body.email, 
                message: 'user does not exist',
            });
        } else {
            bcrypt.compare(req.body.password, usr.password, function(err, result) {
                if(err) return res.send('error: ' + err);
                if(result) {
                    const payload = { userId: usr._id };
                    var token = jwt.sign(payload, req.app.get('superSecret'), {
                        expiresIn : 86400000
                    });
                    return res.status(200).send({
                        success: true,
                        message: 'token created',
                        token: token,
                        user: usr
                    });
                } else {
                    res.status(403).send({ success: false, message: 'Wrong password entered!' });
                }
            });
        }
    }).catch((err) => console.log(err));
}

exports.create_user = function(req, res) {
    User.find({ email: req.body.email }, function(err, usr) {
        if(err) return res.send(err);
        // console.log(usr.length);
        if(usr.length !== 0) {
            return res.status(403).send({ success: false, message: 'User already exists' });
        } else {
            const payload = { userId: usr._id };
            var token = jwt.sign(payload, req.app.get('superSecret'), {
                expiresIn : 86400000
            });
            bcrypt.hash(req.body.password, req.app.get('saltRounds'), function(err, hash) {
                if(err) return res.send({ success: false, message: 'Error in hashing password: ' + err});
                // console.log(hash);
                var newUser = new User({ name: req.body.name , email: req.body.email, password: hash });
                newUser.save(function(err, createdUser) {
                    //console.log(createdUser);
                    if(err) 
                        return res.send({ success: false, message: 'Error in saving user to database ' + err });
                    return res.status(200).send({
                        success: true,
                        message: 'User successfully created',
                        token: token,
                        user: createdUser
                    });
                });
            });
        }
    });
    
}