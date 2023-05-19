#!/usr/bin/env bash
# variables
CURRENT_DATE=$(date +"%d-%m-%Y_%H-%M-%S")
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="main"

function help() {
        echo "Usage: backup.sh (-h hostname) (-p port) (-d database_name)"
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

echo "Backing up database $DB_NAME"
# generate schema backup
read -rp "DB username: " username
if pg_dump --clean --create --column-inserts -h "$DB_HOST" -p "$DB_PORT" -U "$username" -d "$DB_NAME" > "$CURRENT_DATE.sql"; then
        echo "Database backup stored in $CURRENT_DATE.sql"
fi
