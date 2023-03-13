# build frontend
FROM node:19-alpine3.16 AS build
WORKDIR /build

COPY package*.json /build/
RUN ["npm", "ci"]
RUN ["npm", "run", "build"]

# run it in production
FROM node:19-alpine3.16 AS production
WORKDIR /frontend
COPY --from=build /build/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]


