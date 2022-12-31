FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN yarn build
EXPOSE 3000
RUN yarn start
