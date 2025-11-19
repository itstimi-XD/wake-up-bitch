import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MissionAttempt } from '@domain/entities';
import { IMissionAttemptRepository } from '@domain/repositories';
import { MissionType } from '@shared/enums';

@Injectable()
export class MissionAttemptRepository implements IMissionAttemptRepository {
  constructor(
    @InjectRepository(MissionAttempt)
    private readonly repository: Repository<MissionAttempt>,
  ) {}

  async findById(id: string): Promise<MissionAttempt | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['mission', 'alarmHistory'],
    });
  }

  async findByAlarmHistoryId(alarmHistoryId: string): Promise<MissionAttempt[]> {
    return this.repository.find({
      where: { alarmHistoryId },
      relations: ['mission'],
      order: { startedAt: 'ASC' },
    });
  }

  async findByUserId(userId: string, limit: number = 100): Promise<MissionAttempt[]> {
    return this.repository
      .createQueryBuilder('attempt')
      .leftJoinAndSelect('attempt.mission', 'mission')
      .leftJoin('attempt.alarmHistory', 'history')
      .where('history.userId = :userId', { userId })
      .orderBy('attempt.startedAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async create(data: Partial<MissionAttempt>): Promise<MissionAttempt> {
    const attempt = this.repository.create(data);
    return this.repository.save(attempt);
  }

  async update(id: string, data: Partial<MissionAttempt>): Promise<MissionAttempt> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('MissionAttempt not found after update');
    }
    return updated;
  }

  async getStatsByMissionType(
    userId: string,
    missionType: MissionType,
  ): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    successRate: number;
    averageScore: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('attempt')
      .select('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN attempt.success = true THEN 1 ELSE 0 END)',
        'successful',
      )
      .addSelect('AVG(attempt.score)', 'avgScore')
      .leftJoin('attempt.mission', 'mission')
      .leftJoin('attempt.alarmHistory', 'history')
      .where('history.userId = :userId', { userId })
      .andWhere('mission.type = :missionType', { missionType })
      .getRawOne();

    const totalAttempts = parseInt(result.total) || 0;
    const successfulAttempts = parseInt(result.successful) || 0;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;
    const averageScore = parseFloat(result.avgScore) || 0;

    return {
      totalAttempts,
      successfulAttempts,
      successRate,
      averageScore,
    };
  }
}
