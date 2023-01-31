import { Transform } from 'class-transformer'
import { IsInt } from 'class-validator'

export class paginateDto {
  @IsInt()
  @Transform(({ value: val }) => (val ? parseInt(val) : 1), {
    toClassOnly: true,
  })
  pageCurrent: number

  @IsInt()
  @Transform(({ value: val }) => (val ? parseInt(val) : 10), {
    toClassOnly: true,
  })
  pageSize: number
}
