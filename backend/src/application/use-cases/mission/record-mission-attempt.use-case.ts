import { Injectable } from '@nestjs/common';
import {
  IAlarmHistoryRepository,
  IMissionAttemptRepository,
} from '@domain/repositories';
import { AlarmHistory, MissionAttempt } from '@domain/entities';
import { NotFoundException } from '@shared/exceptions/base.exception';

@Injectable()
export class RecordMissionAttemptUseCase {
  constructor(
    private readonly alarmHistoryRepository: IAlarmHistoryRepository,
    private readonly missionAttemptRepository: IMissionAttemptRepository,
  ) {}

  async execute(
    alarmHistoryId: string,
    missionId: string,
    data: {
      success: boolean;
      score?: number;
      attempts?: number;
      data?: Record<string, any>;
    },
  ): Promise<MissionAttempt> {
    const alarmHistory = await this.alarmHistoryRepository.findById(alarmHistoryId);

    if (!alarmHistory) {
      throw new NotFoundException('Alarm history not found');
    }

    const attempt = await this.missionAttemptRepository.create({
      alarmHistoryId,
      missionId,
      startedAt: new Date(),
      completedAt: new Date(),
      success: data.success,
      score: data.score || null,
      attempts: data.attempts || 1,
      data: data.data || null,
    });

    // Update alarm history
    alarmHistory.incrementAttempts();

    // Check if all missions are completed
    const allAttempts = await this.missionAttemptRepository.findByAlarmHistoryId(
      alarmHistoryId,
    );

    if (allAttempts.every((a) => a.success)) {
      alarmHistory.markAsSuccess();
      await this.alarmHistoryRepository.update(alarmHistoryId, alarmHistory);
    }

    return attempt;
  }
}
