import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'

import { Admin } from '~/common/decorator/admin.decorator'
import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { NoContentCanBeModifiedException } from '~/common/exceptions/no-content-canbe-modified.exception'
import { MongoIdDto } from '~/shared/dto/id.dto'

import { CategoryDto } from './category.dto'
import { CategoryService } from './category.service'

@Controller('category')
@ApiName
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  @Admin()
  @Auth()
  async create(@Body() category: CategoryDto) {
    return this.categoryService.create(category)
  }

  @Get('/:slug')
  async categoryBySlug(@Param('slug') slug: string) {
    return await this.categoryService.find(slug)
  }

  @Delete('/:id')
  @Admin()
  @Auth()
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoryService.model.findById(id)
    if (!category) {
      throw new NoContentCanBeModifiedException()
    }

    const postsInCategory = await this.categoryService.findPostsInCategory(
      category._id,
    )
    if (postsInCategory.length > 0) {
      throw new BadRequestException('该分类中有其他文章，无法被删除')
    }
    await this.categoryService.model.deleteOne({
      _id: category._id,
    })
    return
  }

  @Patch('/:id')
  @Admin()
  @Auth()
  async updateCategory(
    @Param() params: MongoIdDto,
    @Body() category: CategoryDto,
  ) {
    const { id } = params
    await this.categoryService.model.updateOne({ _id: id }, category)
    return
  }
}
