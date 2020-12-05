FROM node:15.3-alpine3.10

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
RUN npm install
COPY tsconfig.json src ./

CMD npm start