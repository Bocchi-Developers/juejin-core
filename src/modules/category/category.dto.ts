import { IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CategoryDto {
  @ApiProperty({ required: true })
  @IsString({ message: '分类名' })
  name: string

  @ApiProperty({ required: true })
  @IsString({ message: '分类路径' })
  slug: string
}
