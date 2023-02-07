import { IsOptional, IsString } from 'class-validator'

export class TabDto {
  @IsString({ message: '标题' })
  title: string

  @IsString({ message: '路径' })
  slug: string

  @IsString({ message: '标签' })
  @IsOptional()
  tag?: string
}

export class TabPatchDto {
  @IsString({ message: '路径' })
  @IsOptional()
  title?: string

  @IsString({ message: '地址' })
  @IsOptional()
  slug?: string

  @IsString({ message: '标签' })
  @IsOptional()
  tag?: string
}
