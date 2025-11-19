import { Injectable, ForbiddenException } from '@nestjs/common';
import { IAlarmRepository } from '@domain/repositories';
import { Alarm } from '@domain/entities';
import { NotFoundException } from '@shared/exceptions/base.exception';

export interface UpdateAlarmDto {
  name?: string;
  time?: string;
  daysOfWeek?: number[];
  soundId?: string;
  volume?: number;
  vibrationPattern?: number[];
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
  preventSleepAgain?: boolean;
}

@Injectable()
export class UpdateAlarmUseCase {
  constructor(private readonly alarmRepository: IAlarmRepository) {}

  async execute(alarmId: string, userId: string, dto: UpdateAlarmDto): Promise<Alarm> {
    const alarm = await this.alarmRepository.findById(alarmId);

    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }

    if (alarm.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this alarm');
    }

    return this.alarmRepository.update(alarmId, dto);
  }
}
