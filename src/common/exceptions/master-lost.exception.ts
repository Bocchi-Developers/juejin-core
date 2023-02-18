import { InternalServerErrorException } from '@nestjs/common'

export class MasterLostException extends InternalServerErrorException {
  constructor() {
    super('token 过期，请重新登录')
  }
}
