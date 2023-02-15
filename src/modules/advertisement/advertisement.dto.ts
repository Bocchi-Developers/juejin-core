import { IsOptional, IsUrl } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class adDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsUrl()
  phoUrl: string

  @ApiProperty({ required: true })
  @IsOptional()
  @IsUrl()
  adHref: string

  @ApiProperty({ required: true })
  @IsOptional()
  @IsUrl()
  putAdHref: string
}
