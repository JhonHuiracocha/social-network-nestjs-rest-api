import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
