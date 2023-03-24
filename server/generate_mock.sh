#!/bin/bash

# exit 1 => Could not enter orm directory
# exit 2 => Could not enter mock directory

# set the DB schema
cd ../orm || exit 1
# backup the .env if it exists
if [[ -f ".env" ]]; then
    cp .env .env.bak
fi

cp ../server/developer.env .env
npm install
npx prisma db push

# load the mock data
cd ../mock || exit 2
# backup the .env if it exists
if [[ -f ".env" ]]; then
    cp .env .env.bak
fi
npm install
npm run start
