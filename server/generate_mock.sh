#!/bin/bash

# exit 1 => Could not enter orm directory
# exit 2 => Could not enter mock directory

ONLY_SCHEMA=0

while getopts ":s" option; do
    case $option in
    s) # only set up schema
        ONLY_SCHEMA=1 ;;
    *) ;;

    esac
done

# set the DB schema
cd ../orm || (echo >&2 "Could not enter the orm directory!" && exit 1)

# backup the .env if it exists
if [[ -f ".env" ]]; then
    cp .env .env.bak
fi

cp ../server/developer.env .env
npm install
npx prisma db push

if [ $ONLY_SCHEMA -eq 1 ]; then
    exit 0
fi

# load the mock data
cd ../mock || (echo >&2 "Could not enter the mock directory!" && exit 2)
# backup the .env if it exists
if [[ -f ".env" ]]; then
    cp .env .env.bak
fi
npm install
npm run start
