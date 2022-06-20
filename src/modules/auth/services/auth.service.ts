import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { from, switchMap, Observable, of, map, tap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/entities/user.entity';
import { JWTPayload } from '../interfaces/auth.interface';
import { CreateLoginDto } from '../dto/create-login.dto';
import { CreateRegisterDto } from '../dto/create-register.dto';
import {
  ApiResponse,
  AuthResponse,
} from '../../../core/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      switchMap((user: UserEntity) => {
        return of(!!user);
      }),
    );
  }

  registerAccount(
    createRegisterDto: CreateRegisterDto,
  ): Observable<ApiResponse<UserEntity>> {
    return this.doesUserExist(createRegisterDto.email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            {
              status: false,
              message:
                'A user has already been created with this email address.',
            },
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(createRegisterDto.password).pipe(
          switchMap((hashedPassword: string) => {
            createRegisterDto.password = hashedPassword;
            return from(this.userRepository.save(createRegisterDto)).pipe(
              switchMap((user: UserEntity) => {
                return of({
                  status: true,
                  message: 'The user has been created successfully.',
                  data: [user],
                });
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<UserEntity> {
    return from(
      this.userRepository.findOne({
        where: { email: Like(email), status: true },
      }),
    ).pipe(
      switchMap((user: UserEntity) => {
        if (!user) return of(user);

        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) return user;
          }),
        );
      }),
    );
  }

  login(createLoginDto: CreateLoginDto): Observable<AuthResponse> {
    const { email, password } = createLoginDto;

    return this.validateUser(email, password).pipe(
      switchMap((user: UserEntity) => {
        if (!user)
          throw new HttpException(
            {
              status: false,
              message: 'The email or password is incorrect.',
            },
            HttpStatus.UNAUTHORIZED,
          );

        const { id } = user;
        const payload: JWTPayload = { userId: id };

        return from(this.jwtService.signAsync(payload)).pipe(
          switchMap((token: string) => {
            return of({
              status: true,
              message: 'Successfully login.',
              token,
              uid: id,
            });
          }),
        );
      }),
    );
  }
}
