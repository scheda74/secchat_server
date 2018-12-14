# Server-Side Implementation of Secchat.Me
> A end-to-end encrypted Messaging System

## Design
### Server Design

![Server Design](./assets/server_architecture_design.png?raw=true "Database Model")

Requests made by clients are firstly handled by Nginx Reverse Proxy. Its purpose is to forward all HTTPS (port 443) traffic to the Node.js RESTful API. 
All API calls will be checked for a valid JSON Web Token (JWT) or a new JWT is being created and sent back to the client upon login or sign up.
API calls then query the database in order to fetch the required data. 

Server responses are in JSON format and contain at least the following attributes:
```
{
    success: true/false,
    log: String
    ...
}
```

For further information about response format, see API routes below.


### Database Model
![Database Model](./assets/data_model.png?raw=true "Database Model")

The database stores user data and chats between two users. (A group chat feature will be implemented in future releases). See above tables for specific table attributes.


## API Documentation

All requests are handled by routes.

```javascript
// chatRoutes.js

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
```

Above code shows how requests are handled. Important to note is, that sensitive requests are handled first by the verifyToken() method. Hence, clients have to provide a web token which can be obtained by logging in or signing up for the service.

## Routes: Client Request & Server Response Format

### Login - https://www.secchat.me/login

#### .POST - login()
```
Client Request
{
    email: String
    password: String
}

Server Response
{
    success: true/false,
    user: [User Object],
    token: String,
    message: String
}
```

### Sign Up - https://www.secchat.me/signup

#### .POST - create_a_user()
```
Client Request
{
    name: String,
    email: String,
    password: String
}

Server Response
{
    success: true/false,
    user: [User Object],
    token: String,
    message: String
}
```

### Chats - https://www.secchat.me/chats

#### .POST - send_a_message()
```
Client Request
{
    token: String,
    user: [User Object],
    sender: String,
    receiver: String,
    data: [ Data Object {
        iv: String,
        keys: String, 
        cipher: String,
        tag: String
        } ]
}

Server Response
{
    success: true/false,
    msg: Chat Object,
    log: String
}
```

#### .GET - get_a_chat()
```
Client Request
{
    token: String
}

Server Response
{
    success: true/false,
    chat: [Chat Object],
    log: String
}
```

### Users - https://www.secchat.me/chats/users

#### .GET - get_available_users()
```
Client Request
{
    token: String
}

Server Response
{
    success: true/false,
    available: [User Object]
}
```
