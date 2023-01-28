import { Module } from '@nestjs/common'

import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
  // imports: [MulterModule.register({
  //   storage: diskStorage({
  //     destination: join(__dirname, "../images"), //存放地址
  //     filename: (_, file, callback) => {
  //       const fileName = `${new Date().getTime() + extname(file.originalname)}`
  //       return callback(null, fileName)
  //     }
  //   })
  // })],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
