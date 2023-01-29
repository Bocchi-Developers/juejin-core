import { Model } from 'mongoose'
import qiniu from 'qiniu'

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation } from '@nestjs/swagger'

import { ApiName } from '~/common/decorator/openapi.decorator'
import { NoContentCanBeModifiedException } from '~/common/exceptions/no-content-canbe-modified.exception'
import { accessKey, secretKey } from '~/global/env.global'

import { UploadModel } from './upload.model'

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'bocchi-album',
  expires: 7200, // 凭证有效时间
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

@Controller('upload')
@ApiName
export class UploadController {
  constructor(
    @InjectModel('UploadModel')
    private UploadModel: Model<UploadModel>,
  ) {}

  @Post('album')
  @ApiOperation({ summary: '图片上传' })
  @UseInterceptors(FileInterceptor('file')) // 处理文件中间件 file 与上传的字段对应
  async upload(@UploadedFile() file) {
    const filename = `${Date.now()}-${file.originalname}`
    await this.UploadModel.create({
      title: `http://rp6deac7u.hn-bkt.clouddn.com/${filename}`,
    })
    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2,
      }),
    )
    const putExtra = new qiniu.form_up.PutExtra()

    return new Promise((resolve, reject) => {
      formUploader.put(
        uploadToken,
        filename,
        file.buffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            throw respErr
          }
          if (respInfo.statusCode == 200) {
            resolve({
              code: respInfo.statusCode,
              respBody,
            })
          } else {
            reject({
              code: respInfo.statusCode,
              respBody,
            })
          }
        },
      )
    })
  }

  @Get()
  @ApiOperation({ summary: '图片查询' })
  async find() {
    const _up = await this.UploadModel.find()
    const arr = []
    _up.map((item) => {
      arr.push({
        title: item.title,
      })
    })
    return arr
  }

  @Delete(':id')
  @ApiOperation({ summary: '图片删除' })
  async remove(@Param('id') id: string) {
    const uploadPot = await this.UploadModel.findById(id)
    if (!uploadPot) {
      throw new NoContentCanBeModifiedException()
    }
    await this.UploadModel.deleteOne({ _id: uploadPot._id })
    return
  }
}
