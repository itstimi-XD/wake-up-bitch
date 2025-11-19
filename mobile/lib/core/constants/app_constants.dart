class AppConstants {
  // App Info
  static const String appName = 'Wake Up Bitch';
  static const String appVersion = '1.0.0';

  // API
  static const String baseUrl = 'http://localhost:3000/api/v1';
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';

  // Alarm
  static const int defaultVolume = 80;
  static const int defaultSnoozeDuration = 5; // minutes
  static const int maxAlarms = 20;

  // Mission
  static const int defaultMissionTimeout = 300; // seconds
  static const int bossFightDefaultHP = 100;
  static const int slapAwakeDefaultTaps = 50;
  static const int powerWalkDefaultSteps = 30;
}
