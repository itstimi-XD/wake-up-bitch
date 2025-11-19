import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ChallengeResult } from './challenge-result.entity';

export enum ChallengeStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @Column({ name: 'challenger_id', type: 'uuid' })
  challengerId: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'bet_points', type: 'int', default: 100 })
  betPoints: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ChallengeStatus,
    default: ChallengeStatus.PENDING,
  })
  status: ChallengeStatus;

  @Column({ name: 'winner_id', type: 'uuid', nullable: true })
  winnerId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'challenger_id' })
  challenger: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'winner_id' })
  winner: User | null;

  @OneToMany(() => ChallengeResult, (result) => result.challenge, {
    cascade: true,
  })
  results: ChallengeResult[];

  // Domain methods
  accept(): void {
    this.status = ChallengeStatus.ACTIVE;
  }

  cancel(): void {
    this.status = ChallengeStatus.CANCELLED;
  }

  complete(winnerId: string): void {
    this.status = ChallengeStatus.COMPLETED;
    this.winnerId = winnerId;
  }

  isActive(): boolean {
    return this.status === ChallengeStatus.ACTIVE;
  }

  isPending(): boolean {
    return this.status === ChallengeStatus.PENDING;
  }

  calculateWinner(
    creatorSuccessCount: number,
    challengerSuccessCount: number,
  ): string {
    if (creatorSuccessCount > challengerSuccessCount) {
      return this.creatorId;
    } else if (challengerSuccessCount > creatorSuccessCount) {
      return this.challengerId;
    }
    // Tie: return creator as winner
    return this.creatorId;
  }
}
