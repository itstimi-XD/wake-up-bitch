import { Injectable, Inject } from '@nestjs/common';
import { FCMService } from '@infrastructure/services/fcm.service';
import { IUserRepository } from '@domain/repositories/user.repository.interface';

export enum AlarmNotificationType {
  ALARM_TRIGGERED = 'ALARM_TRIGGERED',
  ALARM_SNOOZED = 'ALARM_SNOOZED',
  MISSION_FAILED = 'MISSION_FAILED',
  STREAK_BROKEN = 'STREAK_BROKEN',
  REMINDER = 'REMINDER',
}

interface AlarmNotificationData {
  type: AlarmNotificationType;
  alarmId: string;
  alarmName: string;
  missionsCount?: number;
  streakDays?: number;
}

@Injectable()
export class SendAlarmNotificationUseCase {
  constructor(
    private readonly fcmService: FCMService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, data: AlarmNotificationData): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.fcmToken) {
      return false;
    }

    const { title, body } = this.getNotificationContent(data);

    return this.fcmService.sendToDevice(user.fcmToken, {
      title,
      body,
      data: {
        type: 'ALARM',
        alarmId: data.alarmId,
        notificationType: data.type,
      },
    });
  }

  private getNotificationContent(data: AlarmNotificationData): {
    title: string;
    body: string;
  } {
    switch (data.type) {
      case AlarmNotificationType.ALARM_TRIGGERED:
        return {
          title: `⏰ ${data.alarmName}`,
          body: `Wake up! Complete ${data.missionsCount} mission${data.missionsCount > 1 ? 's' : ''} to stop the alarm.`,
        };

      case AlarmNotificationType.ALARM_SNOOZED:
        return {
          title: '😴 Snooze Alert',
          body: `You snoozed "${data.alarmName}". Get up before it's too late!`,
        };

      case AlarmNotificationType.MISSION_FAILED:
        return {
          title: '❌ Mission Failed',
          body: `You failed to complete the missions for "${data.alarmName}". Try harder tomorrow!`,
        };

      case AlarmNotificationType.STREAK_BROKEN:
        return {
          title: '💔 Streak Broken',
          body: `Your ${data.streakDays}-day streak is broken. Start fresh tomorrow!`,
        };

      case AlarmNotificationType.REMINDER:
        return {
          title: '🌙 Bedtime Reminder',
          body: `Your alarm "${data.alarmName}" is set for tomorrow. Get some rest!`,
        };

      default:
        return {
          title: 'Alarm Update',
          body: `Update on alarm "${data.alarmName}"`,
        };
    }
  }
}
