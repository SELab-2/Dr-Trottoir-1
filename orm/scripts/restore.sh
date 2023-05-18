#!/bin/bash

echo "Restoring DB from backup"
echo "WARNING: this script will REMOVE all present data!"

read -p "DB username: " username

echo "Dropping current database"
dropdb -h localhost -p 5432 -U "$username" main --force

echo "Restoring database from backup file $1"
psql -h localhost -p 5432 -U "$username" -f "$1"
