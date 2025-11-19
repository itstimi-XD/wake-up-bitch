import 'package:flutter/material.dart';
import 'dart:math';
import '../../../core/constants/app_colors.dart';

class VoicePowerMissionScreen extends StatefulWidget {
  final String alarmId;
  final String targetPhrase;

  const VoicePowerMissionScreen({
    Key? key,
    required this.alarmId,
    this.targetPhrase = '일어났다!',
  }) : super(key: key);

  @override
  State<VoicePowerMissionScreen> createState() =>
      _VoicePowerMissionScreenState();
}

class _VoicePowerMissionScreenState extends State<VoicePowerMissionScreen>
    with SingleTickerProviderStateMixin {
  bool _isListening = false;
  double _volumeLevel = 0.0;
  bool _phraseDetected = false;
  late AnimationController _waveController;

  final List<String> _motivationalPhrases = [
    '일어났다!',
    '오늘도 화이팅!',
    '나는 할 수 있다!',
    '아침이다!',
    '일어나자!',
  ];

  @override
  void initState() {
    super.initState();
    _waveController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _waveController.dispose();
    super.dispose();
  }

  void _startListening() {
    setState(() {
      _isListening = true;
    });

    // TODO: Implement speech recognition
    // final speech = SpeechToText();
    // await speech.initialize();
    // speech.listen(onResult: (result) {
    //   if (result.recognizedWords.contains(widget.targetPhrase)) {
    //     _onPhraseDetected();
    //   }
    // });

    // Simulate detection for now
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        _onPhraseDetected();
      }
    });

    // Simulate volume changes
    _simulateVolumeChanges();
  }

  void _simulateVolumeChanges() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_isListening && mounted && !_phraseDetected) {
        setState(() {
          _volumeLevel = Random().nextDouble();
        });
        _simulateVolumeChanges();
      }
    });
  }

  void _onPhraseDetected() {
    setState(() {
      _isListening = false;
      _phraseDetected = true;
    });

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '🎤 완벽해요!',
          style: TextStyle(color: AppColors.primary, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '목소리가 들렸어요!',
              style: TextStyle(color: AppColors.textPrimary, fontSize: 18),
            ),
            const SizedBox(height: 16),
            const Text(
              '이제 완전히 깨어났네요! 💪',
              style: TextStyle(color: AppColors.secondary),
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
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Header
              const Text(
                '🎤 외쳐라! 🎤',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                '크게 외쳐서 잠에서 깨세요!',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 40),

              // Target phrase
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppColors.accent.withOpacity(0.3),
                    width: 2,
                  ),
                ),
                child: Column(
                  children: [
                    const Text(
                      '이렇게 외치세요:',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '"${widget.targetPhrase}"',
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: AppColors.accent,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // Microphone visualization
              Expanded(
                child: Center(
                  child: AnimatedBuilder(
                    animation: _waveController,
                    builder: (context, child) {
                      return CustomPaint(
                        size: const Size(300, 300),
                        painter: _WavePainter(
                          animationValue: _waveController.value,
                          volumeLevel: _volumeLevel,
                          isListening: _isListening,
                        ),
                        child: Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _isListening
                                ? AppColors.primary.withOpacity(0.2)
                                : AppColors.surfaceDark,
                            border: Border.all(
                              color: _isListening
                                  ? AppColors.primary
                                  : AppColors.textSecondary.withOpacity(0.3),
                              width: 3,
                            ),
                          ),
                          child: Icon(
                            _isListening ? Icons.mic : Icons.mic_none,
                            size: 80,
                            color: _isListening
                                ? AppColors.primary
                                : AppColors.textSecondary,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Status text
              if (_isListening)
                const Text(
                  '듣고 있어요... 크게 외치세요!',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                )
              else if (_phraseDetected)
                const Text(
                  '✅ 인식 완료!',
                  style: TextStyle(
                    color: AppColors.moneyGreen,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                )
              else
                const Text(
                  '버튼을 눌러 시작하세요',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 16,
                  ),
                ),

              const SizedBox(height: 24),

              // Start button
              if (!_phraseDetected)
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton.icon(
                    onPressed: _isListening ? null : _startListening,
                    icon: const Icon(Icons.mic),
                    label: Text(
                      _isListening ? '듣는 중...' : '음성 인식 시작',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: AppColors.surfaceDark,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),

              const SizedBox(height: 16),

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
                        '큰 소리로 말해야 인식돼요!',
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
      ),
    );
  }
}

class _WavePainter extends CustomPainter {
  final double animationValue;
  final double volumeLevel;
  final bool isListening;

  _WavePainter({
    required this.animationValue,
    required this.volumeLevel,
    required this.isListening,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (!isListening) return;

    final paint = Paint()
      ..color = AppColors.primary.withOpacity(0.3)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    final center = Offset(size.width / 2, size.height / 2);

    for (int i = 0; i < 3; i++) {
      final radius = 100 + (i * 30) + (animationValue * 50) + (volumeLevel * 20);
      final opacity = 0.5 - (i * 0.15) - (animationValue * 0.3);

      paint.color = AppColors.primary.withOpacity(opacity.clamp(0.0, 1.0));
      canvas.drawCircle(center, radius, paint);
    }
  }

  @override
  bool shouldRepaint(_WavePainter oldDelegate) => true;
}
