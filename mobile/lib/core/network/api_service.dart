import 'package:dio/dio.dart';
import 'package:wake_up_bitch/core/storage/secure_storage_service.dart';
import 'package:wake_up_bitch/core/constants/app_constants.dart';

class ApiService {
  late final Dio _dio;
  final SecureStorageService _storage;

  ApiService(this._storage) {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.apiBaseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Request interceptor to add auth token
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token expired, try to refresh
          final refreshed = await _refreshToken();
          if (refreshed) {
            // Retry the request
            return handler.resolve(await _retry(error.requestOptions));
          } else {
            // Refresh failed, logout
            await _storage.deleteTokens();
          }
        }
        return handler.next(error);
      },
    ));
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await _dio.post('/auth/refresh', data: {
        'refreshToken': refreshToken,
      });

      if (response.statusCode == 200) {
        await _storage.saveTokens(
          response.data['accessToken'],
          response.data['refreshToken'],
        );
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<Response<dynamic>> _retry(RequestOptions requestOptions) async {
    final options = Options(
      method: requestOptions.method,
      headers: requestOptions.headers,
    );
    return _dio.request<dynamic>(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }

  // Auth APIs
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String username,
  }) async {
    final response = await _dio.post('/auth/register', data: {
      'email': email,
      'password': password,
      'username': username,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    // Save tokens
    if (response.data['accessToken'] != null) {
      await _storage.saveTokens(
        response.data['accessToken'],
        response.data['refreshToken'] ?? '',
      );
      await _storage.saveUserInfo(
        response.data['user']['id'],
        response.data['user']['email'],
      );
    }

    return response.data;
  }

  Future<void> logout() async {
    await _storage.deleteTokens();
  }

  // Mission APIs
  Future<Map<String, dynamic>> recordMissionAttempt({
    required String alarmHistoryId,
    required String missionId,
    required bool success,
    int? score,
    Map<String, dynamic>? data,
  }) async {
    final response = await _dio.post('/missions/attempts', data: {
      'alarmHistoryId': alarmHistoryId,
      'missionId': missionId,
      'success': success,
      if (score != null) 'score': score,
      if (data != null) 'data': data,
    });
    return response.data;
  }

  // Alarm APIs
  Future<List<dynamic>> getAlarms() async {
    final response = await _dio.get('/alarms');
    return response.data;
  }

  Future<Map<String, dynamic>> createAlarm(Map<String, dynamic> data) async {
    final response = await _dio.post('/alarms', data: data);
    return response.data;
  }

  // User APIs
  Future<Map<String, dynamic>> getUserProfile() async {
    final response = await _dio.get('/users/me');
    return response.data;
  }

  Future<Map<String, dynamic>> updateFinancialProfile(
      Map<String, dynamic> data) async {
    final response = await _dio.put('/users/me/financial-profile', data: data);
    return response.data;
  }

  // Weather API
  Future<Map<String, dynamic>> getWeather({
    required double latitude,
    required double longitude,
  }) async {
    final response = await _dio.get('/weather', queryParameters: {
      'latitude': latitude,
      'longitude': longitude,
    });
    return response.data;
  }

  // Leaderboard APIs
  Future<Map<String, dynamic>> getGlobalLeaderboard({
    int limit = 50,
    int offset = 0,
  }) async {
    final response = await _dio.get('/leaderboard/global', queryParameters: {
      'limit': limit,
      'offset': offset,
    });
    return response.data;
  }
}
