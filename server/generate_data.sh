#!/bin/bash

# exit 1 => Could not enter orm directory
# exit 2 => Could not enter mock directory

### update the DB schema ###
echo "Entering ORM directory"
cd ../orm || (echo >&2 "Could not enter the orm directory!" && exit 1)
echo "$ npm install"
npm install

echo "$ prisma db push"
npx prisma db push

# load the mock data
echo "Entering API directory"
cd ../api || (echo >&2 "Could not enter the API directory!" && exit 2)

echo "$ npm install"
npm install

echo "$ npm run mock"
npm run mock
