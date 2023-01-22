import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Document } from 'mongoose'

import { Prop, Schema } from '@nestjs/mongoose'

@Schema({
  collection: 'categories',
  toObject: { virtuals: true, getters: true },
  timestamps: {
    createdAt: 'created',
    updatedAt: false,
  },
  versionKey: false,
})
export class CategoryModel extends Document {
  @Prop({ unique: true, trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  name: string

  @Prop({ unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  slug: string
}
