import { Model } from 'mongoose'
import qiniu from 'qiniu'

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { QNY } from '~/app.config'

import { UploadModel } from './upload.model'

const mac = new qiniu.auth.digest.Mac(QNY.AccessKey, QNY.SecretKey)
const options = {
  scope: QNY.scope,
  expires: 7200, // 凭证有效时间
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

@Injectable()
export class UploadService {
  constructor(
    @InjectModel('UploadModel')
    private UploadModel: Model<UploadModel>,
  ) {}

  async upload(file) {
    const filename = `${Date.now()}-${file.originalname}`
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
            resolve(`${QNY.host}${respBody.key}`)
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
}
