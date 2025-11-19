import { Injectable } from '@nestjs/common';
import { IAlarmRepository } from '@domain/repositories';
import { Alarm } from '@domain/entities';
import { NotFoundException } from '@shared/exceptions/base.exception';

@Injectable()
export class ToggleAlarmUseCase {
  constructor(private readonly alarmRepository: IAlarmRepository) {}

  async execute(alarmId: string, userId: string): Promise<Alarm> {
    const alarm = await this.alarmRepository.findById(alarmId);

    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }

    if (alarm.userId !== userId) {
      throw new NotFoundException('Alarm not found');
    }

    return this.alarmRepository.toggle(alarmId);
  }
}
