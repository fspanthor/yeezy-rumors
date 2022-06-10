# yeezy-rumors  
Post rumors.  
  
Tech stuff:  
Client is HTML SCSS and JS. There is a webpack server for local development.  
Server side is an Express app being served by an http server. The Express app serves the static client build (built from webpack).  
DB is Postgres.  
  
  
Client and Server communicate via GraphQL.  
Socket.IO is used to notify concurrent user clients when new rumors are posted.
