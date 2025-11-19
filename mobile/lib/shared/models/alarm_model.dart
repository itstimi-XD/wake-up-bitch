import 'package:equatable/equatable.dart';
import 'mission_type.dart';

class AlarmModel extends Equatable {
  final String id;
  final String userId;
  final String name;
  final String time; // HH:mm format
  final List<int> daysOfWeek; // 0-6 (Sunday-Saturday)
  final bool isActive;
  final String soundId;
  final int volume;
  final List<int>? vibrationPattern;
  final bool snoozeEnabled;
  final int snoozeDuration;
  final bool preventSleepAgain;
  final List<AlarmMissionModel> missions;

  const AlarmModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.time,
    required this.daysOfWeek,
    required this.isActive,
    required this.soundId,
    required this.volume,
    this.vibrationPattern,
    required this.snoozeEnabled,
    required this.snoozeDuration,
    required this.preventSleepAgain,
    required this.missions,
  });

  factory AlarmModel.fromJson(Map<String, dynamic> json) {
    return AlarmModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      name: json['name'] as String,
      time: json['time'] as String,
      daysOfWeek: (json['daysOfWeek'] as List).cast<int>(),
      isActive: json['isActive'] as bool,
      soundId: json['soundId'] as String,
      volume: json['volume'] as int,
      vibrationPattern: json['vibrationPattern'] != null
          ? (json['vibrationPattern'] as List).cast<int>()
          : null,
      snoozeEnabled: json['snoozeEnabled'] as bool,
      snoozeDuration: json['snoozeDuration'] as int,
      preventSleepAgain: json['preventSleepAgain'] as bool,
      missions: (json['missions'] as List?)
              ?.map((e) =>
                  AlarmMissionModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'time': time,
      'daysOfWeek': daysOfWeek,
      'isActive': isActive,
      'soundId': soundId,
      'volume': volume,
      'vibrationPattern': vibrationPattern,
      'snoozeEnabled': snoozeEnabled,
      'snoozeDuration': snoozeDuration,
      'preventSleepAgain': preventSleepAgain,
      'missions': missions.map((m) => m.toJson()).toList(),
    };
  }

  AlarmModel copyWith({
    String? id,
    String? userId,
    String? name,
    String? time,
    List<int>? daysOfWeek,
    bool? isActive,
    String? soundId,
    int? volume,
    List<int>? vibrationPattern,
    bool? snoozeEnabled,
    int? snoozeDuration,
    bool? preventSleepAgain,
    List<AlarmMissionModel>? missions,
  }) {
    return AlarmModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      time: time ?? this.time,
      daysOfWeek: daysOfWeek ?? this.daysOfWeek,
      isActive: isActive ?? this.isActive,
      soundId: soundId ?? this.soundId,
      volume: volume ?? this.volume,
      vibrationPattern: vibrationPattern ?? this.vibrationPattern,
      snoozeEnabled: snoozeEnabled ?? this.snoozeEnabled,
      snoozeDuration: snoozeDuration ?? this.snoozeDuration,
      preventSleepAgain: preventSleepAgain ?? this.preventSleepAgain,
      missions: missions ?? this.missions,
    );
  }

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        time,
        daysOfWeek,
        isActive,
        soundId,
        volume,
        vibrationPattern,
        snoozeEnabled,
        snoozeDuration,
        preventSleepAgain,
        missions,
      ];
}

class AlarmMissionModel extends Equatable {
  final String id;
  final String alarmId;
  final String missionId;
  final MissionType missionType;
  final DifficultyLevel difficulty;
  final int sequenceOrder;
  final Map<String, dynamic>? config;

  const AlarmMissionModel({
    required this.id,
    required this.alarmId,
    required this.missionId,
    required this.missionType,
    required this.difficulty,
    required this.sequenceOrder,
    this.config,
  });

  factory AlarmMissionModel.fromJson(Map<String, dynamic> json) {
    return AlarmMissionModel(
      id: json['id'] as String,
      alarmId: json['alarmId'] as String,
      missionId: json['missionId'] as String,
      missionType: MissionType.fromValue(
        json['mission']?['type'] ?? json['missionType'],
      ),
      difficulty: DifficultyLevel.fromValue(json['difficulty'] as String),
      sequenceOrder: json['sequenceOrder'] as int,
      config: json['config'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'alarmId': alarmId,
      'missionId': missionId,
      'missionType': missionType.value,
      'difficulty': difficulty.value,
      'sequenceOrder': sequenceOrder,
      'config': config,
    };
  }

  @override
  List<Object?> get props => [
        id,
        alarmId,
        missionId,
        missionType,
        difficulty,
        sequenceOrder,
        config,
      ];
}
