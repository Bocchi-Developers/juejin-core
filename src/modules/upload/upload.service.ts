import qiniu from 'qiniu'

import { Injectable } from '@nestjs/common'

import { QNY } from '~/app.config'

const mac = new qiniu.auth.digest.Mac(QNY.QN_AK, QNY.QN_SK)
const options = {
  scope: QNY.QN_SCOPE,
  expires: 7200, // 凭证有效时间
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

@Injectable()
export class UploadService {
  async upload(file) {
    console.log(QNY.QN_SCOPE)
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
            resolve(`${QNY.QN_HOST}${respBody.key}`)
          } else {
            console.log(respBody)
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
