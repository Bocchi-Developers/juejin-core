import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'

import { Admin } from '~/common/decorator/admin.decorator'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { NoContentCanBeModifiedException } from '~/common/exceptions/no-content-canbe-modified.exception'
import { MongoIdDto } from '~/shared/dto/id.dto'

import { TabDto, TabPatchDto } from './tab.dto'
import { TabService } from './tab.service'

@Controller('tab')
@ApiName
export class TabController {
  constructor(private readonly tabService: TabService) {}

  @Post('/')
  @Admin()
  @Auth()
  async createTab(@Body() tab: TabDto) {
    await this.tabService.create(tab)
    return
  }

  @Get()
  async findAllTab() {
    return this.tabService.findAllTab()
  }

  @Delete('/:id')
  @Admin()
  @Auth()
  async deleteTab(@Param('id') id: string) {
    await this.tabService.deleteTab(id)
    return
  }

  @Patch('/:id')
  @Admin()
  @Auth()
  async updateCategory(@Param() params: MongoIdDto, @Body() tab: TabPatchDto) {
    const { id } = params
    const _tab = await this.tabService.model.findById(id)
    if (!_tab) {
      throw new NoContentCanBeModifiedException()
    }
    await this.tabService.model.updateOne({ _id: id }, tab)
    return
  }

  @Put('/:id')
  @Admin()
  @Auth()
  async putCategory(@Param() params: MongoIdDto, @Body() tab: TabPatchDto) {
    const { id } = params
    const _tab = await this.tabService.model.findById(id)
    if (!_tab) {
      throw new NoContentCanBeModifiedException()
    }
    await this.tabService.model.updateOne({ _id: id }, tab)
    return
  }
}
