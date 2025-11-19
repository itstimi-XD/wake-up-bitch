import { Injectable } from '@nestjs/common';
import { IAlarmRepository, IMissionRepository } from '@domain/repositories';
import { Alarm, AlarmMission } from '@domain/entities';
import { DifficultyLevel, MissionType } from '@shared/enums';
import { NotFoundException, BadRequestException } from '@shared/exceptions/base.exception';

export interface CreateAlarmDto {
  userId: string;
  name: string;
  time: string;
  daysOfWeek: number[];
  soundId: string;
  volume?: number;
  vibrationPattern?: number[];
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
  preventSleepAgain?: boolean;
  missions: Array<{
    missionType: MissionType;
    difficulty: DifficultyLevel;
    sequenceOrder: number;
    config?: Record<string, any>;
  }>;
}

@Injectable()
export class CreateAlarmUseCase {
  constructor(
    private readonly alarmRepository: IAlarmRepository,
    private readonly missionRepository: IMissionRepository,
  ) {}

  async execute(dto: CreateAlarmDto): Promise<Alarm> {
    // Validate time format (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(dto.time)) {
      throw new BadRequestException('Invalid time format. Use HH:MM format.');
    }

    // Validate days of week
    if (!dto.daysOfWeek || dto.daysOfWeek.length === 0) {
      throw new BadRequestException('At least one day must be selected');
    }

    const invalidDays = dto.daysOfWeek.filter((day) => day < 0 || day > 6);
    if (invalidDays.length > 0) {
      throw new BadRequestException('Days of week must be between 0-6');
    }

    // Create alarm
    const alarm = await this.alarmRepository.create({
      userId: dto.userId,
      name: dto.name,
      time: dto.time,
      daysOfWeek: dto.daysOfWeek,
      soundId: dto.soundId,
      volume: dto.volume ?? 80,
      vibrationPattern: dto.vibrationPattern ?? null,
      snoozeEnabled: dto.snoozeEnabled ?? true,
      snoozeDuration: dto.snoozeDuration ?? 5,
      preventSleepAgain: dto.preventSleepAgain ?? false,
      isActive: true,
    });

    // Add missions if provided
    if (dto.missions && dto.missions.length > 0) {
      for (const missionDto of dto.missions) {
        const mission = await this.missionRepository.findByType(missionDto.missionType);
        if (!mission) {
          throw new NotFoundException(`Mission type ${missionDto.missionType} not found`);
        }

        const alarmMission = new AlarmMission();
        alarmMission.alarmId = alarm.id;
        alarmMission.missionId = mission.id;
        alarmMission.difficulty = missionDto.difficulty;
        alarmMission.sequenceOrder = missionDto.sequenceOrder;
        alarmMission.config = missionDto.config || null;

        alarm.addMission(alarmMission);
      }

      await this.alarmRepository.update(alarm.id, alarm);
    }

    return this.alarmRepository.findById(alarm.id) as Promise<Alarm>;
  }
}
