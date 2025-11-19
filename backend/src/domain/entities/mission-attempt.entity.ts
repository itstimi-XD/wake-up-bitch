import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AlarmHistory } from './alarm-history.entity';
import { Mission } from './mission.entity';

@Entity('mission_attempts')
export class MissionAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alarm_history_id', type: 'uuid' })
  alarmHistoryId: string;

  @Column({ name: 'mission_id', type: 'uuid' })
  missionId: string;

  @Column({ name: 'started_at', type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ default: false })
  success: boolean;

  @Column({ type: 'int', default: 1 })
  attempts: number;

  @Column({ type: 'int', nullable: true })
  score: number | null;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any> | null;

  // Relations
  @ManyToOne(() => AlarmHistory, (history) => history.missionAttempts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alarm_history_id' })
  alarmHistory: AlarmHistory;

  @ManyToOne(() => Mission, (mission) => mission.attempts)
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  // Domain methods
  start(): void {
    this.startedAt = new Date();
  }

  complete(success: boolean, score?: number, data?: Record<string, any>): void {
    this.completedAt = new Date();
    this.success = success;
    if (score !== undefined) {
      this.score = score;
    }
    if (data) {
      this.data = this.data ? { ...this.data, ...data } : data;
    }
  }

  fail(): void {
    this.complete(false);
  }

  succeed(score?: number, data?: Record<string, any>): void {
    this.complete(true, score, data);
  }

  retry(): void {
    this.attempts++;
    this.completedAt = null;
    this.success = false;
  }

  getDuration(): number | null {
    if (!this.completedAt) return null;
    return this.completedAt.getTime() - this.startedAt.getTime();
  }

  updateData(data: Record<string, any>): void {
    this.data = this.data ? { ...this.data, ...data } : data;
  }
}
