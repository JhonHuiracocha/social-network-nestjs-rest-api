import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ApiResponse } from 'src/core/interfaces/response.interface';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
  ): Observable<ApiResponse<PostEntity>> {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  findPosts(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Observable<ApiResponse<PostEntity>> {
    limit = limit > 20 ? 20 : limit;
    return this.postService.findPosts(page, limit);
  }

  @Get(':postId')
  findPostById(
    @Param('postId') postId: string,
  ): Observable<ApiResponse<PostEntity>> {
    return this.postService.findPostWithRelations(postId);
  }

  @Get('/author/:authorId')
  getAuthorPosts(
    @Param('authorId') authorId: string,
  ): Observable<ApiResponse<PostEntity>> {
    return this.postService.getAuthorPosts(authorId);
  }

  @Put(':postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Observable<ApiResponse<PostEntity>> {
    return this.postService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  deletePost(
    @Param('postId') postId: string,
  ): Observable<ApiResponse<PostEntity>> {
    return this.postService.deletePost(postId);
  }
}
