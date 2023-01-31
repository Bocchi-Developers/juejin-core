import { Model } from 'mongoose'

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { AdvModel } from './advertisement.model'

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(AdvModel.name)
    private readonly advModel: Model<AdvModel>,
  ) {}

  async findUrl() {
    const advUrl = await this.advModel.find()
    return advUrl
  }

  async addUrl(url, goUrl) {
    await this.advModel.create({
      PhoUrl: url,
      goUrl,
    })
    return
  }

  async remove(id: string) {
    await this.advModel.deleteOne({
      _id: id,
    })
    return
  }
}
