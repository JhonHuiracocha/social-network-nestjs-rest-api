import { Body, Controller, Post } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CreateLoginDto } from '../dto/create-login.dto';
import { CreateRegisterDto } from '../dto/create-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() createRegisterDto: CreateRegisterDto) {
    return this.authService.registerAccount(createRegisterDto);
  }

  @Post('login')
  login(@Body() createLoginDto: CreateLoginDto): Observable<{ token: string }> {
    return this.authService
      .login(createLoginDto)
      .pipe(map((jwt: string) => ({ token: jwt })));
  }
}
