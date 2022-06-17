import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { PostEntity } from '../../posts/entities/post.entity';

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
  sentFriendRequest?: FriendRequestEntity[];

  @IsArray()
  receivedFriendRequests?: FriendRequestEntity[];
}
