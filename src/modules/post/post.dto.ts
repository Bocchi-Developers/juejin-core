import { ArrayUnique, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/shared/dto/pager.dto'

export class PostDto {
  @IsString({ message: '标题' })
  title: string

  @IsString({ message: '文章内容' })
  content: string

  @ArrayUnique()
  tags?: string[]

  @IsString({ message: '分类' })
  category: string
}

export class PostList extends PagerDto {
  @IsString()
  @IsOptional()
  categoryId?: string

  @IsString()
  @IsOptional()
  tag?: string
}

export class PaginateDto {
  pageCurrent: string
  pageSize: string
}
