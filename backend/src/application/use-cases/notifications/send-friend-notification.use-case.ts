import { Injectable, Inject } from '@nestjs/common';
import { FCMService } from '@infrastructure/services/fcm.service';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

export enum FriendNotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_ACCEPTED = 'FRIEND_ACCEPTED',
  FRIEND_DECLINED = 'FRIEND_DECLINED',
}

interface FriendNotificationData {
  type: FriendNotificationType;
  fromUserId: string;
  fromUsername: string;
  friendshipId: string;
}

@Injectable()
export class SendFriendNotificationUseCase {
  constructor(
    private readonly fcmService: FCMService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, data: FriendNotificationData): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.fcmToken) {
      return false;
    }

    const { title, body } = this.getNotificationContent(data);

    return this.fcmService.sendToDevice(user.fcmToken, {
      title,
      body,
      data: {
        type: 'FRIEND',
        friendshipId: data.friendshipId,
        notificationType: data.type,
      },
    });
  }

  private getNotificationContent(data: FriendNotificationData): {
    title: string;
    body: string;
  } {
    switch (data.type) {
      case FriendNotificationType.FRIEND_REQUEST:
        return {
          title: '👋 New Friend Request',
          body: `${data.fromUsername} wants to be your friend!`,
        };

      case FriendNotificationType.FRIEND_ACCEPTED:
        return {
          title: '🎉 Friend Request Accepted!',
          body: `${data.fromUsername} accepted your friend request. Now you can challenge each other!`,
        };

      case FriendNotificationType.FRIEND_DECLINED:
        return {
          title: 'Friend Request Declined',
          body: `${data.fromUsername} declined your friend request.`,
        };

      default:
        return {
          title: 'Friend Update',
          body: `Update from ${data.fromUsername}`,
        };
    }
  }
}
