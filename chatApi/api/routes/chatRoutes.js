'use strict';
module.exports = function(app) {
  var chat = require('../controllers/chatController');

  // todoList Routes
  app.route('/usr/messages')
    .get(chat.get_all_messages)
    .post(chat.send_a_message);


  app.route('/usr/messages/:taskId')
    .get(chat.read_a_message)
    // .put(chat.update_a_message) // is this even possible?
    .delete(chat.delete_a_message); // only in DB not at client - this can be implemented tho
};