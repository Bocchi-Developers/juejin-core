import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { goUrlDto } from './advertisement.dto'
import { AdvertisementService } from './advertisement.service'

@Controller('advertisement')
@ApiName
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

  @Post()
  @Auth()
  @ApiOperation({ summary: '广告增加' })
  @UseInterceptors(FileInterceptor('file'))
  async addUrl(
    @UploadedFile() file: Express.Multer.File,
    @Body() goUrl: goUrlDto,
  ) {
    if (!file) {
      throw new ForbiddenException('请传入文件')
    } else {
      const result = await this.uploadService.upload(file)
      await this.advertisementService.addUrl(result, goUrl)
    }
  }

  @Patch()
  @Auth()
  @ApiOperation({ summary: '广告修改' })
  @UseInterceptors(FileInterceptor('file'))
  async updateUrl(
    @UploadedFile() file: Express.Multer.File,
    @Body() goUrl: goUrlDto,
  ) {
    if (!file) {
      throw new ForbiddenException('请传入文件')
    } else {
      const result = await this.uploadService.upload(file)
      await this.advertisementService.updateUrl(result, goUrl)
    }
  }

  @Delete('/:id')
  @Auth()
  @ApiOperation({ summary: '广告删除' })
  async remove(@Param('id') id: string) {
    await this.advertisementService.remove(id)
  }
}
