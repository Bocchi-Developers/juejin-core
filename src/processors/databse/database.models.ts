import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'

import { AdModel } from '~/modules/advertisement/advertisement.model'
import { CategoryModel } from '~/modules/category/category.model'
import { OptionModel } from '~/modules/option/option.model'
import { PostModel } from '~/modules/post/post.model'
import { UserModel } from '~/modules/user/user.model'

export const databaseModels = [
  UserModel,
  PostModel,
  CategoryModel,
  OptionModel,
  AdModel,
].map((model: any) =>
  MongooseModule.forFeature([
    { name: model.name, schema: SchemaFactory.createForClass(model) },
  ]),
)
