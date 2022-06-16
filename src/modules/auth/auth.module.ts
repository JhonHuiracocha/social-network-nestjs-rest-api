import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { FriendRequest } from './entities/friend-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequest])],
  providers: [AuthService, UserService],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
