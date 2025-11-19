import { Injectable } from '@nestjs/common';
import { IAlarmRepository } from '@domain/repositories';
import { NotFoundException } from '@shared/exceptions/base.exception';

@Injectable()
export class DeleteAlarmUseCase {
  constructor(private readonly alarmRepository: IAlarmRepository) {}

  async execute(alarmId: string, userId: string): Promise<void> {
    const alarm = await this.alarmRepository.findById(alarmId);

    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }

    if (alarm.userId !== userId) {
      throw new NotFoundException('Alarm not found');
    }

    await this.alarmRepository.delete(alarmId);
  }
}
