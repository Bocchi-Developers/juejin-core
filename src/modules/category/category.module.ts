import { Module, forwardRef } from '@nestjs/common'

import { PostModule } from '../post/post.module'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [forwardRef(() => PostModule)],
  exports: [CategoryService],
})
export class CategoryModule {}
