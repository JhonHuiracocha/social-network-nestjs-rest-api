import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  createPost(createPostDto: CreatePostDto): Observable<PostEntity> {
    return from(this.postRepository.save(createPostDto));
  }

  findPosts(take: number = 10, skip: number = 0): Observable<PostEntity[]> {
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
        take,
        skip,
      }),
    );
  }

  findPostWithRelations(id: string): Observable<PostEntity> {
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
      tap((post: PostEntity) => {
        if (!post) {
          throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return post;
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
    ).pipe(
      tap((post: PostEntity) => {
        if (!post) {
          throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
        return post;
      }),
    );
  }

  getAuthorPosts(authorId: string): Observable<PostEntity[]> {
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
    );
  }

  updatePost(id: string, updatePostDto: UpdatePostDto): Observable<PostEntity> {
    return this.findPostById(id).pipe(
      tap((post: PostEntity) => {
        updatePostDto.id = post.id;
        return from(this.postRepository.save(updatePostDto));
      }),
    );
  }

  deletePost(id: string): Observable<PostEntity> {
    return this.findPostById(id).pipe(
      tap((post: PostEntity) => {
        return from(this.postRepository.save({ ...post, status: false }));
      }),
    );
  }
}
