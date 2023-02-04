import { Request, Response } from 'express'
import { WriteStream } from 'fs'
import { resolve } from 'path'

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { HTTP_REQUEST_TIME } from '~/constants/meta.constant'
import { LOG_DIR } from '~/constants/path.constant'
import { isDev } from '~/global/env.global'

import { getIp } from '../../utils/ip.util'
import { BizException } from '../exceptions/biz.exception'
import { LoggingInterceptor } from '../interceptors/logging.interceptor'

type myError = {
  readonly status: number
  readonly statusCode?: number

  readonly message?: string
}

let once = false
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)
  private errorLogPipe: WriteStream
  constructor(private readonly reflector: Reflector) {
    this.registerCatchAllExceptionsHook()
  }

  registerCatchAllExceptionsHook() {
    if (once) {
      return
    }
    process.on('unhandledRejection', (reason: any) => {
      console.error('unhandledRejection: ', reason)
    })

    process.on('uncaughtException', (err) => {
      console.error('uncaughtException: ', err)
    })
    once = true
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as myError)?.status ||
          (exception as myError)?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      (exception as any)?.response?.message ||
      (exception as myError)?.message ||
      ''

    const url = request.url

    if (
      status === HttpStatus.INTERNAL_SERVER_ERROR &&
      !(exception instanceof BizException)
    ) {
      Logger.error(exception, undefined, 'Catch')
      if (!isDev) {
        this.errorLogPipe =
          this.errorLogPipe ??
          fs.createWriteStream(resolve(LOG_DIR, 'error.log'), {
            flags: 'a+',
            encoding: 'utf-8',
          })

        this.errorLogPipe.write(
          `[${new Date().toLocaleString('en-US', {
            timeStyle: 'medium',
            dateStyle: 'long',
          })}] ${decodeURI(url)}: ${
            (exception as any)?.response?.message ||
            (exception as myError)?.message
          }\n${(exception as Error).stack}\n`,
        )
      }
    } else {
      const ip = getIp(request)
      this.logger.warn(
        `IP: ${ip} 错误信息：(${status}) ${message} Path: ${decodeURI(url)}`,
      )
    }

    const prevRequestTs = this.reflector.get(HTTP_REQUEST_TIME, request as any)

    if (prevRequestTs) {
      const content = `${request.method} -> ${request.url}`
      Logger.debug(
        `--- 响应异常请求：${content}${chalk.yellow(
          ` +${Date.now() - prevRequestTs}ms`,
        )}`,
        LoggingInterceptor.name,
      )
    }
    const res = (exception as any).response
    response
      .status(status)
      .type('application/json')
      .send({
        success: false,
        code: res?.statusCode || 500,
        message: res?.message || (exception as any)?.message || '未知错误',
      })
  }
}
