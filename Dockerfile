FROM node:14.16-alpine3.10

COPY package*.json .

RUN npm install

WORKDIR /app
COPY . /app

EXPOSE 9000
CMD ["npm", "run", "start"]

