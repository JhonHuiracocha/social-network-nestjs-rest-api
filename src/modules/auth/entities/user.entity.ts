import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequest } from './friend-request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 40, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  imgUrl: string;

  @Column({ default: true })
  status: boolean;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.creator)
  sentFriendRequest: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];
}
