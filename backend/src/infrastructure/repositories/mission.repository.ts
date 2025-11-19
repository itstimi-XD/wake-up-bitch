import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from '@domain/entities';
import { IMissionRepository } from '@domain/repositories';
import { MissionType } from '@shared/enums';

@Injectable()
export class MissionRepository implements IMissionRepository {
  constructor(
    @InjectRepository(Mission)
    private readonly repository: Repository<Mission>,
  ) {}

  async findById(id: string): Promise<Mission | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Mission[]> {
    return this.repository.find({ order: { type: 'ASC' } });
  }

  async findByType(type: MissionType): Promise<Mission | null> {
    return this.repository.findOne({ where: { type } });
  }

  async findActive(): Promise<Mission[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { type: 'ASC' },
    });
  }

  async create(data: Partial<Mission>): Promise<Mission> {
    const mission = this.repository.create(data);
    return this.repository.save(mission);
  }

  async update(id: string, data: Partial<Mission>): Promise<Mission> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Mission not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
