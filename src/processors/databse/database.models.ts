import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'

import { CategoryModel } from '~/modules/category/category.model'
import { PostModel } from '~/modules/post/post.model'
import { UploadModel } from '~/modules/upload/upload.model'
import { UserModel } from '~/modules/user/user.model'

export const databaseModels = [
  UserModel,
  PostModel,
  CategoryModel,
  UploadModel,
].map((model: any) =>
  MongooseModule.forFeature([
    { name: model.name, schema: SchemaFactory.createForClass(model) },
  ]),
)
