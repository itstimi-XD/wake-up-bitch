import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  BLOCKED = 'BLOCKED',
}

@Entity('friendships')
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'requester_id', type: 'uuid' })
  requesterId: string;

  @Column({ name: 'addressee_id', type: 'uuid' })
  addresseeId: string;

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'accepted_at', type: 'timestamp', nullable: true })
  acceptedAt: Date | null;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;

  // Domain methods
  accept(): void {
    this.status = FriendshipStatus.ACCEPTED;
    this.acceptedAt = new Date();
  }

  decline(): void {
    this.status = FriendshipStatus.DECLINED;
  }

  block(): void {
    this.status = FriendshipStatus.BLOCKED;
  }

  isAccepted(): boolean {
    return this.status === FriendshipStatus.ACCEPTED;
  }

  isPending(): boolean {
    return this.status === FriendshipStatus.PENDING;
  }
}
