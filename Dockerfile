FROM node:18.12.1-alpine3.16

ENV NODE_ENV production
WORKDIR /app

COPY . .

CMD ["node", "."]
