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
export class AdModel extends Document {
  @Prop({ unique: true })
  phoUrl: string

  @Prop()
  adHref: string

  @Prop()
  putAdHref: string
}
