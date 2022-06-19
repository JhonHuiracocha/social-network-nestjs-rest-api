import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegisterDto {
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
}
