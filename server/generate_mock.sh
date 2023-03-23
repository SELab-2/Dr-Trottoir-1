#!/bin/bash

# set the DB schema
cd ../orm
npm install
npx prisma db push

cd ../mock
npm install
npm run start
