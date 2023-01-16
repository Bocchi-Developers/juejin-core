import { Model } from 'mongoose'

import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'

import { MasterLostException } from '~/common/exceptions/master-lost.exception'

import { UserModel } from '../user/user.model'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async signToken(openid: string) {
    const user = await this.userModel.findOne({ openid })
    if (!user) {
      throw new MasterLostException()
    }
    const authCode = user.authCode
    const payload = {
      authCode,
    }

    return this.jwtService.sign(payload)
  }

  async verifyPayload(payload: JwtPayload) {
    const user = await this.userModel.findOne({
      openid: payload.authCode,
    })
    if (!user) {
      throw new MasterLostException()
    }

    return user && user.authCode === payload.authCode ? user : null
  }
}
