FROM node:15.4.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# COPY package.json ./
# RUN npm install

#COPY startapp.sh .

EXPOSE 3000
EXPOSE 9000
CMD [ "sh", "./startapp.sh" ]
