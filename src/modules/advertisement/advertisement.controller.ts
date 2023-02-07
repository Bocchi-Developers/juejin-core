import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiOperation } from '@nestjs/swagger'

import { Admin } from '~/common/decorator/admin.decorator'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { UploadService } from '../upload/upload.service'
import { adDto } from './advertisement.dto'
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
  @Admin()
  @Auth()
  @ApiOperation({ summary: '广告增加' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async addUrl(@UploadedFile() file: Express.Multer.File, @Body() href: adDto) {
    const result = await this.uploadService.upload(file)
    await this.advertisementService.addUrl(result, href)
  }

  @Put()
  @Admin()
  @Auth()
  @ApiOperation({ summary: '广告修改' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateUrl(
    @UploadedFile() file: Express.Multer.File,
    @Body() ad: adDto,
  ) {
    let result = null
    if (file) {
      result = await this.uploadService.upload(file)
    }

    await this.advertisementService.updateUrl(result, ad)
  }

  @Delete('/:id')
  @Admin()
  @Auth()
  @ApiOperation({ summary: '广告删除' })
  async remove(@Param('id') id: string) {
    await this.advertisementService.remove(id)
  }
}
