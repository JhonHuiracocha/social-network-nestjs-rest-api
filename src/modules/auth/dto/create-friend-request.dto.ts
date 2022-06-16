import { IsEnum, IsObject, IsString } from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';

export class CreateFriendRequestDto {
  @IsString()
  id?: string;

  @IsObject()
  creator: UserEntity;

  @IsObject()
  receiver: UserEntity;

  @IsEnum(FriendRequestStatus)
  status?: FriendRequestStatus;
}
