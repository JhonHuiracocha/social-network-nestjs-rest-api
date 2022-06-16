import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from, map } from 'rxjs';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';

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
      this.postRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.author', 'author')
        .orderBy('post.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getMany(),
    );
  }

  findPostById(id: string): Observable<PostEntity> {
    return from(
      this.postRepository.findOne({
        where: {
          id,
          status: true,
        },
        relations: ['author'],
      }),
    ).pipe(
      map((post: PostEntity) => {
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
          author: { id: authorId },
          status: true,
        },
      }),
    );
  }

  updatePost(id: string) {}

  deletePost(id: string) {}
}
