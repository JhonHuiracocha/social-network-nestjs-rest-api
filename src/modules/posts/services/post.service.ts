import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, tap, catchError, switchMap, of } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { ApiResponse } from '../../../core/interfaces/response.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  createPost(
    createPostDto: CreatePostDto,
  ): Observable<ApiResponse<PostEntity>> {
    return from(this.postRepository.save(createPostDto)).pipe(
      switchMap((post: PostEntity) => {
        return of({
          status: true,
          message: 'The post has been created successfully.',
          data: [post],
        });
      }),
    );
  }

  findPosts(
    page: number = 1,
    limit: number = 0,
  ): Observable<ApiResponse<PostEntity>> {
    const skip: number = (page - 1) * limit;

    return from(
      this.postRepository.find({
        where: {
          status: true,
        },
        relations: {
          author: true,
          comments: {
            author: true,
          },
        },
        take: limit,
        skip,
      }),
    ).pipe(
      switchMap((posts: PostEntity[]) => {
        return of({
          status: true,
          data: posts,
          info: {
            page,
          },
        });
      }),
    );
  }

  findPostWithRelations(id: string): Observable<ApiResponse<PostEntity>> {
    return from(
      this.postRepository.findOne({
        where: {
          id,
          status: true,
        },
        relations: {
          author: true,
          comments: {
            author: true,
          },
        },
      }),
    ).pipe(
      switchMap((post: PostEntity) => {
        if (!post)
          throw new HttpException(
            {
              status: false,
              message: 'The post has not been found.',
            },
            HttpStatus.NOT_FOUND,
          );

        return of({
          status: true,
          data: [post],
        });
      }),
    );
  }

  findPostById(id: string): Observable<PostEntity> {
    return from(
      this.postRepository.findOne({
        where: {
          id,
          status: true,
        },
      }),
    );
  }

  getAuthorPosts(authorId: string): Observable<ApiResponse<PostEntity>> {
    return from(
      this.postRepository.find({
        where: {
          author: {
            id: authorId,
          },
          status: true,
        },
        relations: {
          comments: {
            author: true,
          },
        },
      }),
    ).pipe(
      switchMap((posts: PostEntity[]) => {
        return of({
          status: true,
          message: 'Find post @take & @skip.',
          data: posts,
        });
      }),
    );
  }

  updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Observable<ApiResponse<PostEntity>> {
    return this.findPostById(id).pipe(
      switchMap((post: PostEntity) => {
        if (!post)
          throw new HttpException(
            { status: false, message: 'The post has not been found.' },
            HttpStatus.NOT_FOUND,
          );

        return from(this.postRepository.update(id, updatePostDto)).pipe(
          switchMap((updateResult: UpdateResult) => {
            return of({
              status: true,
              message: 'The post has been updated successfully.',
            });
          }),
        );
      }),
    );
  }

  deletePost(id: string): Observable<ApiResponse<PostEntity>> {
    return this.findPostById(id).pipe(
      switchMap((post: PostEntity) => {
        if (!post)
          throw new HttpException(
            { status: false, message: 'The post has not been found.' },
            HttpStatus.NOT_FOUND,
          );

        return from(this.postRepository.update(id, { status: false })).pipe(
          switchMap((updateResult: UpdateResult) => {
            return of({
              status: true,
              message: 'The post has been deleted successfully.',
            });
          }),
        );
      }),
    );
  }
}
