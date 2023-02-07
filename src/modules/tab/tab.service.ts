import { Model } from 'mongoose'

import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { TabDto } from './tab.dto'
import { TabModel } from './tab.model'

@Injectable()
export class TabService {
  constructor(
    @InjectModel(TabModel.name)
    private readonly tabModel: Model<TabModel>,
  ) {}
  async create(tab: TabDto) {
    const slug = await this.tabModel.findOne({ title: tab.title })
    if (slug) {
      throw new BadRequestException('分类已存在')
    }
    return this.tabModel.create(tab)
  }

  async deleteTab(id: string) {
    const tab = await this.tabModel.findOne({ _id: id })
    if (!tab) {
      throw new BadRequestException('分类不存在')
    }
    return this.tabModel.deleteOne({ _id: id })
  }
  findAllTab() {
    return this.tabModel.find()
  }

  get model() {
    return this.tabModel
  }
}
