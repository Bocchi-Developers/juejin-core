import { Model } from 'mongoose'

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CategoryModel } from '../category/category.model'
import { CategoryService } from '../category/category.service'
import { UserModel } from '../user/user.model'
import { PostDto, PostList, Sort } from './post.dto'
import { PartialPostModel, PostModel } from './post.model'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: Model<CategoryModel>,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}
  async create(post: PostDto, user: UserModel) {
    try {
      await this.categoryModel.findById(post.category)
    } catch (error) {
      throw new ForbiddenException('分类不存在')
    }
    return this.postModel.create({ ...post, user: user._id })
  }

  async findPostById(id: string) {
    const _post = await this.postModel.findById(id)

    if (!_post) {
      throw new ForbiddenException('文章不存在')
    }
    await this.postModel.updateOne({ _id: id }, { $inc: { read: 1 } })
    const post = await this.postModel.findById(id).populate('category user')
    return {
      post,
    }
  }

  async postPaginate(post: PostList) {
    const { pageCurrent, pageSize, categoryId, tag, sort } = post
    console.log(sort != Sort.Newest)
    const postList = await this.postModel.populate(
      await this.postModel.aggregate([
        {
          $project: {
            content: {
              $substrCP: ['$content', 1, 100],
            },
            _id: 1,
            title: 1,
            category: 1,
            tags: 1,
            created: 1,
            ad: 1,
            user: 1,
            cover: 1,
            read: 1,
          },
        },
        {
          $match: {
            category: categoryId ? { $eq: categoryId } : { $exists: true },
            tags: tag ? { $eq: tag } : { $exists: true },
            ad: false,
          },
        },
        {
          $sort: {
            read: sort != Sort.Newest ? -1 : 1,
            created: -1,
          },
        },
        {
          $skip: pageSize * (pageCurrent - 1),
        },
        {
          $limit: pageSize,
        },
      ]),
      { path: 'category user' },
    )
    if (pageCurrent == 1) {
      const top = await this.postModel
        .find({ ad: true })
        .populate('category')
        .populate('user')
      postList.unshift(...top)
    }

    const totalCount = await this.postModel.count()
    const totalPages = Math.ceil(totalCount / pageSize)
    return {
      postList,
      totalCount,
      totalPages,
    }
  }

  async deletePost(id: string) {
    const _post = await this.postModel.findById(id)
    if (!_post) {
      throw new ForbiddenException('文章不存在')
    }
    await this.postModel.findByIdAndDelete(id)
    return
  }

  async updateById(id: string, post: PartialPostModel) {
    const oldPost = await this.postModel.findById(id, 'category')
    if (!oldPost) {
      throw new BadRequestException('文章不存在')
    }
    const { category } = post
    if (category && category !== oldPost.category.id) {
      const oldCategory = await this.categoryService.model.findById(category)
      if (!oldCategory) {
        throw new BadRequestException('分类不存在')
      }
    }

    await this.postModel.updateOne({ _id: id }, post)
    return
  }

  get model() {
    return this.postModel
  }
}
