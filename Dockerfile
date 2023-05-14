FROM node:19-bullseye AS orm_build
WORKDIR /build/orm

# Dependencies
COPY orm/package*.json ./
RUN npm install

# Generate artifacts
COPY orm ./
RUN npx prisma generate

FROM node:19-bullseye AS api_build
WORKDIR /build/api

# Dependencies
COPY api/package*.json ./
RUN npm install

# Retrieve artifacts
COPY --from=orm_build /build/orm/package*.json /build/orm/
COPY --from=orm_build /build/orm/dist/ /build/orm/dist/

# Generate artifacts
COPY api ./
RUN npm run build

FROM node:19-bullseye AS api_query_build
WORKDIR /build/api_query

# Dependencies
COPY api_query/package*.json ./
RUN npm install

# Retrieve artifacts
COPY --from=orm_build /build/orm/package*.json /build/orm/
COPY --from=orm_build /build/orm/dist/ /build/orm/dist/

# Generate artifacts
COPY api_query ./
RUN npm run build

FROM node:19-bullseye AS api_production
WORKDIR /build/api

# Dependencies
COPY --from=api_build /build/api/package*.json ./
RUN npm install --omit=dev

# Retrieve artifacts
COPY --from=api_build /build/orm/package*.json /build/orm/
COPY --from=api_build /build/orm/dist/ /build/orm/dist/

COPY --from=api_build /build/api/dist/ /build/api/dist/src

# Initialize server
EXPOSE 8080
ENTRYPOINT npm run start

FROM node:19-bullseye AS web_build
ARG VUE_APP_API_SERVER_ADDRESS
WORKDIR /build/web

# Dependencies
COPY web/package*.json ./
RUN npm install --omit=optional

# Retrieve artifacts
COPY --from=orm_build /build/orm/package*.json /build/orm/
COPY --from=orm_build /build/orm/dist/ /build/orm/dist/

COPY --from=api_query_build /build/api_query /build/api_query/
COPY --from=api_query_build /build/api_query/dist/ /build/api_query/dist/

# Generate artifacts
COPY web ./
RUN npm run build

FROM nginx:alpine as web_production
WORKDIR /usr/share/nginx/html

# Remove default assets
RUN rm -rf ./*

# Copy artifacts
COPY --from=web_build /build/web/dist ./

ENTRYPOINT ["nginx", "-g", "daemon off;"]
