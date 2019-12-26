FROM node:13-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN mkdir -p /data/sessions
RUN mkdir -p /data/persist-storage
VOLUME ["/data"]

EXPOSE 8080

CMD [ "node", "app.js" ]
