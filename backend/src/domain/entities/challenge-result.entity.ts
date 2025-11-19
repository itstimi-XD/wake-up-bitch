import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Challenge } from './challenge.entity';
import { User } from './user.entity';

@Entity('challenge_results')
export class ChallengeResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'challenge_id', type: 'uuid' })
  challengeId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'woke_up_at', type: 'timestamp', nullable: true })
  wokeUpAt: Date | null;

  @Column({ default: false })
  success: boolean;

  @Column({ name: 'points_earned', type: 'int', default: 0 })
  pointsEarned: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Challenge, (challenge) => challenge.results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Domain methods
  recordSuccess(wokeUpTime: Date): void {
    this.wokeUpAt = wokeUpTime;
    this.success = true;
  }

  recordFailure(): void {
    this.success = false;
  }
}
