import { Model } from 'mongoose'

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { UploadService } from '../upload/upload.service'
import { adDto } from './advertisement.dto'
import { AdModel } from './advertisement.model'

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(AdModel.name)
    private readonly AdModel: Model<AdModel>,
    private readonly uploadService: UploadService,
  ) {}

  async findUrl() {
    return await this.AdModel.findOne()
  }

  async addUrl(url: string, href: adDto) {
    const result = await this.AdModel.count()
    if (result >= 1) {
      throw new BadRequestException('广告已经存在')
    }
    return await this.AdModel.create({
      phoUrl: url,
      ...href,
    })
  }

  async updateUrl(url: string, href: adDto) {
    const result = await this.AdModel.findOne()
    let originUrl
    if (!url) {
      originUrl = result.phoUrl
    } else {
      const name = result.phoUrl.split('/')[result.phoUrl.split('/').length - 1]
      this.uploadService.remove(name)
    }
    await this.AdModel.updateOne(
      { _id: result.id },
      {
        phoUrl: url || originUrl,
        ...href,
      },
    )
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
