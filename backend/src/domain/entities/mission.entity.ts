import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { MissionType } from '@shared/enums';
import { AlarmMission } from './alarm-mission.entity';
import { MissionAttempt } from './mission-attempt.entity';

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MissionType })
  type: MissionType;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'difficulty_levels', type: 'jsonb' })
  difficultyLevels: {
    easy: Record<string, any>;
    medium: Record<string, any>;
    hard: Record<string, any>;
  };

  @Column({ length: 255, nullable: true })
  icon: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => AlarmMission, (alarmMission) => alarmMission.mission)
  alarmMissions: AlarmMission[];

  @OneToMany(() => MissionAttempt, (attempt) => attempt.mission)
  attempts: MissionAttempt[];

  // Domain methods
  getConfigForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Record<string, any> {
    return this.difficultyLevels[difficulty];
  }

  validate(): boolean {
    if (!this.name || !this.type) return false;
    if (!this.difficultyLevels) return false;
    if (!this.difficultyLevels.easy || !this.difficultyLevels.medium || !this.difficultyLevels.hard) {
      return false;
    }
    return true;
  }
}
