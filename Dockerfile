FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl1.1-compat-dev

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:16-alpine as build

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma


EXPOSE 9090

CMD ["npm", "run", "start:migrate:prod"]
