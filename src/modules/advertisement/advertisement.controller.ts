import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'

import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { UploadService } from '../upload/upload.service'
import { AdvertisementService } from './advertisement.service'

@Controller('advertisement')
@ApiName
@Auth() // 权限校验
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: '广告查找' })
  async findUrl() {
    const result = await this.advertisementService.findUrl()
    return result
  }

  @Post('/addPto')
  @ApiOperation({ summary: '广告增加' })
  @UseInterceptors(FileInterceptor('file'))
  async addUrl(
    @UploadedFile() file: Express.Multer.File,
    @Body('goUrl') goUrl: string,
  ) {
    const result = await this.uploadService.upload(file)
    await this.advertisementService.addUrl(result, goUrl)
  }

  @Patch('/update')
  @ApiOperation({ summary: '广告修改' })
  @UseInterceptors(FileInterceptor('file'))
  async updateUrl(
    @UploadedFile() file: Express.Multer.File,
    @Body('goUrl') goUrl: string,
  ) {
    const result = await this.uploadService.upload(file)
    await this.advertisementService.updateUrl(result, goUrl)
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: '广告删除' })
  async remove(@Param('id') id: string) {
    await this.advertisementService.remove(id)
  }
}
