import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'

import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { UploadService } from './upload.service'

@Controller('upload')
@ApiName
export class UploadController {
  constructor(private readonly UploadService: UploadService) {}

  @Post('album')
  @ApiOperation({ summary: '图片上传' })
  @Auth() // 权限校验
  @UseInterceptors(FileInterceptor('file')) // 处理文件中间件 file 与上传的字段对应
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.UploadService.uploadPhoto(file)
  }
}
