FROM node:19-alpine3.16 AS build
WORKDIR /build
ARG NPM_AUTH_TOKEN

COPY package*.json /build/
COPY .npmrc /build/.npmrc

RUN npm install

COPY . .
RUN npm run build

FROM node:19-alpine3.16 AS production
WORKDIR /prod
ARG NPM_AUTH_TOKEN

COPY --from=build /build/dist ./dist/
COPY .npmrc .npmrc

COPY package*.json ./
RUN npm ci --omit=dev

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
