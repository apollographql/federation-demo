FROM node:10-alpine AS build

ARG GATEWAY_HOST

ENV GATEWAY_HOST=$GATEWAY_HOST

WORKDIR /web-app

COPY package-lock.json .
COPY package.json .

RUN npm install

COPY source source
COPY babel.config.js .
COPY webpack.config.js .

RUN npm run build

FROM nginx:stable

EXPOSE 80

WORKDIR /web-app

COPY --from=build /web-app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
