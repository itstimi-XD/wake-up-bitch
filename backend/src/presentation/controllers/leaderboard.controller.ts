import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { GetGlobalLeaderboardUseCase } from '@application/use-cases/leaderboard/get-global-leaderboard.use-case';
import { GetFriendsLeaderboardUseCase } from '@application/use-cases/leaderboard/get-friends-leaderboard.use-case';
import {
  GetLeaderboardQueryDto,
  LeaderboardResponseDto,
} from '@presentation/dtos/leaderboard.dto';
import { AuthenticatedRequest } from '@presentation/types/authenticated-request.interface';

@ApiTags('Leaderboard')
@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeaderboardController {
  constructor(
    private readonly getGlobalLeaderboardUseCase: GetGlobalLeaderboardUseCase,
    private readonly getFriendsLeaderboardUseCase: GetFriendsLeaderboardUseCase,
  ) {}

  @Get('global')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get global leaderboard',
    description: 'Get the global leaderboard with top players ranked by points',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully',
    type: LeaderboardResponseDto,
  })
  async getGlobalLeaderboard(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetLeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    const userId = req.user.userId;
    return this.getGlobalLeaderboardUseCase.execute(
      userId,
      query.limit,
      query.offset,
    );
  }

  @Get('friends')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get friends leaderboard',
    description: 'Get leaderboard showing you and your friends ranked by points',
  })
  @ApiResponse({
    status: 200,
    description: 'Friends leaderboard retrieved successfully',
    type: LeaderboardResponseDto,
  })
  async getFriendsLeaderboard(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetLeaderboardQueryDto,
  ): Promise<LeaderboardResponseDto> {
    const userId = req.user.userId;
    return this.getFriendsLeaderboardUseCase.execute(
      userId,
      query.limit,
      query.offset,
    );
  }
}
