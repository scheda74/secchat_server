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

exports.list_all_messages = function(req, res) {
Chat.find({}, function(err, msg) {
    if (err) {
        res.send(err);
    }
    res.json(msg);
})
};


exports.send_a_message = function(req, res) {
    //console.log(req.params.userId);
    User.findById(req.decoded.userId, function(err, usr) {
        if(err) return res.send(err);
        if(!usr) {
            return res.status(403).send({ success: false, message: 'User authentication failed'});
        } else {
            var new_msg = new Chat({ sender: usr.email, receiver: req.body.receiver, enc_text: req.body.enc_text });
            // console.log(new_msg)
            new_msg.save(function(err, msg) {
            if(err) {
                res.send(err);
            }
            return res.json(msg);
        });
        }
    });  
}

exports.get_a_chat = function(req, res) {
    console.log(req.decoded.userId);
    User.findById(req.decoded.userId, function(err, usr) {
        //res.json(usr);
        if(err) {
            res.send(err)
        }
        if(!usr) {
            return res.status(403).send({success: false, message: 'User authentication failed'});
        } else {
            Chat.find({ $or: [{ sender: usr.email }, { receiver: usr.email }] }, function(err, messages) {
                if(err) return res.status(500).send(err);
                if(messages !== null) res.status(200).send(messages);
            });
        }
        
        //res.json(messages)
    }).catch((err) => console.log(err));
}

exports.login = function(req, res) {
    User.findOne({email: req.body.email}, function(err, usr) {
        if(err) {
            res.send(err);
        }
        if(!usr) {
            return res.status(500).send({email: req.body.email + ' does not exist'});
        } else {
            bcrypt.compare(req.body.password, usr.password, function(err, result) {
                if(err) return res.send('error: ' + err);
                if(result) {
                    const payload = { userId: usr._id };
                    var token = jwt.sign(payload, req.app.get('superSecret'), {
                        expiresIn : 86400000
                    });
                    return res.json({
                        success: true,
                        message: 'token created',
                        token: token
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
            bcrypt.hash(req.body.password, req.app.get('saltRounds'), function(err, hash) {
                if(err) return res.send({ success: false, message: 'Error in hashing password: ' + err});
                console.log(hash);
                var newUser = new User({ email: req.body.email, password: hash });
                newUser.save(function(err, createdUser) {
                    if(err) 
                        return res.send(err);
                    return res.status(200).send(createdUser);
                });
            });
        }
    });
    
}