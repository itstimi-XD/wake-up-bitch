import { Alarm } from '../entities';

export interface IAlarmRepository {
  findById(id: string): Promise<Alarm | null>;
  findByUserId(userId: string): Promise<Alarm[]>;
  findActiveByUserId(userId: string): Promise<Alarm[]>;
  create(alarm: Partial<Alarm>): Promise<Alarm>;
  update(id: string, data: Partial<Alarm>): Promise<Alarm>;
  delete(id: string): Promise<void>;
  toggle(id: string): Promise<Alarm>;
  findScheduledAlarms(): Promise<Alarm[]>;
}
