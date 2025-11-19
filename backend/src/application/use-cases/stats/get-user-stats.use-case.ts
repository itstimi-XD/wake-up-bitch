import { Injectable } from '@nestjs/common';
import { IAlarmHistoryRepository } from '@domain/repositories';

export interface UserStatsResponse {
  totalAlarms: number;
  successfulAlarms: number;
  successRate: number;
  averageDismissTime: number;
  last7Days: {
    date: string;
    alarms: number;
    successful: number;
  }[];
  missionStats: {
    missionType: string;
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
  }[];
}

@Injectable()
export class GetUserStatsUseCase {
  constructor(
    private readonly alarmHistoryRepository: IAlarmHistoryRepository,
  ) {}

  async execute(userId: string): Promise<UserStatsResponse> {
    const stats = await this.alarmHistoryRepository.getStatsByUserId(userId);

    // Get last 7 days data
    const last7Days = await this.getLast7DaysStats(userId);

    return {
      totalAlarms: stats.totalAlarms,
      successfulAlarms: stats.successfulAlarms,
      successRate: stats.successRate,
      averageDismissTime: stats.averageDismissTime,
      last7Days,
      missionStats: [], // TODO: Implement mission stats
    };
  }

  private async getLast7DaysStats(userId: string) {
    const histories = await this.alarmHistoryRepository.findByUserId(userId, 100);
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayHistories = histories.filter((h) => {
        const hDate = new Date(h.triggeredAt).toISOString().split('T')[0];
        return hDate === dateStr;
      });

      last7Days.push({
        date: dateStr,
        alarms: dayHistories.length,
        successful: dayHistories.filter((h) => h.success).length,
      });
    }

    return last7Days;
  }
}
