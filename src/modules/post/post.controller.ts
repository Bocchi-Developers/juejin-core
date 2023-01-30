import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { Auth } from '~/common/decorator/auth.decorator'
import { CurrentUser } from '~/common/decorator/current-user.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { MongoIdDto } from '~/shared/dto/id.dto'

import { UserModel } from '../user/user.model'
import { PostDto, PostList } from './post.dto'
import { PartialPostModel } from './post.model'
import { PostService } from './post.service'

@Controller('post')
@ApiName
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  @Auth()
  async create(@Body() post: PostDto, @CurrentUser() user: UserModel) {
    return await this.postService.create(post, user)
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
  async deletePost(@Param('id') id: string, @CurrentUser() user: UserModel) {
    const _post = await this.postService.model.findById(id)
    if (_post?.user !== user._id && !user.admin) {
      throw new ForbiddenException('没有权限删除')
    }
    return await this.postService.deletePost(id)
  }

  @Patch('/:id')
  @Auth()
  async patch(
    @Param() params: MongoIdDto,
    @Body() body: PartialPostModel,
    @CurrentUser() user: UserModel,
  ) {
    const _post = await this.postService.model.findById(params.id)
    if (_post?.user !== user._id && !user.admin) {
      throw new ForbiddenException('没有权限修改')
    }
    return await this.postService.updateById(params.id, body)
  }
}
