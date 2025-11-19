import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GetAllMissionsUseCase } from '@application/use-cases/mission/get-all-missions.use-case';
import { RecordMissionAttemptUseCase } from '@application/use-cases/mission/record-mission-attempt.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('missions')
export class MissionController {
  constructor(
    private readonly getAllMissionsUseCase: GetAllMissionsUseCase,
    private readonly recordMissionAttemptUseCase: RecordMissionAttemptUseCase,
  ) {}

  @Get()
  async findAll() {
    return this.getAllMissionsUseCase.execute();
  }

  @Post('attempts')
  @UseGuards(JwtAuthGuard)
  async recordAttempt(
    @Request() req,
    @Body()
    dto: {
      alarmHistoryId: string;
      missionId: string;
      success: boolean;
      score?: number;
      attempts?: number;
      data?: Record<string, any>;
    },
  ) {
    return this.recordMissionAttemptUseCase.execute(
      dto.alarmHistoryId,
      dto.missionId,
      dto,
    );
  }
}
