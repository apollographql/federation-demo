FROM node:10-alpine

WORKDIR /accounts

COPY package-lock.json .
COPY package.json .

RUN npm install

COPY source source
COPY tsconfig.json .

RUN npm run build

COPY entrypoint.sh .
