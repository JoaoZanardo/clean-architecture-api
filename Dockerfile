FROM node:18-alpine
ENV MONGO_URL='mongodb://mongo:27017/ca-api'
ENV MONGO_TEST_URL='mongodb://mongo:27017/ca-api-tests'
ENV TOKEN_SECRET='SECRET'
WORKDIR /api
COPY package*.json ./
RUN npm install --production
COPY ./dist ./dist
EXPOSE 3000
CMD ["npm", "start"]