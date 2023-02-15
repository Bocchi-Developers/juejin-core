import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { Admin } from '~/common/decorator/admin.decorator'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { adDto } from './advertisement.dto'
import { AdvertisementService } from './advertisement.service'

@Controller('advertisement')
@ApiName
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

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
  async addUrl(@Body() href: adDto) {
    await this.advertisementService.addUrl(href)
  }

  @Put()
  @Admin()
  @Auth()
  @ApiOperation({ summary: '广告修改' })
  async updateUrl(
    @UploadedFile() file: Express.Multer.File,
    @Body() ad: adDto,
  ) {
    await this.advertisementService.updateUrl(ad)
  }

  @Delete('/:id')
  @Admin()
  @Auth()
  @ApiOperation({ summary: '广告删除' })
  async remove(@Param('id') id: string) {
    await this.advertisementService.remove(id)
  }
}
