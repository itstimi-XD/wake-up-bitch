import { AlarmHistory } from '../entities';
import { AlarmStatus } from '@shared/enums';

export interface IAlarmHistoryRepository {
  findById(id: string): Promise<AlarmHistory | null>;
  findByUserId(userId: string, limit?: number): Promise<AlarmHistory[]>;
  findByAlarmId(alarmId: string, limit?: number): Promise<AlarmHistory[]>;
  create(history: Partial<AlarmHistory>): Promise<AlarmHistory>;
  update(id: string, data: Partial<AlarmHistory>): Promise<AlarmHistory>;
  findByStatus(status: AlarmStatus): Promise<AlarmHistory[]>;
  getSuccessRate(userId: string, days?: number): Promise<number>;
  getStatsByUserId(userId: string): Promise<{
    totalAlarms: number;
    successfulAlarms: number;
    successRate: number;
    averageDismissTime: number;
  }>;
}
