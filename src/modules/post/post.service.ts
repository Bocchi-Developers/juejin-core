import { Model } from 'mongoose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { CategoryModel } from '../category/category.model'
import { PostDto } from './post.dto'
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

  async postPaginate(pageCurrent: number, pageSize: number) {
    const postList = await this.postModel.populate(
      await this.postModel
        .aggregate([
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
        ])
        .sort({ created: 'desc' })
        .skip(pageSize * (pageCurrent - 1))
        .limit(pageSize),
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

  async findPostByCategory(
    slug: string,
    pageCurrent: number,
    pageSize: number,
  ) {
    const category = await this.categoryModel.findOne({ slug })
    const postList = await this.postModel.populate(
      await this.postModel
        .aggregate([
          {
            $match: {
              category: { $eq: category.id },
            },
          },
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
        ])
        .sort({ created: 'desc' })
        .skip(pageSize * (pageCurrent - 1))
        .limit(pageSize),
      { path: 'category' },
    )
    const totalCount = await this.postModel.count({ category: category.id })
    const totalPages = Math.ceil(totalCount / pageSize)
    return {
      postList,
      totalCount,
      totalPages,
    }
  }

  async findPostByTag(slug: string, pageCurrent: number, pageSize: number) {
    const postList = await this.postModel.populate(
      await this.postModel
        .aggregate([
          {
            $match: {
              tags: { $eq: slug },
            },
          },
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
        ])
        .sort({ created: 'desc' })
        .skip(pageSize * (pageCurrent - 1))
        .limit(pageSize),
      { path: 'category' },
    )
    const totalCount = await this.postModel.count({ tags: slug })
    const totalPages = Math.ceil(totalCount / pageSize)
    return {
      postList,
      totalCount,
      totalPages,
    }
  }
}
