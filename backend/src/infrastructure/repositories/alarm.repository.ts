import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from '@domain/entities';
import { IAlarmRepository } from '@domain/repositories';
import { NotFoundException } from '@shared/exceptions/base.exception';

@Injectable()
export class AlarmRepository implements IAlarmRepository {
  constructor(
    @InjectRepository(Alarm)
    private readonly repository: Repository<Alarm>,
  ) {}

  async findById(id: string): Promise<Alarm | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['missions', 'missions.mission'],
    });
  }

  async findByUserId(userId: string): Promise<Alarm[]> {
    return this.repository.find({
      where: { userId },
      relations: ['missions', 'missions.mission'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByUserId(userId: string): Promise<Alarm[]> {
    return this.repository.find({
      where: { userId, isActive: true },
      relations: ['missions', 'missions.mission'],
      order: { time: 'ASC' },
    });
  }

  async create(data: Partial<Alarm>): Promise<Alarm> {
    const alarm = this.repository.create(data);
    return this.repository.save(alarm);
  }

  async update(id: string, data: Partial<Alarm>): Promise<Alarm> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException('Alarm not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async toggle(id: string): Promise<Alarm> {
    const alarm = await this.findById(id);
    if (!alarm) {
      throw new NotFoundException('Alarm not found');
    }
    alarm.toggle();
    return this.repository.save(alarm);
  }

  async findScheduledAlarms(): Promise<Alarm[]> {
    const now = new Date();
    const currentDay = now.getDay();

    return this.repository
      .createQueryBuilder('alarm')
      .where('alarm.isActive = :isActive', { isActive: true })
      .andWhere("alarm.daysOfWeek::jsonb @> :day::jsonb", {
        day: JSON.stringify(currentDay),
      })
      .leftJoinAndSelect('alarm.missions', 'missions')
      .leftJoinAndSelect('missions.mission', 'mission')
      .getMany();
  }
}
