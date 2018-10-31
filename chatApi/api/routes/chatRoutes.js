'use strict';

module.exports = function(app) {
  var chat = require('../controllers/chatController');

  // chat Routes
  app.route('/chats')
    .get(chat.list_all_messages, (err) => {});


  app.route('/chats/:userId')
    .get(chat.get_a_chat, (err) => {})
    .post(chat.send_a_message, (err) => {});
    // .put(chat.update_a_message) // is this even possible?
    //.delete(chat.delete_a_message, (err) => {}); // only in DB not at client - this can be implemented tho

  app.route('/login')
    .post(chat.login, (err) => {});

  app.route('/signup')
    .post(chat.create_user, (err) => {});
};