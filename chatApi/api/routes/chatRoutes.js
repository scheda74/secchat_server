'use strict';
module.exports = function(app) {
  var chat = require('../controllers/chatController');

  // todoList Routes
  app.route('/chats/messages')
    .get(chat.list_all_messages, (err) => {})
    .post(chat.send_a_message, (err) => {});


  app.route('/chats/:chatId')
    .get(chat.get_a_chat, (err) => {})
    // .put(chat.update_a_message) // is this even possible?
    //.delete(chat.delete_a_message, (err) => {}); // only in DB not at client - this can be implemented tho
};