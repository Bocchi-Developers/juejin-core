import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'
import { PartialType } from '@nestjs/swagger'

@Schema({
  collection: 'tabs',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: true,
  },
  versionKey: false,
})
export class TabModel extends Document {
  @Prop({ queue: true })
  title: string

  @Prop()
  tag: string

  @Prop({ queue: true })
  slug: string
}

export class PartialTabModel extends PartialType(TabModel) {}
