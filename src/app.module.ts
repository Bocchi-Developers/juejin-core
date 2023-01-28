import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { RolesGuard } from './common/guard/roles.guard'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AggregateModule } from './modules/aggregate/aggregate.module'
import { CategoryModule } from './modules/category/category.module'
import { OptionModule } from './modules/option/option.module'
import { PostModule } from './modules/post/post.module'
import { UserModule } from './modules/user/user.module'
import { DatabaseModule } from './processors/databse/database.module'
import { HelperModule } from './processors/helper/helper.module'
import { LoggerModule } from './processors/logger/logger.module'

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    HelperModule,
    UserModule,
    PostModule,
    CategoryModule,
    AggregateModule,
    OptionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // 1
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
