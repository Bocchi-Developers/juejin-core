import { Module } from '@nestjs/common'

import { OptionModule } from '../option/option.module'
import { UserModule } from '../user/user.module'
import { AggregateController } from './aggregate.controller'
import { AggregateService } from './aggregate.service'

@Module({
  controllers: [AggregateController],
  providers: [AggregateService],
  imports: [UserModule, OptionModule],
})
export class AggregateModule {}
