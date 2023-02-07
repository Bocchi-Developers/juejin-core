import { Model } from 'mongoose'
import { machineIdSync } from 'node-machine-id'

import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { PostService } from '../post/post.service'
import { CategoryDto } from './category.dto'
import { CategoryModel } from './category.model'

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: Model<CategoryModel>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}
  async create(category: CategoryDto) {
    const slug = await this.find(category.slug)
    if (slug) {
      throw new ForbiddenException('分类已存在')
    }
    return this.categoryModel.create(category)
  }

  find(slug: string) {
    return this.categoryModel.findOne({ slug })
  }

  get model() {
    return this.categoryModel
  }

  async findPostsInCategory(id: string) {
    return await this.postService.model.find({
      categoryId: id,
    })
  }
  async findAllCategory() {
    const category = await this.categoryModel.find().lean()
    category.unshift({
      name: '综合',
      slug: '',
      _id: Buffer.from(machineIdSync()).toString('base64').slice(0, 15),
    })
    return category
  }
}
