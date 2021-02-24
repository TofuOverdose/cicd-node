FROM node:14.16-alpine3.10

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 9000
CMD ["npm", "run", "start"]

