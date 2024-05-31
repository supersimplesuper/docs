FROM node:20

ENV APP_HOME=/usr/src/app \
    PATH="${PATH}:/usr/src/app/node_modules/.bin"

WORKDIR $APP_HOME

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

COPY ./docs ./docs

RUN npm run docs:build

CMD npm run docs:dev