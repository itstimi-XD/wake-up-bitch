import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities';
import { IUserRepository } from '@domain/repositories';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('User not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async exists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findTopByPoints(limit: number, offset: number): Promise<User[]> {
    return this.repository.find({
      order: {
        points: 'DESC',
      },
      take: limit,
      skip: offset,
    });
  }

  async countAll(): Promise<number> {
    return this.repository.count();
  }

  async getUserRankByPoints(userId: string): Promise<number | null> {
    const user = await this.findById(userId);
    if (!user) {
      return null;
    }

    // Count how many users have more points (efficient database query)
    const higherRankedCount = await this.repository
      .createQueryBuilder('user')
      .where('user.points > :userPoints', { userPoints: user.points })
      .getCount();

    // Rank is count of higher-ranked users + 1
    return higherRankedCount + 1;
  }
}
