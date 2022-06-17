import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';

export class CreatePostDto {
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsBoolean()
  status?: boolean;

  @IsNotEmpty()
  @IsObject()
  author: UserEntity;
}
