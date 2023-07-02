#setup startup image
FROM node
WORKDIR /app

#setup this image
COPY ./package.json ./
RUN npm i @sbticketsproject/shared@latest
RUN npm i
COPY ./ ./

#startup commands
CMD ["npm", "start"]