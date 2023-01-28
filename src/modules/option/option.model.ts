import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'
import { PartialType } from '@nestjs/swagger'

@Schema({
  collection: 'options',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: false,
  },
  versionKey: false,
})
export class OptionModel extends Document {
  @Prop()
  title: string

  @Prop()
  description: string

  @Prop()
  keywords?: string[]
}

export class PartialPostModel extends PartialType(OptionModel) {}
