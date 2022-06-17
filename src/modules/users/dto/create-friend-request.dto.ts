import { IsEnum, IsObject, IsString } from 'class-validator';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';
import { UserEntity } from '../entities/user.entity';

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
