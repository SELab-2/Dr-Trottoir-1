FROM node:19-alpine3.16 AS build
WORKDIR /build

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

COPY package*.json /build/
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npx tsc

FROM node:19-alpine3.16 AS production
WORKDIR /app
COPY --from=build /build/dist ./dist/

COPY package*.json ./
RUN npm ci --omit=dev

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY prisma prisma
RUN npx prisma generate
EXPOSE 8080

HEALTHCHECK --interval=5m --timeout=2m --start-period=45s \
    CMD curl -f --retry 6 --max-time 5 --retry-delay 10 --retry-max-time 60 "https://hc-ping.com/371a0724-68d3-4ae8-91d8-e6185a65b61b" \
    || bash -c 'kill -s 15 -1 && (sleep 10; kill -s 9 -1)'

ENTRYPOINT ["npm", "run", "start"]
