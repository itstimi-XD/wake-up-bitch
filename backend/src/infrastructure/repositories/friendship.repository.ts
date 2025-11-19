import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship, FriendshipStatus } from '@domain/entities/friendship.entity';
import { IFriendshipRepository } from '@domain/repositories/friendship.repository.interface';

@Injectable()
export class FriendshipRepository implements IFriendshipRepository {
  constructor(
    @InjectRepository(Friendship)
    private readonly repository: Repository<Friendship>,
  ) {}

  async create(friendship: Friendship): Promise<Friendship> {
    return this.repository.save(friendship);
  }

  async findById(id: string): Promise<Friendship | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Friendship[]> {
    return this.repository.find({
      where: [
        { requesterId: userId, status: FriendshipStatus.ACCEPTED },
        { addresseeId: userId, status: FriendshipStatus.ACCEPTED },
      ],
      relations: ['requester', 'addressee'],
    });
  }

  async findPendingRequests(userId: string): Promise<Friendship[]> {
    return this.repository.find({
      where: {
        addresseeId: userId,
        status: FriendshipStatus.PENDING,
      },
      relations: ['requester', 'addressee'],
    });
  }

  async findByUserIds(
    userId1: string,
    userId2: string,
  ): Promise<Friendship | null> {
    return this.repository.findOne({
      where: [
        { requesterId: userId1, addresseeId: userId2 },
        { requesterId: userId2, addresseeId: userId1 },
      ],
    });
  }

  async update(friendship: Friendship): Promise<Friendship> {
    return this.repository.save(friendship);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
