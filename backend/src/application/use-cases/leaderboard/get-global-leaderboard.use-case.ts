import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: number;
  totalPoints: number;
  weeklyPoints: number;
  successRate: number;
  totalAlarms: number;
  successfulAlarms: number;
  currentStreak: number;
  avatar?: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  currentUser?: LeaderboardEntry;
  totalPlayers: number;
}

@Injectable()
export class GetGlobalLeaderboardUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<LeaderboardResponse> {
    // Get all users sorted by points
    const allUsers = await this.userRepository.findAll();

    // Calculate leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = allUsers
      .map((user) => this._mapUserToLeaderboardEntry(user))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    // Get paginated results
    const paginatedLeaderboard = leaderboardEntries.slice(
      offset,
      offset + limit,
    );

    // Find current user's position
    const currentUserEntry = leaderboardEntries.find(
      (entry) => entry.userId === userId,
    );

    return {
      leaderboard: paginatedLeaderboard,
      currentUser: currentUserEntry,
      totalPlayers: leaderboardEntries.length,
    };
  }

  private _mapUserToLeaderboardEntry(user: User): LeaderboardEntry {
    const totalAlarms = user.successfulAlarms + user.failedAlarms;
    const successRate =
      totalAlarms > 0 ? (user.successfulAlarms / totalAlarms) * 100 : 0;

    return {
      userId: user.id,
      username: user.username,
      rank: 0, // Will be set later
      totalPoints: user.points,
      weeklyPoints: user.weeklyPoints || 0,
      successRate: Math.round(successRate),
      totalAlarms,
      successfulAlarms: user.successfulAlarms,
      currentStreak: user.currentStreak,
      avatar: user.avatar,
    };
  }
}
