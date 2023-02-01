import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class goUrlDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File

  @ApiProperty({ required: true })
  @IsString({ message: '广告跳转链接' })
  goUrl: string
}
