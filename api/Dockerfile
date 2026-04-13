FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install --omit=dev

COPY . .

EXPOSE 3001

ENV MODE=api

CMD ["node", "index.js"]
