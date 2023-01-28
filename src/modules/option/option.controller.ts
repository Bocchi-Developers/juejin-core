import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { Admin } from '~/common/decorator/admin.decorator'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { SeoDto } from './option.dto'
import { OptionService } from './option.service'

@Controller('option')
@ApiName
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @ApiOperation({ summary: '创建网站 seo 信息' })
  async create(@Body() seo: SeoDto) {
    await this.optionService.create(seo)
    return
  }

  @Get()
  @ApiOperation({ summary: '获取网站 seo 信息' })
  async adminInfo() {
    return this.optionService.seoInfo()
  }

  @Patch()
  @ApiOperation({ summary: '修改网站 seo 信息' })
  @Auth()
  @Admin()
  async patchUserData(@Body() seo: SeoDto) {
    await this.optionService.patchSeo(seo)
    return
  }
}
