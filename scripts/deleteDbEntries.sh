#!/bin/bash

set -e
DB_USER=${1:-yeezy_dev_user}
DB_NAME=${2:-yeezy_rumors_development}

psql -d $DB_NAME -U $DB_USER <<EOF
TRUNCATE TABLE rumors;
EOF
echo "OK"