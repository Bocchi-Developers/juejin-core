import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { ApiName } from '~/common/decorator/openapi.decorator'

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
  ) {}

  @Get()
  @ApiOperation({ summary: '首屏数据' })
  async aggregate() {
    return {
      user: await this.userService.getAdminInfo(),
      seo: await this.optionService.seoInfo(),
    }
  }
}
