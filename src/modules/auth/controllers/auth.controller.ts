import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserEntity } from '../../users/entities/user.entity';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerAccount(createUserDto);
  }

  @Post('login')
  login(@Body() user: UserEntity): Observable<{ token: string }> {
    return this.authService
      .login(user)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }
}
