FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build src
EXPOSE 3000
RUN yarn start
