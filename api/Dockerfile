FROM node:19-alpine3.16 AS build
WORKDIR /build

ENV OUTPUT_DIRECTORY="node_modules/.prisma/client"

COPY package*.json /build/
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npx tsc

FROM node:19-alpine3.16 AS production
WORKDIR /app
COPY --from=build /build/dist .

COPY package*.json .
RUN npm ci --production

ENTRYPOINT npm start
