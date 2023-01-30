import qiniu from 'qiniu'

import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { QINIU_SECRET } from '~/app.config'

const mac = new qiniu.auth.digest.Mac(QINIU_SECRET.qn_ak, QINIU_SECRET.qn_sk)
const putPolicy = new qiniu.rs.PutPolicy({
  scope: QINIU_SECRET.qn_scope,
})
const uploadToken = putPolicy.uploadToken(mac)

@Injectable()
export class UploadService {
  upload(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`
    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2,
      }),
    )
    const putExtra = new qiniu.form_up.PutExtra()

    return new Promise((resolve) => {
      formUploader.put(
        uploadToken,
        filename,
        file.buffer,
        putExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            throw new InternalServerErrorException(respErr.message)
          }
          if (respInfo.statusCode == 200) {
            resolve(`${QINIU_SECRET.qn_host}/${respBody.key}`)
          } else {
            throw new InternalServerErrorException(respErr.message)
          }
        },
      )
    })
  }
}
