import 'package:flutter/material.dart';
import 'dart:math';
import 'package:shake/shake.dart';
import '../../../core/constants/app_colors.dart';

class SlapAwakeMissionScreen extends StatefulWidget {
  final String alarmId;
  final int targetSlaps;

  const SlapAwakeMissionScreen({
    Key? key,
    required this.alarmId,
    this.targetSlaps = 20,
  }) : super(key: key);

  @override
  State<SlapAwakeMissionScreen> createState() => _SlapAwakeMissionScreenState();
}

class _SlapAwakeMissionScreenState extends State<SlapAwakeMissionScreen>
    with TickerProviderStateMixin {
  int _currentSlaps = 0;
  late AnimationController _slapAnimationController;
  late AnimationController _phoneAnimationController;
  final Random _random = Random();
  bool _isShaking = false;
  double _shakeIntensity = 0.0;
  ShakeDetector? _shakeDetector;

  @override
  void initState() {
    super.initState();
    _slapAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _phoneAnimationController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    )..repeat(reverse: true);

    _initializeShakeDetector();
  }

  @override
  void dispose() {
    _shakeDetector?.stopListening();
    _slapAnimationController.dispose();
    _phoneAnimationController.dispose();
    super.dispose();
  }

  void _initializeShakeDetector() {
    _shakeDetector = ShakeDetector.autoStart(
      onPhoneShake: () {
        _onShakeDetected();
      },
      minimumShakeCount: 1,
      shakeSlopTimeMS: 500,
      shakeCountResetTime: 3000,
      shakeThresholdGravity: 2.7,
    );
  }

  void _onShakeDetected() {
    if (_currentSlaps >= widget.targetSlaps) return;

    setState(() {
      _currentSlaps++;
      _shakeIntensity = _random.nextDouble();
    });

    _slapAnimationController.forward(from: 0);

    if (_currentSlaps >= widget.targetSlaps) {
      _onMissionComplete();
    }
  }

  // Also allow manual taps for testing
  void _onManualTap() {
    _onShakeDetected();
  }

  void _onMissionComplete() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '👏 정신 차렸어요!',
          style: TextStyle(color: AppColors.primary, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '완전히 잠에서 깨어났습니다!',
              style: TextStyle(color: AppColors.textPrimary, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Text(
              '$_currentSlaps번의 슬랩으로 각성!',
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
    final progress = _currentSlaps / widget.targetSlaps;

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
                    '👋 정신차려! 👋',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '화면을 연속으로 때려서 잠에서 깨세요!',
                    style: TextStyle(color: AppColors.textSecondary),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // Phone illustration
            Expanded(
              child: Center(
                child: AnimatedBuilder(
                  animation: _slapAnimationController,
                  builder: (context, child) {
                    final offset = sin(_slapAnimationController.value * pi * 4) * 20;
                    final rotation = sin(_slapAnimationController.value * pi * 2) * 0.2;
                    return Transform.translate(
                      offset: Offset(offset, 0),
                      child: Transform.rotate(
                        angle: rotation,
                        child: child,
                      ),
                    );
                  },
                  child: GestureDetector(
                    onTap: _onManualTap,
                    onPanUpdate: (_) => _onManualTap(),
                    child: Container(
                      width: 200,
                      height: 360,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceDark,
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(
                          color: AppColors.primary,
                          width: 4,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.3),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            AnimatedBuilder(
                              animation: _phoneAnimationController,
                              builder: (context, child) {
                                return Transform.scale(
                                  scale: 1.0 + _phoneAnimationController.value * 0.2,
                                  child: child,
                                );
                              },
                              child: const Icon(
                                Icons.phone_iphone,
                                size: 100,
                                color: AppColors.primary,
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              '때려!',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$_currentSlaps',
                        style: const TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      Text(
                        ' / ${widget.targetSlaps}',
                        style: const TextStyle(
                          fontSize: 24,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '화면을 계속 때리세요!',
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
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceDark,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(
                          Icons.info_outline,
                          color: AppColors.secondary,
                          size: 16,
                        ),
                        SizedBox(width: 8),
                        Flexible(
                          child: Text(
                            '화면을 빠르게 여러 번 탭하거나\n폰을 흔들어도 됩니다!',
                            style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 12,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
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
