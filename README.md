# Server-Side Implementation of Secchat.Me
## A end-to-end encrypted Messaging System

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
For further information about response format, see API routes below.

```

### Database Model
![Database Model](./assets/data_model.png?raw=true "Database Model")



## API

### Routes

/login

/signup

/chats  

/chats/users
