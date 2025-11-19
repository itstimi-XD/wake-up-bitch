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
    // Get top users sorted by points (database-level sorting and pagination)
    const topUsers = await this.userRepository.findTopByPoints(limit, offset);

    // Calculate leaderboard entries with proper ranking
    const leaderboardEntries: LeaderboardEntry[] = topUsers.map((user, index) => ({
      ...this._mapUserToLeaderboardEntry(user),
      rank: offset + index + 1, // Calculate rank based on offset
    }));

    // Get current user separately if not in top results
    let currentUserEntry: LeaderboardEntry | undefined;
    const currentUser = await this.userRepository.findById(userId);

    if (currentUser) {
      // Check if user is in the current page
      const userInPage = leaderboardEntries.find((entry) => entry.userId === userId);

      if (userInPage) {
        currentUserEntry = userInPage;
      } else {
        // Calculate user's actual rank efficiently using database query
        const userRank = await this.userRepository.getUserRankByPoints(userId);

        if (userRank !== null) {
          currentUserEntry = {
            ...this._mapUserToLeaderboardEntry(currentUser),
            rank: userRank,
          };
        }
      }
    }

    // Get total player count
    const totalPlayers = await this.userRepository.countAll();

    return {
      leaderboard: leaderboardEntries,
      currentUser: currentUserEntry,
      totalPlayers,
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
