import { Module } from '@nestjs/common'

import { AdvertisementModule } from '../advertisement/advertisement.module'
import { CategoryModule } from '../category/category.module'
import { OptionModule } from '../option/option.module'
import { TabModule } from '../tab/tab.module'
import { UserModule } from '../user/user.module'
import { AggregateController } from './aggregate.controller'
import { AggregateService } from './aggregate.service'

@Module({
  controllers: [AggregateController],
  providers: [AggregateService],
  imports: [
    UserModule,
    OptionModule,
    CategoryModule,
    AdvertisementModule,
    TabModule,
  ],
})
export class AggregateModule {}
