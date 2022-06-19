import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { PostEntity } from '../../posts/entities/post.entity';
import { CommentEntity } from '../../posts/entities/comment.entity';

export class CreateUserDto {
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  imgUrl?: string;

  @IsBoolean()
  status?: boolean;

  @IsArray()
  posts?: PostEntity[];

  @IsArray()
  comments?: CommentEntity[];

  @IsArray()
  sentFriendRequest?: FriendRequestEntity[];

  @IsArray()
  receivedFriendRequests?: FriendRequestEntity[];
}
