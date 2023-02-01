import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class goUrlDto {
  @ApiProperty({ required: true })
  @IsString({ message: '广告跳转链接' })
  goUrl: string
}
