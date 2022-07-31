FROM node:18.7.0-alpine3.16

ENV NODE_ENV production
WORKDIR /app

COPY . .

CMD ["node", "."]
