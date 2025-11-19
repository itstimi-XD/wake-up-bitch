import 'package:flutter/material.dart';
import 'dart:math';
import '../../../core/constants/app_colors.dart';

class BossFightMissionScreen extends StatefulWidget {
  final String alarmId;
  final int targetTaps;

  const BossFightMissionScreen({
    Key? key,
    required this.alarmId,
    this.targetTaps = 30,
  }) : super(key: key);

  @override
  State<BossFightMissionScreen> createState() => _BossFightMissionScreenState();
}

class _BossFightMissionScreenState extends State<BossFightMissionScreen>
    with TickerProviderStateMixin {
  int _currentTaps = 0;
  int _bossHealth = 100;
  late AnimationController _shakeController;
  late AnimationController _bossAnimationController;
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _bossAnimationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _shakeController.dispose();
    _bossAnimationController.dispose();
    super.dispose();
  }

  void _onBossTapped() {
    if (_currentTaps >= widget.targetTaps) return;

    setState(() {
      _currentTaps++;
      _bossHealth = ((1 - _currentTaps / widget.targetTaps) * 100).toInt();
    });

    // Shake animation
    _shakeController.forward(from: 0);

    // Check if mission completed
    if (_currentTaps >= widget.targetTaps) {
      _onMissionComplete();
    }
  }

  void _onMissionComplete() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '🎉 보스 격파!',
          style: TextStyle(color: AppColors.primary, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '잠에서 깨어났습니다!',
              style: TextStyle(color: AppColors.textPrimary, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Text(
              '$_currentTaps회 공격으로 승리!',
              style: const TextStyle(color: AppColors.secondary),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop(true); // Return success
            },
            child: const Text('확인'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final progress = _currentTaps / widget.targetTaps;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  const Text(
                    '⚔️ 보스 레이드 ⚔️',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '보스를 공격해서 잠에서 깨어나세요!',
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),

            // Boss Health Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        '보스 체력',
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '$_bossHealth%',
                        style: const TextStyle(
                          color: AppColors.bossFightRed,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: _bossHealth / 100,
                      backgroundColor: AppColors.surfaceDark,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        _bossHealth > 50
                            ? AppColors.bossFightRed
                            : _bossHealth > 25
                                ? Colors.orange
                                : Colors.red,
                      ),
                      minHeight: 20,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // Boss Image
            Expanded(
              child: Center(
                child: AnimatedBuilder(
                  animation: _shakeController,
                  builder: (context, child) {
                    final offset = sin(_shakeController.value * pi * 2) * 10;
                    return Transform.translate(
                      offset: Offset(offset, 0),
                      child: child,
                    );
                  },
                  child: AnimatedBuilder(
                    animation: _bossAnimationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: 1.0 + _bossAnimationController.value * 0.1,
                        child: child,
                      );
                    },
                    child: GestureDetector(
                      onTap: _onBossTapped,
                      child: Container(
                        width: 250,
                        height: 250,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              AppColors.bossFightRed.withOpacity(0.3),
                              AppColors.bossFightRed.withOpacity(0.1),
                              Colors.transparent,
                            ],
                          ),
                        ),
                        child: Center(
                          child: Text(
                            '😴',
                            style: TextStyle(
                              fontSize: 120 * (1 - progress * 0.5),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Progress
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  Text(
                    '$_currentTaps / ${widget.targetTaps}',
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '보스를 탭해서 공격하세요!',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: AppColors.surfaceDark,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.primary,
                      ),
                      minHeight: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
