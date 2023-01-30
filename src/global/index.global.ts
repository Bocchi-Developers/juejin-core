/* eslint-disable import/order */
import cluster from 'cluster'
import dotenv from 'dotenv'
import { mkdirSync } from 'fs'

import 'zx-cjs/globals'

import { Logger } from '@nestjs/common'

import {
  DATA_DIR,
  LOG_DIR,
  STATIC_FILE_DIR,
  TEMP_DIR,
  THEME_DIR,
  USER_ASSET_DIR,
} from '~/constants/path.constant'

import { consola, registerStdLogger } from './consola.global'

import './dayjs.global'

import { cwd, isDev } from './env.global'
import { registerJSONGlobal } from './json.global'

// 建立目录
function mkdirs() {
  if (cluster.isPrimary) {
    mkdirSync(DATA_DIR, { recursive: true })
    Logger.log(chalk.blue(`数据目录已经建好：${DATA_DIR}`))
    mkdirSync(TEMP_DIR, { recursive: true })
    Logger.log(chalk.blue(`临时目录已经建好：${TEMP_DIR}`))
    mkdirSync(LOG_DIR, { recursive: true })
    Logger.log(chalk.blue(`日志目录已经建好：${LOG_DIR}`))
    mkdirSync(USER_ASSET_DIR, { recursive: true })
    Logger.log(chalk.blue(`资源目录已经建好：${USER_ASSET_DIR}`))
    mkdirSync(STATIC_FILE_DIR, { recursive: true })
    Logger.log(chalk.blue(`文件存放目录已经建好：${STATIC_FILE_DIR}`))
    mkdirSync(THEME_DIR, { recursive: true })
  }
}

function registerGlobal() {
  $.verbose = isDev
  Object.assign(globalThis, {
    isDev,
    consola,
    cwd,
  })
  console.debug = (...rest) => {
    if (isDev) {
      consola.log.call(console, ...rest)
    }
  }
}

function registerDotenv() {
  dotenv.config()
}

export function register() {
  registerGlobal()
  registerStdLogger()
  registerJSONGlobal()
  registerDotenv()
  mkdirs()
}
