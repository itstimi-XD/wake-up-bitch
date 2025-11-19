import { Friendship } from '../entities/friendship.entity';

export interface IFriendshipRepository {
  create(friendship: Friendship): Promise<Friendship>;
  findById(id: string): Promise<Friendship | null>;
  findByUserId(userId: string): Promise<Friendship[]>;
  findPendingRequests(userId: string): Promise<Friendship[]>;
  findByUserIds(userId1: string, userId2: string): Promise<Friendship | null>;
  update(friendship: Friendship): Promise<Friendship>;
  delete(id: string): Promise<void>;
}
