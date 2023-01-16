import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
export class UserDto {
  @ApiProperty({ required: true })
  @IsString({ message: '用户名' })
  username: string

  @ApiProperty({ required: true })
  @IsString({ message: '密码' })
  password: string
}

export class UserDetailDto {

  @IsOptional()
  avatar?:string

  @IsOptional()
  @ApiProperty({ description: '介绍'})
  @IsString({ message: '介绍' })
  introduce?:string

  @ApiProperty({ required: false, example: 'example@example.com' })
  @IsEmail()
  @IsOptional()
  readonly mail?: string

  @IsOptional()
  @IsObject()
  @ApiProperty({ description: '各种社交 id 记录' })
  readonly socialIds?: Record<string, any>
}



