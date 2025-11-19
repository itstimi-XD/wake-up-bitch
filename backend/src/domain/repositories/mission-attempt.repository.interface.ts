import { MissionAttempt } from '../entities';
import { MissionType } from '@shared/enums';

export interface IMissionAttemptRepository {
  findById(id: string): Promise<MissionAttempt | null>;
  findByAlarmHistoryId(alarmHistoryId: string): Promise<MissionAttempt[]>;
  findByUserId(userId: string, limit?: number): Promise<MissionAttempt[]>;
  create(attempt: Partial<MissionAttempt>): Promise<MissionAttempt>;
  update(id: string, data: Partial<MissionAttempt>): Promise<MissionAttempt>;
  getStatsByMissionType(
    userId: string,
    missionType: MissionType,
  ): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
    averageScore: number;
  }>;
}
