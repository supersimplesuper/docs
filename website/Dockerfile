FROM node:24-alpine3.20

ENV APP_HOME=/usr/src/app \
    PATH="${PATH}:/usr/src/app/node_modules/.bin"

WORKDIR $APP_HOME

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

COPY ./docs ./docs
COPY ./superapi_to_postman ./superapi_to_postman

RUN npm run docs:build
RUN npm run docs:postman_collection

CMD npm run docs:dev