import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, switchMap, Observable, of, map, tap } from 'rxjs';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      switchMap((user: UserEntity) => {
        return of(!!user);
      }),
    );
  }

  registerAccount(createUserDto: CreateUserDto): Observable<UserEntity> {
    return this.doesUserExist(createUserDto.email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return from(this.userRepository.save(createUserDto)).pipe(
          map((user: UserEntity) => user),
        );
      }),
    );
  }
}
