import { Module } from '@nestjs/common'

import { TabController } from './tab.controller'
import { TabService } from './tab.service'

@Module({
  controllers: [TabController],
  providers: [TabService],
  exports: [TabService],
})
export class TabModule {}
