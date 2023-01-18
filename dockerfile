FROM node:16-alpine as builder
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
RUN npm i -g pnpm
RUN pnpm install
COPY . .
RUN pnpm bundle

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/out .
ENV TZ=Asia/Shanghai
EXPOSE 7498