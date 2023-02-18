import { compareSync, hashSync } from 'bcrypt'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { UserModel } from '~/modules/user/user.model'
import { sleep } from '~/utils/tool.util'

import { UserDetailDto, UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}
  async createUser(user: UserDto) {
    const hasMaster = await this.hasMaster()
    if (hasMaster) {
      const _user = await this.userModel.findOne({ username: user.username })
      if (_user) {
        throw new ForbiddenException('用户名已经存在')
      }
    }
    user.password = hashSync(user.password, 6)
    const authCode = nanoid(10)

    const res = await this.userModel.create({
      ...user,
      admin: !hasMaster,
      authCode,
    })
    return { username: res.username, authCode: res.authCode, admin: res.admin }
  }

  async login(username: string, password: string) {
    const user = await this.userModel
      .findOne({ username })
      .select(['+password', '+authCode'])
    if (!user) {
      await sleep(1000)
      throw new ForbiddenException('用户名不正确')
    }
    if (!compareSync(password, user.password)) {
      await sleep(1000)
      throw new ForbiddenException('密码不正确')
    }
    return user
  }

  async hasMaster() {
    return !!(await this.userModel.count())
  }

  async patchUserData(data: UserDetailDto, CurrentUser: UserModel) {
    const _user = await this.userModel.findById(CurrentUser._id)
    if (!_user?.admin && data._id != _user._id) {
      throw new ForbiddenException('无修改权限')
    }
    if (data?.password) {
      data.password = hashSync(data.password, 6)
      data['authCode'] = nanoid(10)
      return this.userModel.updateOne({ _id: _user._id }, data)
    }
    return this.userModel.updateOne({ _id: _user._id }, data)
  }

  getAdminInfo() {
    return this.userModel.findOne({ admin: true })
  }

  authorRank(size: number) {
    return this.userModel.aggregate([
      {
        $sample: {
          size,
        },
      },
      {
        $project: {
          username: 1,
          avatar: 1,
          introduce: 1,
        },
      },
    ])
  }

  get model() {
    return this.userModel
  }
}
