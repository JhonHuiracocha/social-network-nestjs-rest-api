import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { CommentEntity } from '../posts/entities/comment.entity';
import { PostService } from '../posts/services/post.service';
import { PostEntity } from '../posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      CommentEntity,
      PostEntity,
    ]),
  ],
  providers: [UserService, PostService],
  controllers: [UserController],
})
export class UsersModule {}
