import { Model } from 'mongoose'

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { adDto } from './advertisement.dto'
import { AdModel } from './advertisement.model'

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(AdModel.name)
    private readonly AdModel: Model<AdModel>,
  ) {}

  async findUrl() {
    return await this.AdModel.findOne()
  }

  async addUrl(href: adDto) {
    const result = await this.AdModel.count()
    if (result >= 1) {
      throw new BadRequestException('广告已经存在')
    }
    return await this.AdModel.create({
      ...href,
    })
  }

  async updateUrl(href: adDto) {
    const result = await this.AdModel.findOne()
    await this.AdModel.updateOne({ _id: result.id }, href)
  }

  async remove(id: string) {
    const ad = await this.AdModel.findById(id)
    if (!ad) {
      throw new ForbiddenException('删除失败')
    }
    return await this.AdModel.deleteOne({
      _id: id,
    })
  }
}
