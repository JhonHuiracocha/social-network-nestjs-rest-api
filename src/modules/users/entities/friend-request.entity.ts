import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { FriendRequestStatus } from './friend-request-status.enum';

@Entity('friend_requests')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.sentFriendRequest, {
    nullable: false,
  })
  creator: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.receivedFriendRequests,
    {
      nullable: false,
    },
  )
  receiver: UserEntity;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
