import { PostEntity } from '../entities/post.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsBoolean()
  status?: boolean;

  @IsNotEmpty()
  @IsObject()
  post: PostEntity;

  @IsNotEmpty()
  @IsObject()
  author: UserEntity;
}
