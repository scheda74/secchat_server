'use strict';

module.exports = function(app) {
  var chat = require('../controllers/chatController');

  app
    .get('/chats', chat.verifyToken, chat.get_a_chat)
    .get('/chats/users', chat.verifyToken, chat.get_available_users)
    .post('/chats', chat.verifyToken, chat.send_a_message);

  app.route('/login')
    .post(chat.login, (err) => {});

  app.route('/signup')
    .post(chat.create_user, (err) => {});
};