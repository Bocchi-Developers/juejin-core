import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { Auth } from '~/common/decorator/auth.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'

import { PostDto, PostList } from './post.dto'
import { PostService } from './post.service'

@Controller('post')
@ApiName
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @Auth()
  async create(@Body() post: PostDto) {
    return await this.postService.create(post)
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 id 查文章' })
  async findLostById(@Param('id') id: string) {
    return this.postService.findPostById(id)
  }

  @Get('/')
  @ApiOperation({ summary: '分页获取博文' })
  async getPaginate(@Query() postList: PostList) {
    return this.postService.postPaginate(postList)
  }

  @Delete(':id')
  @Auth()
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(id)
  }
}
