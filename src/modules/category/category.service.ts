import { Model } from 'mongoose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CategoryDto } from './category.dto'
import { CategoryModel } from './category.model'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: Model<CategoryModel>,
  ) {}
  async create(category: CategoryDto) {
    const slug = await this.find(category.slug)
    if (slug.length) {
      throw new ForbiddenException('分类已存在')
    }
    return this.categoryModel.create(category)
  }

  find(slug: string) {
    return this.categoryModel.find({ slug })
  }
}
