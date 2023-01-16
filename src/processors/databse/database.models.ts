import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { UserModel } from '~/modules/user/user.model'

export const databaseModels = [
  UserModel
].map((model: any) =>
  MongooseModule.forFeature([
    { name: model.name, schema: SchemaFactory.createForClass(model) },
  ]),
)
