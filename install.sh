#!/bin/sh

#install dependencies
npm install concurrently --save
npm run install-yeezy-rumors

#set up database
source scripts/setupDb.sh