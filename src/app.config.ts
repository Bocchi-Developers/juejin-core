import { argv } from 'zx-cjs'

export const PORT = 7498
export const API_VERSION = 1

export const CROSS_DOMAIN = {
  allowedOrigins: argv.allowed_origins
    ? argv.allowed_origins?.split?.(',')
    : ['juejin.suemor.com', 'localhost', '127.0.0.1', '.*dev'],
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
export const QINIU_SECRET = {
  qn_host: argv.qn_host || process.env.QN_HOST,
  qn_scope: argv.qn_scope || process.env.QN_SCOPE,
  qn_ak: argv.qn_ak || process.env.QN_AK,
  qn_sk: argv.qn_sk || process.env.QN_SK,
}
