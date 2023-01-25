import { Model } from 'mongoose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CategoryModel } from '../category/category.model'
import { PostDto, PostList } from './post.dto'
import { PostModel } from './post.model'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: Model<CategoryModel>,
  ) {}
  async create(post: PostDto) {
    try {
      await this.categoryModel.findById(post.category)
    } catch (error) {
      throw new ForbiddenException('分类不存在')
    }
    return this.postModel.create(post)
  }

  async findPostById(id: string) {
    const post = await this.postModel.findById(id).populate('category')

    if (!post) {
      throw new ForbiddenException('文章不存在')
    }
    const last = await this.postModel
      .findOne({ _id: { $gt: post._id } })
      .sort({ _id: 1 })
      .select(['_id', 'title'])

    const next = await this.postModel
      .findOne({ _id: { $lt: post._id } })
      .sort({ _id: -1 })
      .select(['_id', 'title'])
    return {
      post,
      last,
      next,
    }
  }

  async postPaginate(post: PostList) {
    const { pageCurrent, pageSize, categoryId, tag } = post as any
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
          },
        },
        {
          $match: {
            category: categoryId ? { $eq: categoryId } : { $exists: true },
            tags: tag ? { $eq: tag } : { $exists: true },
          },
        },
        {
          $sort: {
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
      { path: 'category' },
    )

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

  get model() {
    return this.postModel
  }
}
