import { User } from '../entities/user.entity';
import { IsEnum, IsObject, IsString } from 'class-validator';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';
export class CreateFriendRequestDto {
  @IsString()
  id?: string;

  @IsObject()
  creator: User;

  @IsObject()
  receiver: User;

  @IsEnum(FriendRequestStatus)
  status?: FriendRequestStatus;
}
