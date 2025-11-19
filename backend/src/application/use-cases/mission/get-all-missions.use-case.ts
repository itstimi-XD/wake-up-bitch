import { Injectable } from '@nestjs/common';
import { IMissionRepository } from '@domain/repositories';
import { Mission } from '@domain/entities';

@Injectable()
export class GetAllMissionsUseCase {
  constructor(private readonly missionRepository: IMissionRepository) {}

  async execute(): Promise<Mission[]> {
    return this.missionRepository.findActive();
  }
}
