import cluster from 'cluster'
import wcmatch from 'wildcard-match'

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { API_VERSION, CROSS_DOMAIN, PORT } from './app.config'
import { AppModule } from './app.module'
import { ExpressAdapter } from './common/adapters/express.adapter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { isDev, isMainProcess } from './global/env.global'
import { MyLogger } from './processors/logger/logger.service'

declare const module: any

const Origin: false | string[] = Array.isArray(CROSS_DOMAIN.allowedOrigins)
  ? [...CROSS_DOMAIN.allowedOrigins]
  : false

export async function bootstrap() {
  process.title = `Juejin Core (${cluster.isPrimary ? 'master' : 'worker'})`
  const app = await NestFactory.create(AppModule, ExpressAdapter)
  // Origin 如果不是数组就全部允许跨域
  app.enableCors(
    isDev
      ? undefined
      : Origin
      ? {
          origin: (origin, callback) => {
            let currentHost: string
            try {
              currentHost = new URL(origin).host
            } catch {
              currentHost = origin
            }
            const allow = Origin.some((host) => wcmatch(host)(currentHost))

            callback(null, allow)
          },
          credentials: true,
        }
      : undefined,
  )

  app.setGlobalPrefix(isDev ? '' : `api/v${API_VERSION}`)
  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor())
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      forbidUnknownValues: true,
      enableDebugMessages: isDev,
      stopAtFirstError: true,
    }),
  )
  if (isDev) {
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger')
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('JueJin API')
      .setVersion(`${API_VERSION}`)
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
      })
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api-docs', app, document)
  }

  await app.listen(+PORT, '0.0.0.0', async () => {
    app.useLogger(app.get(MyLogger))
    consola.info('ENV:', process.env.NODE_ENV)
    const url = await app.getUrl()
    const pid = process.pid
    const env = cluster.isPrimary
    const prefix = env ? 'P' : 'W'
    if (!isMainProcess) {
      return
    }
    if (isDev) {
      consola.debug(`[${prefix + pid}] OpenApi: ${url}/api-docs`)
    }
    consola.success(`[${prefix + pid}] Server listen on: ${url}`)

    Logger.log(`Server is up. ${chalk.yellow(`+${performance.now() | 0}ms`)}`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
