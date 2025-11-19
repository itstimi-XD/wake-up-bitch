import 'package:flutter/material.dart';
import 'dart:math';
import '../../../core/constants/app_colors.dart';

class RealityCheckMissionScreen extends StatefulWidget {
  final String alarmId;
  final int problemCount;

  const RealityCheckMissionScreen({
    Key? key,
    required this.alarmId,
    this.problemCount = 3,
  }) : super(key: key);

  @override
  State<RealityCheckMissionScreen> createState() =>
      _RealityCheckMissionScreenState();
}

class _RealityCheckMissionScreenState extends State<RealityCheckMissionScreen> {
  final Random _random = Random();
  final TextEditingController _answerController = TextEditingController();

  int _currentProblem = 0;
  int _num1 = 0;
  int _num2 = 0;
  String _operator = '+';
  int _correctAnswer = 0;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _generateProblem();
  }

  @override
  void dispose() {
    _answerController.dispose();
    super.dispose();
  }

  void _generateProblem() {
    _num1 = _random.nextInt(50) + 10;
    _num2 = _random.nextInt(30) + 5;

    final operators = ['+', '-', '×'];
    _operator = operators[_random.nextInt(operators.length)];

    switch (_operator) {
      case '+':
        _correctAnswer = _num1 + _num2;
        break;
      case '-':
        _correctAnswer = _num1 - _num2;
        break;
      case '×':
        _correctAnswer = _num1 * _num2;
        break;
    }

    _answerController.clear();
    setState(() {
      _errorMessage = '';
    });
  }

  void _checkAnswer() {
    final userAnswer = int.tryParse(_answerController.text);

    if (userAnswer == null) {
      setState(() {
        _errorMessage = '숫자를 입력하세요';
      });
      return;
    }

    if (userAnswer == _correctAnswer) {
      setState(() {
        _currentProblem++;
        _errorMessage = '';
      });

      if (_currentProblem >= widget.problemCount) {
        _onMissionComplete();
      } else {
        _generateProblem();
      }
    } else {
      setState(() {
        _errorMessage = '틀렸어요! 다시 생각해보세요 🤔';
      });
    }
  }

  void _onMissionComplete() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.cardBackground,
        title: const Text(
          '🧠 현실 직시 완료!',
          style: TextStyle(color: AppColors.primary, fontSize: 24),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              '모든 문제를 풀었어요!',
              style: TextStyle(color: AppColors.textPrimary, fontSize: 18),
            ),
            const SizedBox(height: 16),
            const Text(
              '이제 머리가 완전히 깨어났네요! 💪',
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
    final progress = _currentProblem / widget.problemCount;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: GestureDetector(
          onTap: () => FocusScope.of(context).unfocus(),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                // Header
                const Text(
                  '🧠 현실 직시 🧠',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  '수학 문제를 풀어서 정신 차리세요!',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 24),

                // Progress
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '문제 ${_currentProblem + 1} / ${widget.problemCount}',
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${(progress * 100).toInt()}%',
                      style: const TextStyle(
                        color: AppColors.secondary,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: AppColors.surfaceDark,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppColors.primary,
                    ),
                    minHeight: 8,
                  ),
                ),

                const SizedBox(height: 60),

                // Problem
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(32),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceDark,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: AppColors.primary.withOpacity(0.3),
                              width: 2,
                            ),
                          ),
                          child: Column(
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    '$_num1',
                                    style: const TextStyle(
                                      fontSize: 56,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                  const SizedBox(width: 20),
                                  Text(
                                    _operator,
                                    style: const TextStyle(
                                      fontSize: 48,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.accent,
                                    ),
                                  ),
                                  const SizedBox(width: 20),
                                  Text(
                                    '$_num2',
                                    style: const TextStyle(
                                      fontSize: 56,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              Container(
                                height: 3,
                                width: 200,
                                color: AppColors.primary,
                              ),
                              const SizedBox(height: 24),
                              SizedBox(
                                width: 200,
                                child: TextField(
                                  controller: _answerController,
                                  keyboardType: TextInputType.number,
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(
                                    fontSize: 48,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: '?',
                                    hintStyle: TextStyle(
                                      color: AppColors.textSecondary.withOpacity(0.5),
                                    ),
                                    border: InputBorder.none,
                                  ),
                                  onSubmitted: (_) => _checkAnswer(),
                                ),
                              ),
                            ],
                          ),
                        ),

                        if (_errorMessage.isNotEmpty) ...[
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.bossFightRed.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: AppColors.bossFightRed,
                                width: 1,
                              ),
                            ),
                            child: Text(
                              _errorMessage,
                              style: const TextStyle(
                                color: AppColors.bossFightRed,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Submit button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _checkAnswer,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      '확인',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
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
                          '계산해서 답을 입력하세요!',
                          style: TextStyle(
                            color: AppColors.textSecondary,
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
      ),
    );
  }
}
