#!/bin/sh

npm install concurrently --save
npm run install-yeezy-rumors

#set up database
source setupDb.sh