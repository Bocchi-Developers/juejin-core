import { IsString } from 'class-validator'
import mongoose, { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'

import { CategoryModel } from '../category/category.model'

@Schema({
  collection: 'posts',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: true,
  },
  versionKey: false,
})
export class PostModel extends Document {
  @Prop()
  @IsString({ message: '标题' })
  title: string

  @Prop()
  @IsString({ message: '文章内容' })
  content: string

  @Prop([String])
  tags?: string[]

  @Prop({
    type: () => mongoose.Schema.Types.ObjectId,
    ref: CategoryModel.name,
  })
  category: CategoryModel
}
