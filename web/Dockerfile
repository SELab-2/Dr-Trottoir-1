# build frontend
FROM node:19-alpine3.16 AS build
WORKDIR /build
ARG NPM_AUTH_TOKEN

COPY package*.json /build/
COPY .npmrc /build/.npmrc

RUN npm install

COPY . .
RUN npm run build


# run it in production
FROM node:19-alpine3.16 AS production
WORKDIR /frontend
ARG NPM_AUTH_TOKEN

COPY --from=build /build/dist ./dist
COPY package*.json ./
COPY .npmrc /build/.npmrc

RUN ["npm", "ci", "--omit=dev"]

EXPOSE 3000

CMD ["npm", "run", "preview"]
