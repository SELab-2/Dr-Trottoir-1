FROM node:19-alpine3.16 AS build
WORKDIR /build

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ARG NPM_TOKEN

COPY package*.json /build/
COPY .npmrc /build/.npmrc

RUN npm ci && rm -f .npmrc

COPY . .
RUN npx prisma generate
RUN npx tsc

FROM node:19-alpine3.16 AS production
WORKDIR /app
COPY --from=build /build/dist ./dist/
COPY .npmrc .npmrc

COPY package*.json ./
RUN npm ci --omit=dev

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY prisma prisma
RUN npx prisma generate
EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]
