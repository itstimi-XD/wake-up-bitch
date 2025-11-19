import { User } from '../entities';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findTopByPoints(limit: number, offset: number): Promise<User[]>;
  countAll(): Promise<number>;
  getUserRankByPoints(userId: string): Promise<number | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  exists(email: string): Promise<boolean>;
}
