# yeezy-rumors  
  
**Local Install**  
```$ ./install.sh```  
  
**Development**  
```$ npm run devStart```  
  
**Tech stuff:**  
Client is HTML SCSS and JS. There is a webpack server for local development.  
Server side is an Express app being served by an http server. The Express app serves the static client build (built from webpack).  
DB is Postgres.   
  
Client and Server communicate via GraphQL.   
Socket.IO is used to notify concurrent user clients when new rumors are posted.  

***To use Socket.IO Admin UI:***  
Connect to https://admin.socket.io/  
Server URL: http://localhost:4000/admin
  
![alt text](https://github.com/[fspanthor]/[yeezy-rumors]/blob/[main]/fruitsnack.png?raw=true)
