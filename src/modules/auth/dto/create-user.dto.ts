import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequest } from '../entities/friend-request.entity';

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

  @IsNotEmpty()
  @IsString()
  imgUrl: string;

  @IsBoolean()
  status?: boolean;

  @IsArray()
  sentFriendRequest?: FriendRequest[];

  @IsArray()
  receivedFriendRequests?: FriendRequest[];
}
