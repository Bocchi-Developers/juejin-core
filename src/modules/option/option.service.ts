import { Model } from 'mongoose'

import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { SeoDto } from './option.dto'
import { OptionModel } from './option.model'

@Injectable()
export class OptionService {
  constructor(
    @InjectModel(OptionModel.name)
    private readonly optionModel: Model<OptionModel>,
  ) {}
  async create(seo: SeoDto) {
    const hasCreate = !!(await this.optionModel.count())
    if (hasCreate) {
      throw new BadRequestException('已经存在')
    }
    return this.optionModel.create(seo)
  }

  async seoInfo() {
    return this.optionModel.findOne()
  }

  patchSeo(seo: SeoDto) {
    return this.optionModel.updateOne({}, seo)
  }
}
