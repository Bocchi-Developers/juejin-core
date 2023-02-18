import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { AuthService } from '../auth/auth.service'
import { UserDetailDto, UserDto } from './user.dto'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Controller('user')
@ApiName
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() userDto: UserDto) {
    await this.userService.createUser(userDto)
    return
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @HttpCode(200)
  async login(@Body() dto: UserDto) {
    const user = await this.userService.login(dto.username, dto.password)
    const { username } = user
    return {
      username,
      token: await this.authService.signToken(user.id.toString()),
      expiresIn: 30,
    }
  }

  @Get('admin')
  @ApiOperation({ summary: '获取管理员信息' })
  async adminInfo() {
    return this.userService.getAdminInfo()
  }

  @Get()
  @ApiOperation({ summary: '随机获得指定数量的用户信息' })
  async authorRank(@Param('size') size: number) {
    return this.userService.authorRank(size)
  }

  @Patch()
  @Auth()
  async patchUserData(
    @Body() body: UserDetailDto,
    @CurrentUser() user: UserModel,
  ) {
    return await this.userService.patchUserData(body, user)
  }

  @Put()
  @Auth()
  async putUserData(
    @Body() body: UserDetailDto,
    @CurrentUser() user: UserModel,
  ) {
    return await this.userService.patchUserData(body, user)
  }

  @Get('check_logged')
  @ApiOperation({ summary: '判断当前 Token 是否有效 ' })
  @Auth()
  checkLogged(@CurrentUser() user: UserModel) {
    return this.userService.model.findOne({ username: user.username })
  }

  @Get('/:username')
  @ApiOperation({ summary: '获取指定用户名的信息' })
  getUserInfo(@Param('username') username: string) {
    return this.userService.model.findOne({ username })
  }
}
