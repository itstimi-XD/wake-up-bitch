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
import { Alarm } from './alarm.entity';
import { MissionAttempt } from './mission-attempt.entity';
import { AlarmStatus } from '@shared/enums';

@Entity('alarm_histories')
export class AlarmHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alarm_id', type: 'uuid' })
  alarmId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'triggered_at', type: 'timestamp' })
  triggeredAt: Date;

  @Column({ name: 'dismissed_at', type: 'timestamp', nullable: true })
  dismissedAt: Date | null;

  @Column({ type: 'enum', enum: AlarmStatus })
  status: AlarmStatus;

  @Column({ name: 'total_attempts', type: 'int', default: 0 })
  totalAttempts: number;

  @Column({ default: false })
  success: boolean;

  // Relations
  @ManyToOne(() => Alarm, (alarm) => alarm.histories)
  @JoinColumn({ name: 'alarm_id' })
  alarm: Alarm;

  @ManyToOne(() => User, (user) => user.alarmHistories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => MissionAttempt, (attempt) => attempt.alarmHistory, {
    cascade: true,
  })
  missionAttempts: MissionAttempt[];

  // Domain methods
  trigger(): void {
    this.triggeredAt = new Date();
    this.status = AlarmStatus.TRIGGERED;
  }

  snooze(): void {
    this.status = AlarmStatus.SNOOZED;
  }

  dismiss(): void {
    this.dismissedAt = new Date();
    this.status = AlarmStatus.DISMISSED;
  }

  markAsSuccess(): void {
    this.success = true;
    this.dismiss();
  }

  markAsMissed(): void {
    this.status = AlarmStatus.MISSED;
    this.success = false;
  }

  incrementAttempts(): void {
    this.totalAttempts++;
  }

  getDuration(): number | null {
    if (!this.dismissedAt) return null;
    return this.dismissedAt.getTime() - this.triggeredAt.getTime();
  }

  addMissionAttempt(attempt: MissionAttempt): void {
    if (!this.missionAttempts) {
      this.missionAttempts = [];
    }
    this.missionAttempts.push(attempt);
  }

  areAllMissionsCompleted(): boolean {
    if (!this.missionAttempts || this.missionAttempts.length === 0) {
      return false;
    }
    return this.missionAttempts.every((attempt) => attempt.success);
  }
}
