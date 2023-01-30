import { argv } from 'zx-cjs'

export const PORT = 7498
export const API_VERSION = 1

export const CROSS_DOMAIN = {
  allowedOrigins: ['suemor.com', 'localhost', '127.0.0.1', '.*dev'],
}

export const MONGO_DB = {
  dbName: 'juejin',
  host: argv.db_host || '127.0.0.1',
  port: 27017,
  get uri() {
    return `mongodb://${this.host}:${this.port}/${this.dbName}`
  },
}

export const AXIOS_CONFIG = {
  timeout: 10000,
}

export const SECURITY = {
  jwtSecret: 'juejin',
  jwtExpire: '30d',
}

// 七牛云
export const QNY = {
  QN_HOST: process.env.QN_HOST,
  QN_SCOPE: process.env.QN_SCOPE,
  QN_AK: process.env.QN_AK,
  QN_SK: process.env.QN_SK,
}
