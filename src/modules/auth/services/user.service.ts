import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, switchMap, Observable, of } from 'rxjs';
import { In, Repository } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { UserEntity } from '../entities/user.entity';
import { FriendRequestStatus } from '../entities/friend-request-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  findUserById(id: string): Observable<UserEntity> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: UserEntity) => {
        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        delete user.password;
        return user;
      }),
    );
  }

  hasRequestBeenSentOrReceived(
    creator: UserEntity,
    receiver: UserEntity,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequest) => {
        if (!friendRequest) return of(false);
        return of(true);
      }),
    );
  }

  sendFriendRequest(
    receiverId: string,
    creator: UserEntity,
  ): Observable<FriendRequest | { error: string }> {
    if (receiverId === creator.id)
      return of({ error: 'It is not possible to add yourself!' });

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: UserEntity) => {
        return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived)
              return of({
                error:
                  'A friend request has already been sent of received to your account!',
              });
            return from(
              this.friendRequestRepository.save({ creator, receiver }),
            );
          }),
        );
      }),
    );
  }

  getFriendRequestUserById(friendRequestId: string): Observable<FriendRequest> {
    return from(
      this.friendRequestRepository.findOne({ where: { id: friendRequestId } }),
    );
  }

  respondToFriendRequest(
    statusResponse: FriendRequestStatus,
    friendRequestId: string,
  ): Observable<FriendRequest> {
    return this.getFriendRequestUserById(friendRequestId).pipe(
      switchMap((friendRequest: FriendRequest) => {
        return from(
          this.friendRequestRepository.save({
            ...friendRequest,
            status: statusResponse['status'],
          }),
        );
      }),
    );
  }

  getFriends(currentUser: UserEntity): Observable<UserEntity[]> {
    return from(
      this.friendRequestRepository.find({
        where: [
          { creator: currentUser, status: FriendRequestStatus.ACCEPTED },
          { receiver: currentUser, status: FriendRequestStatus.ACCEPTED },
        ],
        relations: ['creator', 'receiver'],
      }),
    ).pipe(
      switchMap((friends: FriendRequest[]) => {
        let userIds: string[] = [];
        friends.forEach((friend: FriendRequest) => {
          if (friend.creator.id === currentUser.id) {
            userIds.push(friend.receiver.id);
          } else if (friend.receiver.id === currentUser.id) {
            userIds.push(friend.creator.id);
          }
        });

        return from(this.userRepository.find({ where: { id: In(userIds) } }));
      }),
    );
  }
}
