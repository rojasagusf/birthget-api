FROM node:18-alpine

RUN apk add --update git && rm -rf /tmp/* /var/cache/apk/*
RUN npm config set registry http://registry.npmjs.org && npm cache clean --force
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --unsafe-perm && npm cache clean --force
COPY . /usr/src/app
RUN npm run build
COPY lib/utils/mail-templates/email-validation.html /usr/src/app/dist/lib/utils/mail-templates/
RUN rm -rf .env && cp .env.defaults .env

CMD ["npm","run", "builded-start"]
