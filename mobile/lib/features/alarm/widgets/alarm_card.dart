import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../shared/models/alarm_model.dart';

class AlarmCard extends StatelessWidget {
  final AlarmModel alarm;
  final Function(bool) onToggle;
  final VoidCallback onTap;
  final VoidCallback onDelete;

  const AlarmCard({
    super.key,
    required this.alarm,
    required this.onToggle,
    required this.onTap,
    required this.onDelete,
  });

  String _getDaysText() {
    if (alarm.daysOfWeek.length == 7) {
      return '매일';
    } else if (alarm.daysOfWeek.length == 5 &&
        !alarm.daysOfWeek.contains(0) &&
        !alarm.daysOfWeek.contains(6)) {
      return '평일';
    } else if (alarm.daysOfWeek.length == 2 &&
        alarm.daysOfWeek.contains(0) &&
        alarm.daysOfWeek.contains(6)) {
      return '주말';
    } else {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return alarm.daysOfWeek.map((d) => days[d]).join(', ');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          alarm.time,
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: alarm.isActive
                                    ? AppColors.textPrimary
                                    : AppColors.textSecondary,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          alarm.name,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: alarm.isActive
                                    ? AppColors.textPrimary
                                    : AppColors.textSecondary,
                              ),
                        ),
                      ],
                    ),
                  ),
                  Switch(
                    value: alarm.isActive,
                    onChanged: onToggle,
                    activeColor: AppColors.primary,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(
                    Icons.calendar_today,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _getDaysText(),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(width: 16),
                  if (alarm.missions.isNotEmpty) ...[
                    Icon(
                      Icons.games_outlined,
                      size: 16,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${alarm.missions.length}개 미션',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ],
              ),
              if (alarm.missions.isNotEmpty) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: alarm.missions.map((mission) {
                    return Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: _getMissionColor(mission.missionType),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            _getMissionIcon(mission.missionType),
                            style: const TextStyle(fontSize: 14),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            mission.missionType.displayName,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: _getMissionColor(mission.missionType),
                                ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Color _getMissionColor(MissionType type) {
    switch (type) {
      case MissionType.bossFight:
        return AppColors.bossFightRed;
      case MissionType.billsDue:
        return AppColors.billsDueGold;
      case MissionType.realityCheck:
        return AppColors.realityCheckBlue;
      case MissionType.moneyTime:
        return AppColors.moneyGreen;
      case MissionType.slapAwake:
        return AppColors.slapOrange;
      case MissionType.selfieRoast:
        return AppColors.selfieRoastPink;
      case MissionType.voicePower:
        return AppColors.voicePowerPurple;
      case MissionType.coffeeRun:
        return AppColors.coffeeRunBrown;
    }
  }

  String _getMissionIcon(MissionType type) {
    switch (type) {
      case MissionType.bossFight:
        return '⚔️';
      case MissionType.billsDue:
        return '💰';
      case MissionType.realityCheck:
        return '✅';
      case MissionType.moneyTime:
        return '💵';
      case MissionType.slapAwake:
        return '👋';
      case MissionType.selfieRoast:
        return '🤳';
      case MissionType.voicePower:
        return '📢';
      case MissionType.coffeeRun:
        return '☕';
    }
  }
}
