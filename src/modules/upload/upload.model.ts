import { IsString } from 'class-validator'
import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'

@Schema({
  collection: 'uploads',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: true,
  },
  versionKey: false,
})
export class UploadModel extends Document {
  @Prop()
  @IsString({ message: '标题' })
  title: string
}
