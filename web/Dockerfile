# build frontend
FROM node:19-alpine3.16 AS build
WORKDIR /build

COPY package*.json /build/
RUN ["npm", "install"]
RUN ["npm", "run", "build"]
ENTRYPOINT ["npm", "run", "preview"]


# run it in production
#FROM node:19-alpine3.16 AS production
#WORKDIR /frontend
#COPY --from=build /build/dist ./dist
#COPY package*.json ./

#RUN ["npm", "ci", "--omit=dev"]

#EXPOSE 3000

#RUN ["npm", "run", "dev"]
