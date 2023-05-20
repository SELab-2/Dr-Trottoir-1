#!/bin/bash

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="main"

function help() {
        echo "Usage: restore.sh (-h hostname) (-p port) (-d db_name) backup_file"
        exit 1
}

while getopts ":h:p:d:" opt; do
        case "$opt" in
                h) DB_HOST="$OPTARG" ;;
                p) DB_PORT="$OPTARG" ;;
                d) DB_NAME="$OPTARG" ;;
                \?) help ;;
        esac
done

shift "$((OPTIND-1))"

if [ -z "$1" ]; then
        echo "Backup file must be provided"
        exit 1
fi


echo "Restoring DB from backup"
echo "WARNING: this script will REMOVE all present data!"

read -rp "DB username: " USERNAME

echo "Dropping current database"
if dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$USERNAME" "$DB_NAME" --force; then
        echo "Restoring database from backup file $1"
else
        echo "Unable to drop current database"
fi

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$USERNAME" -f "$1" > /dev/null 2>&1; then
        echo "Database restored"
else
        echo "Was unable to restore from file $1"
fi
