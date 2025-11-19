import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

@Injectable()
export class FCMService {
  private readonly logger = new Logger(FCMService.name);
  private readonly app: admin.app.App;

  constructor(private configService: ConfigService) {
    try {
      const projectId = this.configService.get<string>('FCM_PROJECT_ID');
      const privateKey = this.configService
        .get<string>('FCM_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n');
      const clientEmail = this.configService.get<string>('FCM_CLIENT_EMAIL');

      if (!projectId || !privateKey || !clientEmail) {
        this.logger.warn('FCM credentials not configured. Push notifications will be disabled.');
        return;
      }

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });

      this.logger.log('FCM initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize FCM', error);
    }
  }

  async sendToDevice(
    deviceToken: string,
    payload: NotificationPayload,
  ): Promise<boolean> {
    if (!this.app) {
      this.logger.warn('FCM not initialized. Skipping notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        token: deviceToken,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'wake_up_bitch_alarms',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending notification to ${deviceToken}:`, error);
      return false;
    }
  }

  async sendToMultipleDevices(
    deviceTokens: string[],
    payload: NotificationPayload,
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!this.app || deviceTokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens: deviceTokens,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'wake_up_bitch_alarms',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      this.logger.log(
        `Successfully sent ${response.successCount}/${deviceTokens.length} messages`,
      );

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      this.logger.error('Error sending multicast notification:', error);
      return { successCount: 0, failureCount: deviceTokens.length };
    }
  }

  async sendToTopic(topic: string, payload: NotificationPayload): Promise<boolean> {
    if (!this.app) {
      this.logger.warn('FCM not initialized. Skipping notification.');
      return false;
    }

    try {
      const message: admin.messaging.Message = {
        topic,
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data || {},
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message to topic ${topic}: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`Error sending notification to topic ${topic}:`, error);
      return false;
    }
  }

  async subscribeToTopic(deviceTokens: string[], topic: string): Promise<boolean> {
    if (!this.app) {
      return false;
    }

    try {
      const response = await admin.messaging().subscribeToTopic(deviceTokens, topic);
      this.logger.log(`Successfully subscribed ${response.successCount} devices to ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Error subscribing to topic ${topic}:`, error);
      return false;
    }
  }

  async unsubscribeFromTopic(deviceTokens: string[], topic: string): Promise<boolean> {
    if (!this.app) {
      return false;
    }

    try {
      const response = await admin.messaging().unsubscribeFromTopic(deviceTokens, topic);
      this.logger.log(`Successfully unsubscribed ${response.successCount} devices from ${topic}`);
      return true;
    } catch (error) {
      this.logger.error(`Error unsubscribing from topic ${topic}:`, error);
      return false;
    }
  }
}
