import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { CreateFriendRequestDto } from '../dto/create-friend-request.dto';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { UserEntity } from '../entities/user.entity';
import { CommentEntity } from '../../posts/entities/comment.entity';
import { CreateCommentDto } from '../../posts/dto/create-comment.dto';
import { ApiResponse } from '../../../core/interfaces/response.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverId: string,
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ): Observable<ApiResponse<FriendRequestEntity>> {
    return this.userService.sendFriendRequest(
      receiverId,
      createFriendRequestDto.creator,
    );
  }

  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') friendRequestId: string,
    @Body('status') statusResponse: FriendRequestStatus,
  ): Observable<ApiResponse<FriendRequestEntity>> {
    return this.userService.respondToFriendRequest(
      statusResponse,
      friendRequestId,
    );
  }

  @Get('friends/my')
  getFriends(@Body() user: UserEntity): Observable<ApiResponse<UserEntity>> {
    return this.userService.getFriends(user);
  }

  @Post('post-comment/send/:postId')
  createPostComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Observable<ApiResponse<CommentEntity>> {
    return this.userService.createPostComment(postId, createCommentDto);
  }
}
