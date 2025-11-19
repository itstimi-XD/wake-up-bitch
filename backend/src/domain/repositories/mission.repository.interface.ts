import { Mission } from '../entities';
import { MissionType } from '@shared/enums';

export interface IMissionRepository {
  findById(id: string): Promise<Mission | null>;
  findAll(): Promise<Mission[]>;
  findByType(type: MissionType): Promise<Mission | null>;
  findActive(): Promise<Mission[]>;
  create(mission: Partial<Mission>): Promise<Mission>;
  update(id: string, data: Partial<Mission>): Promise<Mission>;
  delete(id: string): Promise<void>;
}
