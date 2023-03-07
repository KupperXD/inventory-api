FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat \
    && apk add --no-cache openssl1.1-compat-dev
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY . .

RUN npm install --only=development \
    && npm run prisma:generate \
    && npm run build

FROM node:16-alpine as build
WORKDIR /app
RUN apk add --no-cache libc6-compat \
    && apk add --no-cache openssl1.1-compat-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN npm install --only=production \
    && npm run prisma:generate

COPY --from=builder /app/dist ./dist

EXPOSE 9090

CMD ["npm", "run", "start:migrate:prod"]
