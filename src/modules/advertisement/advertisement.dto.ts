import { IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class adDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file: Express.Multer.File

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString({ message: '广告地址' })
  adHref: string

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString({ message: '投放广告地址' })
  putAdHref: string
}
