import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequestEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
