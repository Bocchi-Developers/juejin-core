import { Model } from 'mongoose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { UploadService } from '../upload/upload.service'
import { goUrlDto } from './advertisement.dto'
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

  async addUrl(url: string, goUrl: goUrlDto) {
    const result = await this.AdModel.count()
    if (result >= 1) {
      throw new ForbiddenException('请修改图片')
    }
    return await this.AdModel.create({
      phoUrl: url,
      goUrl: goUrl.goUrl,
    })
  }

  async updateUrl(url: string, goUrl: goUrlDto) {
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
        goUrl: goUrl.goUrl,
      },
    )
  }

  async remove(id: string) {
    const adv = await this.AdModel.findById(id)
    if (!adv) {
      throw new ForbiddenException('删除失败')
    }
    return await this.AdModel.deleteOne({
      _id: id,
    })
  }
}
