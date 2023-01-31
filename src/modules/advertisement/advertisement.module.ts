import { Module } from '@nestjs/common'

import { UploadModule } from '../upload/upload.module'
import { AdvertisementController } from './advertisement.controller'
import { AdvertisementService } from './advertisement.service'

@Module({
  imports: [UploadModule],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementModule {}
