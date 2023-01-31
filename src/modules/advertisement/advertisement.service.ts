import { Model } from 'mongoose'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { UploadService } from '../upload/upload.service'
import { AdvModel } from './advertisement.model'

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(AdvModel.name)
    private readonly advModel: Model<AdvModel>,
    private readonly uploadService: UploadService,
  ) {}

  async findUrl() {
    return await this.advModel.find()
  }

  async addUrl(url: string, goUrl: string) {
    const result = await this.advModel.find()
    if (result.length >= 1) {
      throw new ForbiddenException('请修改图片')
    }
    return await this.advModel.create({
      phoUrl: url,
      goUrl,
    })
  }

  async updateUrl(url: string, goUrl: string) {
    const result = await this.advModel.find()
    const name =
      result[0].phoUrl.split('/')[result[0].phoUrl.split('/').length - 1]
    this.uploadService.remove(name)
    await this.advModel.updateOne(
      { _id: result[0].id },
      {
        phoUrl: url,
        goUrl,
      },
    )
  }

  async remove(id: string) {
    const adv = await this.advModel.findById(id)
    if (!adv) {
      throw new ForbiddenException('删除失败')
    }
    return await this.advModel.deleteOne({
      _id: id,
    })
  }
}
