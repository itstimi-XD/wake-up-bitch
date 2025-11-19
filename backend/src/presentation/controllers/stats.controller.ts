import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GetUserStatsUseCase } from '@application/use-cases/stats/get-user-stats.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly getUserStatsUseCase: GetUserStatsUseCase) {}

  @Get('me')
  async getMyStats(@Request() req) {
    return this.getUserStatsUseCase.execute(req.user.sub);
  }
}
