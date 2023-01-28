import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SeoDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '不能为空!!' })
  @IsOptional()
  @IsString({ message: '网站标题' })
  title: string

  @IsString({ message: '描述信息必须是字符串' })
  @IsNotEmpty({ message: '不能为空!!' })
  @IsOptional()
  @IsString({ message: '网站描述' })
  description: string

  @IsString({ message: '关键字必须为一个数组', each: true })
  @IsOptional()
  keywords?: string[]
}
