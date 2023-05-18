#!/usr/bin/env bash

CURRENT_DATE=$(date +"%d-%m-%Y_%H-%M-%S")

echo "Backing up database schema"

# generate schema backup
read -p "DB username: " username
pg_dump --clean --create --column-inserts -h localhost -p 5432 -U "$username" -d main > "$CURRENT_DATE.sql"
echo "Database backup stored in $CURRENT_DATE.sql"
