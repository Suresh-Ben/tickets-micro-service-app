#setup startup image
FROM node
WORKDIR /app

#setup this image
COPY ./package.json ./
RUN npm i --omit=dev
COPY ./ ./

#startup commands
CMD ["npm", "start"]