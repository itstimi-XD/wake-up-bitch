import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLeaderboardQueryDto {
  @ApiProperty({
    description: 'Number of entries to return',
    example: 50,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiProperty({
    description: 'Number of entries to skip',
    example: 0,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

export class LeaderboardEntryDto {
  @ApiProperty({ example: 'uuid-1234', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 1, description: 'Rank position' })
  rank: number;

  @ApiProperty({ example: 2500, description: 'Total points' })
  totalPoints: number;

  @ApiProperty({ example: 350, description: 'Points earned this week' })
  weeklyPoints: number;

  @ApiProperty({ example: 85, description: 'Success rate percentage' })
  successRate: number;

  @ApiProperty({ example: 120, description: 'Total alarms' })
  totalAlarms: number;

  @ApiProperty({ example: 102, description: 'Successful alarms' })
  successfulAlarms: number;

  @ApiProperty({ example: 7, description: 'Current streak in days' })
  currentStreak: number;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'User avatar URL',
    required: false,
  })
  avatar?: string;
}

export class LeaderboardResponseDto {
  @ApiProperty({
    type: [LeaderboardEntryDto],
    description: 'Leaderboard entries',
  })
  leaderboard: LeaderboardEntryDto[];

  @ApiProperty({
    type: LeaderboardEntryDto,
    description: 'Current user entry (if authenticated)',
    required: false,
  })
  currentUser?: LeaderboardEntryDto;

  @ApiProperty({ example: 1250, description: 'Total number of players' })
  totalPlayers: number;
}
