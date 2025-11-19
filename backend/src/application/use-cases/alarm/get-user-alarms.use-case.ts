import { Injectable } from '@nestjs/common';
import { IAlarmRepository } from '@domain/repositories';
import { Alarm } from '@domain/entities';

@Injectable()
export class GetUserAlarmsUseCase {
  constructor(private readonly alarmRepository: IAlarmRepository) {}

  async execute(userId: string): Promise<Alarm[]> {
    return this.alarmRepository.findByUserId(userId);
  }
}
