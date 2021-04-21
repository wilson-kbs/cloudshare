## PRODUCTION
FROM node:lts-alpine as web-ui_builder
LABEL stage=builder
ARG TITLE
ARG API_URL
ARG API_BASEPATH
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VUE_APP_TITLE ${TITLE}
ENV VUE_APP_API_URL ${API_URL}
ENV VUE_APP_API_BASEPATH ${API_BASEPATH} 
RUN npm run build


FROM nginx:stable-alpine as prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=web-ui_builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
