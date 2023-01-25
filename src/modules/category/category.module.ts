import { Module } from '@nestjs/common'

import { PostModule } from '../post/post.module'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [PostModule],
})
export class CategoryModule {}
