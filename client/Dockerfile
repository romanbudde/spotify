FROM node:18

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
# COPY package-lock.json /app
COPY . /app

RUN npm install

CMD ["npm", "start"]