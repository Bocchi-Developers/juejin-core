import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AppController } from './app.controller'
import { AllExceptionsFilter } from './common/filters/any-exception.filter'
import { RolesGuard } from './common/guard/roles.guard'
import { ResponseInterceptor } from './common/interceptors/response.interceptor'
import { AdvertisementModule } from './modules/advertisement/advertisement.module'
import { AggregateModule } from './modules/aggregate/aggregate.module'
import { CategoryModule } from './modules/category/category.module'
import { OptionModule } from './modules/option/option.module'
import { PostModule } from './modules/post/post.module'
import { TabModule } from './modules/tab/tab.module'
import { UploadModule } from './modules/upload/upload.module'
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
    UploadModule,
    AdvertisementModule,
    OptionModule,
    AggregateModule,
    TabModule,
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
