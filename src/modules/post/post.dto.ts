import { ArrayUnique, IsString } from 'class-validator'

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

export class PaginateDto {
  pageCurrent: string
  pageSize: string
}
