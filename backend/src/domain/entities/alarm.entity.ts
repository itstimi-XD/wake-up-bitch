import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AlarmMission } from './alarm-mission.entity';
import { AlarmHistory } from './alarm-history.entity';

@Entity('alarms')
export class Alarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'time' })
  time: string; // HH:mm format

  @Column({ name: 'days_of_week', type: 'jsonb' })
  daysOfWeek: number[]; // [0-6] where 0 is Sunday

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sound_id', length: 50 })
  soundId: string;

  @Column({ type: 'int', default: 80 })
  volume: number; // 0-100

  @Column({ name: 'vibration_pattern', type: 'jsonb', nullable: true })
  vibrationPattern: number[] | null; // [on, off, on, off, ...] in milliseconds

  @Column({ name: 'snooze_enabled', default: true })
  snoozeEnabled: boolean;

  @Column({ name: 'snooze_duration', type: 'int', default: 5 })
  snoozeDuration: number; // minutes

  @Column({ name: 'prevent_sleep_again', default: false })
  preventSleepAgain: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.alarms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => AlarmMission, (alarmMission) => alarmMission.alarm, {
    cascade: true,
    eager: true,
  })
  missions: AlarmMission[];

  @OneToMany(() => AlarmHistory, (history) => history.alarm)
  histories: AlarmHistory[];

  // Domain methods
  toggle(): void {
    this.isActive = !this.isActive;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  isScheduledForToday(): boolean {
    const today = new Date().getDay();
    return this.daysOfWeek.includes(today);
  }

  shouldTriggerNow(): boolean {
    if (!this.isActive) return false;
    if (!this.isScheduledForToday()) return false;

    const now = new Date();
    const [hours, minutes] = this.time.split(':').map(Number);
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);

    // Check if current time is within 1 minute of alarm time
    const diff = Math.abs(now.getTime() - alarmTime.getTime());
    return diff < 60000; // 1 minute in milliseconds
  }

  addMission(alarmMission: AlarmMission): void {
    if (!this.missions) {
      this.missions = [];
    }
    this.missions.push(alarmMission);
  }

  removeMission(missionId: string): void {
    if (!this.missions) return;
    this.missions = this.missions.filter((m) => m.id !== missionId);
  }

  updateMissionOrder(missionId: string, newOrder: number): void {
    const mission = this.missions.find((m) => m.id === missionId);
    if (mission) {
      mission.sequenceOrder = newOrder;
    }
  }
}
