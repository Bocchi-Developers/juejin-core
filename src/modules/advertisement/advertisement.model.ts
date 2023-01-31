import { IsString } from 'class-validator'
import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'

@Schema({
  collection: 'advertisement',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: false,
  },
  versionKey: false,
})
export class AdvModel extends Document {
  @Prop({ unique: true })
  @IsString({ message: '图片地址' })
  PhoUrl: string

  @Prop({ select: false })
  @IsString({ message: '跳转地址' })
  goUrl: string
}
