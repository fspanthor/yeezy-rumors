#!/bin/bash

#set up postgres database
set -e
DB_USER=${1:-yeezy_dev_user}
DB_USER_PASS=${2:-password}
DB_NAME=${3:-yeezy_rumors_development}

psql postgres <<EOF
CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_USER_PASS';
ALTER ROLE $DB_USER CREATEDB;
EOF
echo "Postgres User '$DB_USER' created."

psql -d postgres -U $DB_USER <<EOF
CREATE DATABASE $DB_NAME;
EOF
echo "Postgres database '$DB_NAME' created."

psql -d $DB_NAME -U $DB_USER <<EOF
CREATE TABLE rumors (
ID SERIAL PRIMARY KEY,
rumor_content VARCHAR,
created_at TIMESTAMPTZ DEFAULT Now()
);
EOF
echo "Table 'rumors' created for '$DB_NAME'."

#create local development connection file
echo "const developmentDbConnection = () => {
  return {
    user: \"$DB_USER\",
    host: \"localhost\",
    database: \"$DB_NAME\",
    password: \"$DB_USER_PASS\",
    port: 5432,
  };
};

module.exports = {
  developmentDbConnection,
};
" > server/developmentDbConnection.js

echo "developmentDbConnection.js created."