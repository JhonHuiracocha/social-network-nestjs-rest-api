import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CreateLoginDto } from '../dto/create-login.dto';
import { CreateRegisterDto } from '../dto/create-register.dto';
import {
  ApiResponse,
  AuthResponse,
} from '../../../core/interfaces/response.interface';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() createRegisterDto: CreateRegisterDto,
  ): Observable<ApiResponse<UserEntity>> {
    return this.authService.registerAccount(createRegisterDto);
  }

  @Post('login')
  login(@Body() createLoginDto: CreateLoginDto): Observable<AuthResponse> {
    return this.authService.login(createLoginDto);
  }
}
