import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { UserEntity } from '../../auth/entities/user.entity';

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
