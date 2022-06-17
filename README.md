# yeezy-rumors  
All concurrently connected clients are notified of new rumors as they are posted and new rumors are added to ticker. You can filter by recent rumors and that is pretty much it..
  
**Local Install**  
You will need a local PostgreSQL server instance running to use this locally or do any meaningful development work.    

1. Install Postgres.app (https://postgresapp.com/)  
2. ```$ ./install.sh``` to install dependencies and set up local development database with default settings.      
If you want to customize your database connection use optional arguments:     
```$ ./install.sh <dbUserName> <dbPassword> <dbName>```

  
NOTE: If you get ```permission denied``` during install, update permissions with ```$ sudo chmod +x install.sh``` or solve it your own way or google it or whatever.  
  
**Development**  
```$ npm run devStart```  

I have no idea how you would do any of this on Windows.
  
**Tech stuff:**  
Client is HTML SCSS and JS. There is a webpack server for local development.  
Server side is an Express app being served by an http server. In production the Express app serves the static client build (built from webpack).  
This is set up to use a local Postgres server in development mode and in prod uses Heroku Postgres.   
  
Client and Server communicate via GraphQL.   
Socket.IO is used to notify concurrent user clients when new rumors are posted.  

***To use Socket.IO Admin UI:***  
Connect to: https://admin.socket.io/  
Server URL: http://localhost:4000/admin
  
![alt text](/fruitsnack.png)
