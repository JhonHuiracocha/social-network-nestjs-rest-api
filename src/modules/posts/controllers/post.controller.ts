import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto): Observable<PostEntity> {
    return this.postService.createPost(createPostDto);
  }

  @Get()
  findPosts(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
  ): Observable<PostEntity[]> {
    take = take > 20 ? 20 : take;
    return this.postService.findPosts(take, skip);
  }

  @Get(':postId')
  findPostById(@Param('postId') postId: string): Observable<PostEntity> {
    return this.postService.findPostById(postId);
  }

  @Get('/author/:authorId')
  getAuthorPosts(
    @Param('authorId') authorId: string,
  ): Observable<PostEntity[]> {
    return this.postService.getAuthorPosts(authorId);
  }
}
