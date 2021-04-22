## DEVELOPMENT
FROM node:15.4.0 AS dev
LABEL app_name=kabaliserv_cloudshare
LABEL stage=dev
WORKDIR /usr/src/app
EXPOSE 3000
EXPOSE 9000
CMD [ "sh", "./startapp.sh" ]

## PRODUCTION
FROM node:lts-alpine3.13 AS metadata-service_builder
LABEL app_name=kabaliserv_cloudshare
LABEL stage=builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine3.13 AS prod
ARG VERSION
LABEL app_name=kabaliserv_cloudshare
LABEL stage=prod
LABEL version=${VERSION}
WORKDIR /usr/src/app
COPY package*.json ./
COPY protos ./protos
COPY --from=metadata-service_builder /usr/src/app/dist ./dist
VOLUME [ "/usr/src/app/node_modules" ]
EXPOSE 3000
EXPOSE 9000
CMD ["sh", "-c", "npm install ; node dist/main"]