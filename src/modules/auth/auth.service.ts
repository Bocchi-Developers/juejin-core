import { Injectable } from '@nestjs/common';

import type { JwtService } from '@nestjs/jwt';
import { MasterLostException } from '~/common/exceptions/master-lost.exception';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

import { UserModel } from '../user/user.model';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async signToken(openid: string) {
    const user = await this.userModel.findOne({openid} )
    if (!user) {
      throw new MasterLostException()
    }
    const authCode = user.authCode
    const payload = {
      authCode
    }
    
    return this.jwtService.sign(payload)
  }

  async verifyPayload(payload: JwtPayload) {
  
    const user = await this.userModel.findOne({
        openid:payload.authCode
    })
    if (!user) {
      throw new MasterLostException()
    }

    return user && user.authCode === payload.authCode ? user : null
  }
}
