import { IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class adDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString({ message: '广告跳转链接' })
  goUrl: string
}
