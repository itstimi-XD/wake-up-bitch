import { Injectable, Inject } from '@nestjs/common';
import { FCMService } from '@infrastructure/services/fcm.service';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

export enum ChallengeNotificationType {
  NEW_CHALLENGE = 'NEW_CHALLENGE',
  CHALLENGE_ACCEPTED = 'CHALLENGE_ACCEPTED',
  CHALLENGE_DECLINED = 'CHALLENGE_DECLINED',
  CHALLENGE_COMPLETED = 'CHALLENGE_COMPLETED',
  CHALLENGE_WON = 'CHALLENGE_WON',
  CHALLENGE_LOST = 'CHALLENGE_LOST',
}

interface ChallengeNotificationData {
  type: ChallengeNotificationType;
  challengeId: string;
  challengeTitle: string;
  fromUserId: string;
  fromUsername: string;
  betPoints?: number;
}

@Injectable()
export class SendChallengeNotificationUseCase {
  constructor(
    private readonly fcmService: FCMService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, data: ChallengeNotificationData): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.fcmToken) {
      return false;
    }

    const { title, body } = this.getNotificationContent(data);

    return this.fcmService.sendToDevice(user.fcmToken, {
      title,
      body,
      data: {
        type: 'CHALLENGE',
        challengeId: data.challengeId,
        notificationType: data.type,
      },
    });
  }

  private getNotificationContent(data: ChallengeNotificationData): {
    title: string;
    body: string;
  } {
    switch (data.type) {
      case ChallengeNotificationType.NEW_CHALLENGE:
        return {
          title: '🎯 New Challenge!',
          body: `${data.fromUsername} challenged you to "${data.challengeTitle}" for ${data.betPoints} points!`,
        };

      case ChallengeNotificationType.CHALLENGE_ACCEPTED:
        return {
          title: '✅ Challenge Accepted!',
          body: `${data.fromUsername} accepted your challenge "${data.challengeTitle}". Game on!`,
        };

      case ChallengeNotificationType.CHALLENGE_DECLINED:
        return {
          title: '❌ Challenge Declined',
          body: `${data.fromUsername} declined your challenge "${data.challengeTitle}".`,
        };

      case ChallengeNotificationType.CHALLENGE_COMPLETED:
        return {
          title: '🏁 Challenge Completed!',
          body: `Challenge "${data.challengeTitle}" has ended. Check the results!`,
        };

      case ChallengeNotificationType.CHALLENGE_WON:
        return {
          title: '🎉 You Won!',
          body: `Congratulations! You won "${data.challengeTitle}" and earned ${data.betPoints} points!`,
        };

      case ChallengeNotificationType.CHALLENGE_LOST:
        return {
          title: '😔 Challenge Lost',
          body: `You lost "${data.challengeTitle}". Better luck next time!`,
        };

      default:
        return {
          title: 'Challenge Update',
          body: `Update on challenge "${data.challengeTitle}"`,
        };
    }
  }
}
