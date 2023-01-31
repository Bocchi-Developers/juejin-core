import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'

import { UploadService } from '../upload/upload.service'
import { AdvertisementService } from './advertisement.service'

@Controller('advertisement')
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

  @Delete('/delete/:id')
  @ApiOperation({ summary: '广告删除' })
  async remove(@Param('id') id: string) {
    await this.advertisementService.remove(id)
  }
}
