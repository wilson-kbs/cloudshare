## DEVELOPMENT
FROM node:15.4.0 AS dev

WORKDIR /usr/src/app

EXPOSE 3000
EXPOSE 9000
CMD [ "sh", "./startapp.sh" ]

## PRODUCTION
FROM node:lts-alpine3.13 AS metadata-service_builder
LABEL stage=builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine3.13 AS prod

WORKDIR /usr/src/app

COPY package*.json ./
COPY protos ./protos
RUN npm install
COPY --from=metadata-service_builder /usr/src/app/dist ./dist

EXPOSE 3000
EXPOSE 9000

CMD ["node", "dist/main"]