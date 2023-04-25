#!/bin/bash

# exit 1 => Could not enter orm directory
# exit 2 => Could not enter mock directory

### update the DB schema ###
echo "Entering ORM directory"
cd ../orm || (echo >&2 "Could not enter the orm directory!" && exit 1)
# backup the .env if it exists
if [[ -f ".env" ]]; then
    echo "Backing up .env file"
    cp .env .env.bak
fi

echo "Installing new .env file"
cp ../server/developer.env .env

echo "$ npm install"
npm install

echo "$ prisma db push"
npx prisma db push

# load the mock data
echo "Entering API directory"
cd ../api || (echo >&2 "Could not enter the API directory!" && exit 2)

# backup the .env if it exists
if [[ -f ".env" ]]; then
    echo "Backing up .env file"
    cp .env .env.bak
fi

echo "Installing new .env file"
cp ../server/developer.env .env

echo "$ npm install"
npm install

echo "$ npm run mock"
npm run mock
