# yeezy-rumors

All concurrently connected clients are notified of new rumors as they are posted and new rumors are added to ticker. You can filter by recent rumors and that is pretty much it..

**Local Install**  
You will need a local PostgreSQL server instance running to use this locally or do any meaningful development work.

1. `$ brew install postgresql` to install postgres.  
2. ```$ brew services start postgresql``` to start up postgres.
3. `$ ./install.sh` to install dependencies and set up local development database with default settings.  
   If you want to customize your database connection use optional arguments:  
   `$ ./install.sh <dbUserName> <dbPassword> <dbName>`

NOTE: If you get `permission denied` during install, update permissions with `$ sudo chmod +x install.sh` and try again. Or solve it your own way or google it or whatever.

**Development**  
`$ npm run devStart`

I have no idea how you would do any of this on Windows.

**Tech stuff:**  
Client is HTML SCSS and JS. There is a webpack server for local development.  
Server side is an Express app being served by an http server. In production the Express app serves the static client build (built from webpack).  
This is set up to use a local Postgres server in development mode and in ~~prod uses Heroku Postgres~~ Railway.app Postgres. Deployment is achieved with docker and Railway.app. 

Client and Server communicate via GraphQL.  
Socket.IO is used to notify concurrent user clients when new rumors are posted.

**_To use Socket.IO Admin UI:_**  
Connect to: https://admin.socket.io/  
Server URL: http://localhost:4000/admin

**_To remove local db entries:_**  
`$ deleteDbEntries.sh` (in /scripts) is a convenience wrapper for TRUNCATE TABLE

![alt text](/fruitsnack.png)
