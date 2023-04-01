FROM node:19-alpine3.16 AS build
WORKDIR /build

COPY package*.json /build/
COPY .npmrc /build/.npmrc

RUN npm ci && rm -f .npmrc

COPY . .
RUN npm run build

FROM node:19-alpine3.16 AS production
WORKDIR /prod
COPY --from=build /build/dist ./dist/
COPY .npmrc .npmrc

COPY package*.json ./
RUN npm ci --omit=dev

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
