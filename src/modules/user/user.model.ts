import { IsString } from 'class-validator'
import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'

@Schema({
  collection: 'users',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: false,
  },
  versionKey: false,
})
export class UserModel extends Document {
  @Prop({ unique: true })
  @IsString({ message: '用户名' })
  username: string

  @Prop({ select: false })
  @IsString({ message: '密码' })
  password: string

  @Prop({ select: false })
  authCode: string

  @Prop()
  avatar: string

  @Prop()
  introduce: string

  @Prop()
  admin: boolean
}
