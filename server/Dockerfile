FROM node:latest
WORKDIR /usr/src/app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 8888
CMD [ "npm", "run", "dev"]
