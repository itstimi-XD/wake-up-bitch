import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Alarm } from './alarm.entity';
import { Mission } from './mission.entity';
import { DifficultyLevel } from '@shared/enums';

@Entity('alarm_missions')
export class AlarmMission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'alarm_id', type: 'uuid' })
  alarmId: string;

  @Column({ name: 'mission_id', type: 'uuid' })
  missionId: string;

  @Column({ type: 'enum', enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @Column({ name: 'sequence_order', type: 'int' })
  sequenceOrder: number;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any> | null;

  // Relations
  @ManyToOne(() => Alarm, (alarm) => alarm.missions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'alarm_id' })
  alarm: Alarm;

  @ManyToOne(() => Mission, (mission) => mission.alarmMissions)
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  // Domain methods
  updateConfig(config: Record<string, any>): void {
    this.config = { ...this.config, ...config };
  }

  changeDifficulty(newDifficulty: DifficultyLevel): void {
    this.difficulty = newDifficulty;
  }

  moveUp(): void {
    if (this.sequenceOrder > 0) {
      this.sequenceOrder--;
    }
  }

  moveDown(): void {
    this.sequenceOrder++;
  }
}
