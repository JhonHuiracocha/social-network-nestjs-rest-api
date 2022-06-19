import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../entities/comment.entity';

export class CreatePostDto {
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsString()
  imgUrl?: string;

  @IsBoolean()
  status?: boolean;

  @IsNotEmpty()
  @IsObject()
  author: UserEntity;

  @IsArray()
  comments?: CommentEntity[];
}
