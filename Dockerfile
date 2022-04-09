FROM node:16.14.2-alpine3.14

ENV NODE_ENV production
WORKDIR /app

COPY . .

CMD ["node", "."]
