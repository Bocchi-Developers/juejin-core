import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

import { ApiName } from '~/common/decorator/openapi.decorator'

import { AdvertisementService } from '../advertisement/advertisement.service'
import { CategoryService } from '../category/category.service'
import { OptionService } from '../option/option.service'
import { UserService } from '../user/user.service'
import { AggregateService } from './aggregate.service'

@Controller('aggregate')
@ApiName
export class AggregateController {
  constructor(
    private readonly aggregateService: AggregateService,
    private readonly userService: UserService,
    private readonly optionService: OptionService,
    private readonly categoryService: CategoryService,
    private readonly adService: AdvertisementService,
  ) {}

  @Get()
  @ApiOperation({ summary: '首屏数据' })
  async aggregate() {
    const [user, seo] = await Promise.all([
      this.userService.getAdminInfo(),
      this.optionService.seoInfo(),
    ])
    return {
      user,
      seo,
    }
  }

  @Get('home/:size')
  @ApiOperation({ summary: '主页数据' })
  @ApiParam({
    description: '作者榜数量',
    name: 'size',
    type: 'number',
    required: true,
  })
  async homeAggregate(@Param('size') size: number) {
    const [category, ad, authorRank] = await Promise.all([
      this.categoryService.findAllCategory(),
      this.adService.findUrl(),
      this.userService.authorRank(size),
    ])
    return {
      category,
      ad,
      authorRank,
    }
  }
}
