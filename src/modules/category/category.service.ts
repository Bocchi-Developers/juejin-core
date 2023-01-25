import { Model } from 'mongoose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { PostService } from '../post/post.service'
import { CategoryDto } from './category.dto'
import { CategoryModel } from './category.model'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: Model<CategoryModel>,
    private readonly postService: PostService,
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

  get model() {
    return this.categoryModel
  }

  async findPostsInCategory(id: string) {
    return await this.postService.model.find({
      categoryId: id,
    })
  }
}
