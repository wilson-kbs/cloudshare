## DEVELOPMENT
FROM node:15.8
LABEL app_name=kabaliserv_cloudshare
LABEL stage=dev
WORKDIR /usr/src/app
RUN apt-get update -y
RUN apt-get remove -y gyp
RUN apt-get install -y curl bzip2 build-essential g++ python git make gcc gcc-multilib node-gyp
RUN apt-get install -y pkg-config xserver-xorg-dev libxext-dev pkg-config libxi-dev libglu1-mesa-dev libglew-dev
RUN npm install prebuild-install node-pre-gyp node-gyp -g
VOLUME [ "/usr/src/app/node_modules" ]
EXPOSE 3000
EXPOSE 9000
CMD [ "sh", "./startapp.sh" ]
