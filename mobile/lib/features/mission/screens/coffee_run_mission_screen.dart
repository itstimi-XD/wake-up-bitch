import 'package:flutter/material.dart';
import 'dart:async';
import '../../../core/constants/app_colors.dart';

class CoffeeRunMissionScreen extends StatefulWidget {
  final String alarmId;
  final int targetSteps;

  const CoffeeRunMissionScreen({
    Key? key,
    required this.alarmId,
    this.targetSteps = 50,
  }) : super(key: key);

  @override
  State<CoffeeRunMissionScreen> createState() => _CoffeeRunMissionScreenState();
}

class _CoffeeRunMissionScreenState extends State<CoffeeRunMissionScreen>
    with SingleTickerProviderStateMixin {
  int _currentSteps = 0;
  late AnimationController _walkAnimationController;
  Timer? _stepTimer;

  @override
  void initState() {
    super.initState();
    _walkAnimationController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    )..repeat(reverse: true);

    // TODO: Initialize pedometer
    // _initializePedometer();

    // Simulate steps for now
    _simulateSteps();
  }

  @override
  void dispose() {
    _walkAnimationController.dispose();
    _stepTimer?.cancel();
    super.dispose();
  }

  void _simulateSteps() {
    _stepTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (_currentSteps < widget.targetSteps) {
        setState(() {
          _currentSteps++;
        });

        if (_currentSteps >= widget.targetSteps) {
          _onMissionComplete();
        }
      }
    });
  }

  void _onMissionComplete() {
    _stepTimer?.cancel();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '☕ 카페인 충전 완료!',
          style: TextStyle(color: AppColors.billsDueGold, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '목표 달성!',
              style: TextStyle(color: AppColors.textPrimary, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Text(
              '${_currentSteps}걸음 걸었어요! 🚶',
              style: const TextStyle(color: AppColors.secondary),
            ),
            const SizedBox(height: 8),
            const Text(
              '이제 커피 한 잔 하세요!',
              style: TextStyle(color: AppColors.textSecondary),
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
              Navigator.of(context).pop(true);
            },
            child: const Text('확인'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final progress = _currentSteps / widget.targetSteps;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Header
              const Text(
                '☕ 카페인 충전 ☕',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.billsDueGold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                '걸어서 커피 타러 가세요!',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 40),

              // Walking animation
              Expanded(
                child: Center(
                  child: AnimatedBuilder(
                    animation: _walkAnimationController,
                    builder: (context, child) {
                      return Transform.translate(
                        offset: Offset(
                          0,
                          _walkAnimationController.value * 10,
                        ),
                        child: child,
                      );
                    },
                    child: Container(
                      width: 200,
                      height: 200,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: RadialGradient(
                          colors: [
                            AppColors.billsDueGold.withOpacity(0.3),
                            AppColors.billsDueGold.withOpacity(0.1),
                            Colors.transparent,
                          ],
                        ),
                      ),
                      child: const Center(
                        child: Text(
                          '🚶',
                          style: TextStyle(fontSize: 100),
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Steps counter
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '$_currentSteps',
                    style: const TextStyle(
                      fontSize: 56,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  Text(
                    ' / ${widget.targetSteps}',
                    style: const TextStyle(
                      fontSize: 28,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 8),

              const Text(
                '걸음',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 18,
                ),
              ),

              const SizedBox(height: 24),

              // Progress bar
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: progress,
                  backgroundColor: AppColors.surfaceDark,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    AppColors.billsDueGold,
                  ),
                  minHeight: 12,
                ),
              ),

              const SizedBox(height: 24),

              // Info
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(
                          Icons.directions_walk,
                          color: AppColors.secondary,
                          size: 20,
                        ),
                        SizedBox(width: 8),
                        Text(
                          '걸으면 자동으로 카운트됩니다',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '침대에서 일어나서 걸어다니세요!\n집 안을 걸어다녀도 됩니다.',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Coffee tip
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.billsDueGold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: AppColors.billsDueGold.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: const [
                    Text(
                      '💡',
                      style: TextStyle(fontSize: 20),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '실제로 커피 타러 가면 더 좋아요!',
                        style: TextStyle(
                          color: AppColors.billsDueGold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
