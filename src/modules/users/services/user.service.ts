import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, switchMap, Observable, of } from 'rxjs';
import { In, Repository } from 'typeorm';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';
import { UserEntity } from '../entities/user.entity';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { CommentEntity } from '../../posts/entities/comment.entity';
import { CreateCommentDto } from '../../posts/dto/create-comment.dto';
import { PostEntity } from '../../posts/entities/post.entity';
import { PostService } from '../../posts/services/post.service';
import { ApiResponse } from '../../../core/interfaces/response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly postService: PostService,
  ) {}

  findUserById(id: string): Observable<UserEntity> {
    return from(this.userRepository.findOne({ where: { id, status: true } }));
  }

  hasRequestBeenSentOrReceived(
    creator: UserEntity,
    receiver: UserEntity,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: {
          creator: {
            id: creator.id,
          },
          receiver: {
            id: receiver.id,
          },
        },
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequestEntity) => {
        console.log(friendRequest);
        if (!friendRequest) return of(false);
        return of(true);
      }),
    );
  }

  sendFriendRequest(
    receiverId: string,
    creator: UserEntity,
  ): Observable<ApiResponse<FriendRequestEntity>> {
    if (receiverId === creator.id)
      throw new HttpException(
        { status: false, message: 'It is not possible to add yourself.' },
        HttpStatus.CONFLICT,
      );

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: UserEntity) => {
        if (!receiver)
          throw new HttpException(
            { status: false, message: 'The user has not been found.' },
            HttpStatus.NOT_FOUND,
          );

        return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived)
              throw new HttpException(
                {
                  status: false,
                  message:
                    'A friend request has already been sent of received to your account.',
                },
                HttpStatus.CONFLICT,
              );

            return from(
              this.friendRequestRepository.save({ creator, receiver }),
            ).pipe(
              switchMap((friendRequest: FriendRequestEntity) => {
                return of({
                  status: true,
                  message: 'The friend request has been sent successfully.',
                  data: [friendRequest],
                });
              }),
            );
          }),
        );
      }),
    );
  }

  getFriendRequestUserById(
    friendRequestId: string,
  ): Observable<FriendRequestEntity> {
    return from(
      this.friendRequestRepository.findOne({ where: { id: friendRequestId } }),
    );
  }

  respondToFriendRequest(
    statusResponse: FriendRequestStatus,
    friendRequestId: string,
  ): Observable<ApiResponse<FriendRequestEntity>> {
    return this.getFriendRequestUserById(friendRequestId).pipe(
      switchMap((friendRequest: FriendRequestEntity) => {
        if (!friendRequest)
          throw new HttpException(
            {
              status: false,
              message: 'The friend request has not been found.',
            },
            HttpStatus.NOT_FOUND,
          );

        return from(
          this.friendRequestRepository.save({
            ...friendRequest,
            status: statusResponse,
          }),
        ).pipe(
          switchMap((friendRequest: FriendRequestEntity) => {
            return of({
              status: true,
              message: 'Successfully changed friend request status.',
              data: [friendRequest],
            });
          }),
        );
      }),
    );
  }

  getFriends(currentUser: UserEntity): Observable<ApiResponse<UserEntity>> {
    return from(
      this.friendRequestRepository.find({
        where: [
          { creator: currentUser, status: FriendRequestStatus.ACCEPTED },
          { receiver: currentUser, status: FriendRequestStatus.ACCEPTED },
        ],
        relations: ['creator', 'receiver'],
      }),
    ).pipe(
      switchMap((friendRequests: FriendRequestEntity[]) => {
        let userIds: string[] = [];

        friendRequests.forEach((friend: FriendRequestEntity) => {
          if (friend.creator.id === currentUser.id) {
            userIds.push(friend.receiver.id);
          } else if (friend.receiver.id === currentUser.id) {
            userIds.push(friend.creator.id);
          }
        });

        return from(
          this.userRepository.find({ where: { id: In(userIds) } }),
        ).pipe(
          switchMap((friends: UserEntity[]) => {
            return of({ status: true, data: friends });
          }),
        );
      }),
    );
  }

  createPostComment(
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Observable<ApiResponse<CommentEntity>> {
    return from(
      this.postService.findPostById(postId).pipe(
        switchMap((post: PostEntity) => {
          createCommentDto.post = post;
          return from(this.commentRepository.save(createCommentDto)).pipe(
            switchMap((coment: CommentEntity) => {
              return of({
                status: true,
                message: 'The comment has been created successfully.',
                data: [coment],
              });
            }),
          );
        }),
      ),
    );
  }
}
