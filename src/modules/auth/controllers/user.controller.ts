import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { CreateFriendRequestDto } from '../dto/create-friend-request.dto';
import { FriendRequest } from '../entities/friend-request.entity';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverId: string,
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ): Observable<FriendRequest | { error: string }> {
    return this.userService.sendFriendRequest(
      receiverId,
      createFriendRequestDto.creator,
    );
  }

  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') friendRequestId: string,
    @Body() statusResponse: FriendRequestStatus,
  ): Observable<FriendRequest> {
    return this.userService.respondToFriendRequest(
      statusResponse,
      friendRequestId,
    );
  }

  @Get('friends/my')
  getFriends(@Body() user: User): Observable<User[]> {
    return this.userService.getFriends(user);
  }
}
