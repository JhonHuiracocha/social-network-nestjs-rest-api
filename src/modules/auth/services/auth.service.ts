import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, switchMap, Observable, of, map, tap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../users/entities/user.entity';
import { JWTPayload } from '../interfaces/auth.interface';
import { CreateLoginDto } from '../dto/create-login.dto';
import { CreateRegisterDto } from '../dto/create-register.dto';

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
  ): Observable<UserEntity> {
    return this.doesUserExist(createRegisterDto.email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(createRegisterDto.password).pipe(
          switchMap((hashedPassword: string) => {
            createRegisterDto.password = hashedPassword;
            return from(this.userRepository.save(createRegisterDto));
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<UserEntity> {
    return from(
      this.userRepository.findOne({ where: { email, status: true } }),
    ).pipe(
      switchMap((user: UserEntity) => {
        if (!user)
          throw new HttpException(
            'Invalid Credentials.',
            HttpStatus.UNAUTHORIZED,
          );

        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (!isValidPassword)
              throw new HttpException(
                'Invalid Credentials.',
                HttpStatus.UNAUTHORIZED,
              );

            return user;
          }),
        );
      }),
    );
  }

  login(createLoginDto: CreateLoginDto): Observable<string> {
    const { email, password } = createLoginDto;

    return this.validateUser(email, password).pipe(
      switchMap((user: UserEntity) => {
        if (user) {
          const payload: JWTPayload = { userId: user.id };
          return from(this.jwtService.signAsync(payload));
        }
      }),
    );
  }
}
