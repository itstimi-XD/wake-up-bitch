import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { AlarmHistory } from '@domain/entities';
import { IAlarmHistoryRepository } from '@domain/repositories';
import { AlarmStatus } from '@shared/enums';

@Injectable()
export class AlarmHistoryRepository implements IAlarmHistoryRepository {
  constructor(
    @InjectRepository(AlarmHistory)
    private readonly repository: Repository<AlarmHistory>,
  ) {}

  async findById(id: string): Promise<AlarmHistory | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['missionAttempts', 'missionAttempts.mission'],
    });
  }

  async findByUserId(userId: string, limit: number = 50): Promise<AlarmHistory[]> {
    return this.repository.find({
      where: { userId },
      relations: ['alarm', 'missionAttempts'],
      order: { triggeredAt: 'DESC' },
      take: limit,
    });
  }

  async findByAlarmId(alarmId: string, limit: number = 50): Promise<AlarmHistory[]> {
    return this.repository.find({
      where: { alarmId },
      relations: ['missionAttempts'],
      order: { triggeredAt: 'DESC' },
      take: limit,
    });
  }

  async create(data: Partial<AlarmHistory>): Promise<AlarmHistory> {
    const history = this.repository.create(data);
    return this.repository.save(history);
  }

  async update(id: string, data: Partial<AlarmHistory>): Promise<AlarmHistory> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('AlarmHistory not found after update');
    }
    return updated;
  }

  async findByStatus(status: AlarmStatus): Promise<AlarmHistory[]> {
    return this.repository.find({
      where: { status },
      order: { triggeredAt: 'DESC' },
    });
  }

  async getSuccessRate(userId: string, days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await this.repository
      .createQueryBuilder('history')
      .select('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN history.success = true THEN 1 ELSE 0 END)',
        'successful',
      )
      .where('history.userId = :userId', { userId })
      .andWhere('history.triggeredAt >= :startDate', { startDate })
      .getRawOne();

    const total = parseInt(result.total);
    const successful = parseInt(result.successful);

    if (total === 0) return 0;
    return (successful / total) * 100;
  }

  async getStatsByUserId(userId: string): Promise<{
    totalAlarms: number;
    successfulAlarms: number;
    successRate: number;
    averageDismissTime: number;
  }> {
    const result = await this.repository
      .createQueryBuilder('history')
      .select('COUNT(*)', 'total')
      .addSelect(
        'SUM(CASE WHEN history.success = true THEN 1 ELSE 0 END)',
        'successful',
      )
      .addSelect(
        `AVG(EXTRACT(EPOCH FROM (history.dismissedAt - history.triggeredAt)))`,
        'avgDismissTime',
      )
      .where('history.userId = :userId', { userId })
      .andWhere('history.dismissedAt IS NOT NULL')
      .getRawOne();

    const totalAlarms = parseInt(result.total) || 0;
    const successfulAlarms = parseInt(result.successful) || 0;
    const successRate = totalAlarms > 0 ? (successfulAlarms / totalAlarms) * 100 : 0;
    const averageDismissTime = parseFloat(result.avgDismissTime) || 0;

    return {
      totalAlarms,
      successfulAlarms,
      successRate,
      averageDismissTime,
    };
  }
}
