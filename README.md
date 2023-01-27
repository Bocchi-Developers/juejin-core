# 仿掘金官网后端

基于 NestJS 开发仿掘金站点后端

## 开发

```bash
$ pnpm i
$ pnpm dev
```

## 技术栈

- 语言：TypeScript
- 框架：NestJS
- 包管理器：pnpm
- 数据库：mongodb
- 代码风格：Eslint、Prettier
- 代码提交：Husky、Commitlint、lint-staged、cz-git、bump-version

## 部署

```
wget https://fastly.jsdelivr.net/gh/Bocchi-Developers/juejin-core@master/docker-compose.yml
wget https://fastly.jsdelivr.net/gh/Bocchi-Developers/juejin-core@master/.env.example -O .env
编辑 .env 文件
docker compose up -d
```