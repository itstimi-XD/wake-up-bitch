import 'package:flutter/material.dart';
import 'dart:async';
import '../../../core/constants/app_colors.dart';

class BillsDueMissionScreen extends StatefulWidget {
  final String alarmId;
  final int minuteExpense; // Cost per minute in KRW
  final int targetSeconds;

  const BillsDueMissionScreen({
    Key? key,
    required this.alarmId,
    required this.minuteExpense,
    this.targetSeconds = 60,
  }) : super(key: key);

  @override
  State<BillsDueMissionScreen> createState() => _BillsDueMissionScreenState();
}

class _BillsDueMissionScreenState extends State<BillsDueMissionScreen>
    with SingleTickerProviderStateMixin {
  late Timer _timer;
  int _elapsedSeconds = 0;
  bool _isCalculating = true;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _startTimer();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _timer.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _elapsedSeconds++;
      });
    });
  }

  double get _moneyWasted {
    return (_elapsedSeconds / 60.0) * widget.minuteExpense;
  }

  void _onWakeUp() {
    _timer.cancel();
    setState(() {
      _isCalculating = false;
    });

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '💰 현실 직시 완료!',
          style: TextStyle(color: AppColors.billsDueGold, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '늦잠으로 날린 돈:',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              '₩${_moneyWasted.toStringAsFixed(0)}',
              style: const TextStyle(
                color: AppColors.bossFightRed,
                fontSize: 36,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              '다음엔 더 빨리 일어나세요!',
              style: TextStyle(color: AppColors.textPrimary),
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

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final secs = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
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
                    '💸 청구서가 기다려 💸',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.billsDueGold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '늦잠 잘수록 돈이 날아가요!',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // Money Counter
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
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
                          color: AppColors.billsDueGold.withOpacity(0.3),
                          width: 2,
                        ),
                      ),
                      child: Text(
                        _formatTime(_elapsedSeconds),
                        style: const TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                          fontFeatureSettings: [
                            FontFeature.tabularFigures(),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 40),

                    // Money Wasted
                    const Text(
                      '날린 돈',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 8),
                    AnimatedBuilder(
                      animation: _pulseController,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: 1.0 + _pulseController.value * 0.1,
                          child: child,
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 40,
                          vertical: 20,
                        ),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppColors.bossFightRed.withOpacity(0.2),
                              AppColors.bossFightRed.withOpacity(0.1),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: AppColors.bossFightRed,
                            width: 2,
                          ),
                        ),
                        child: Text(
                          '₩${_moneyWasted.toStringAsFixed(0)}',
                          style: const TextStyle(
                            fontSize: 56,
                            fontWeight: FontWeight.bold,
                            color: AppColors.bossFightRed,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Cost breakdown
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
                                '분당 비용: ₩${widget.minuteExpense}',
                                style: const TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            '= 월세 + 카드값 + 고정비 ÷ 30일 ÷ 1440분',
                            style: TextStyle(
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
                  if (_elapsedSeconds >= widget.targetSeconds) ...[
                    const Text(
                      '충분히 현실을 직시했어요!',
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
                            ? '일어났어요! 💪'
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
                    '시간은 돈입니다. 일찍 일어나세요!',
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
