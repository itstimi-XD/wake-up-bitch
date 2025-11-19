import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { IFriendshipRepository } from '@domain/repositories/friendship.repository.interface';
import { LeaderboardEntry, LeaderboardResponse } from './get-global-leaderboard.use-case';

@Injectable()
export class GetFriendsLeaderboardUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IFriendshipRepository')
    private readonly friendshipRepository: IFriendshipRepository,
  ) {}

  async execute(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<LeaderboardResponse> {
    // Get user's friends
    const friendships = await this.friendshipRepository.findByUserId(userId);
    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId,
    );

    // Include the current user in the leaderboard
    const userIdsToFetch = [userId, ...friendIds];

    // Fetch all users (current user + friends)
    const users = await Promise.all(
      userIdsToFetch.map((id) => this.userRepository.findById(id)),
    );

    const validUsers = users.filter((user) => user !== null);

    // Calculate leaderboard entries
    const leaderboardEntries: LeaderboardEntry[] = validUsers
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

  private _mapUserToLeaderboardEntry(user: any): LeaderboardEntry {
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
