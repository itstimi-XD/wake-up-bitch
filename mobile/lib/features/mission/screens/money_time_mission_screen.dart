import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';
import '../../../core/constants/app_colors.dart';

class MoneyTimeMissionScreen extends StatefulWidget {
  final String alarmId;
  final int hourlyWage; // Hourly wage in KRW
  final int targetSeconds;

  const MoneyTimeMissionScreen({
    Key? key,
    required this.alarmId,
    required this.hourlyWage,
    this.targetSeconds = 30,
  }) : super(key: key);

  @override
  State<MoneyTimeMissionScreen> createState() => _MoneyTimeMissionScreenState();
}

class _MoneyTimeMissionScreenState extends State<MoneyTimeMissionScreen>
    with TickerProviderStateMixin {
  late Timer _timer;
  int _elapsedSeconds = 0;
  late AnimationController _coinAnimationController;
  late AnimationController _counterAnimationController;

  @override
  void initState() {
    super.initState();
    _startTimer();

    _coinAnimationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat();

    _counterAnimationController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _timer.cancel();
    _coinAnimationController.dispose();
    _counterAnimationController.dispose();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _elapsedSeconds++;
      });

      if (_elapsedSeconds % 5 == 0) {
        _counterAnimationController.forward(from: 0);
      }
    });
  }

  double get _moneyEarned {
    return (_elapsedSeconds / 3600.0) * widget.hourlyWage;
  }

  double get _secondWage {
    return widget.hourlyWage / 3600.0;
  }

  void _onWakeUp() {
    if (_elapsedSeconds < widget.targetSeconds) return;

    _timer.cancel();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '💰 시간이 돈이다! 💰',
          style: TextStyle(color: AppColors.moneyGreen, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '일어나 있는 시간 동안 번 돈:',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              '₩${_moneyEarned.toStringAsFixed(0)}',
              style: const TextStyle(
                color: AppColors.moneyGreen,
                fontSize: 36,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              '시간은 돈입니다! 일찍 일어나서 더 벌어요! 💪',
              style: TextStyle(color: AppColors.textPrimary),
              textAlign: TextAlign.center,
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

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final progress = (_elapsedSeconds / widget.targetSeconds).clamp(0.0, 1.0);

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
                    '💰 돈 벌 시간 💰',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.moneyGreen,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '시간은 돈입니다! 일찍 일어나세요!',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Timer
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 32,
                vertical: 16,
              ),
              decoration: BoxDecoration(
                color: AppColors.surfaceDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppColors.moneyGreen.withOpacity(0.3),
                  width: 2,
                ),
              ),
              child: Text(
                _formatTime(_elapsedSeconds),
                style: const TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                  fontFeatureSettings: [
                    FontFeature.tabularFigures(),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),

            // Money Counter
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Coin animation
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        AnimatedBuilder(
                          animation: _coinAnimationController,
                          builder: (context, child) {
                            return Transform.rotate(
                              angle: _coinAnimationController.value * 2 * pi,
                              child: Container(
                                width: 150,
                                height: 150,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: RadialGradient(
                                    colors: [
                                      AppColors.moneyGreen.withOpacity(0.3),
                                      AppColors.moneyGreen.withOpacity(0.1),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                        const Text(
                          '💵',
                          style: TextStyle(fontSize: 80),
                        ),
                      ],
                    ),

                    const SizedBox(height: 32),

                    // Money earned
                    const Text(
                      '현재 번 돈',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 8),
                    AnimatedBuilder(
                      animation: _counterAnimationController,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: 1.0 + _counterAnimationController.value * 0.1,
                          child: child,
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppColors.moneyGreen.withOpacity(0.3),
                              AppColors.moneyGreen.withOpacity(0.1),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: AppColors.moneyGreen,
                            width: 2,
                          ),
                        ),
                        child: Text(
                          '₩${_moneyEarned.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 44,
                            fontWeight: FontWeight.bold,
                            color: AppColors.moneyGreen,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Wage info
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceDark,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.access_time,
                                color: AppColors.secondary,
                                size: 16,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '시급: ₩${widget.hourlyWage.toStringAsFixed(0)}',
                                style: const TextStyle(
                                  color: AppColors.textPrimary,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '초당 ₩${_secondWage.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Wake Up Button
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  // Progress bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: AppColors.surfaceDark,
                      valueColor: const AlwaysStoppedAnimation<Color>(
                        AppColors.moneyGreen,
                      ),
                      minHeight: 8,
                    ),
                  ),

                  const SizedBox(height: 16),

                  if (_elapsedSeconds >= widget.targetSeconds) ...[
                    const Text(
                      '충분히 돈을 벌었어요!',
                      style: TextStyle(
                        color: AppColors.moneyGreen,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _elapsedSeconds >= widget.targetSeconds
                          ? _onWakeUp
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _elapsedSeconds >= widget.targetSeconds
                            ? AppColors.primary
                            : AppColors.surfaceDark,
                        foregroundColor: Colors.white,
                        disabledBackgroundColor: AppColors.surfaceDark,
                        disabledForegroundColor:
                            AppColors.textSecondary.withOpacity(0.5),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        _elapsedSeconds >= widget.targetSeconds
                            ? '일하러 가기! 💼'
                            : '${widget.targetSeconds - _elapsedSeconds}초 후 가능',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  const Text(
                    '일찍 일어날수록 더 많이 벌어요!',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 14,
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
