import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/constants/app_colors.dart';

class SelfieRoastMissionScreen extends StatefulWidget {
  final String alarmId;

  const SelfieRoastMissionScreen({
    Key? key,
    required this.alarmId,
  }) : super(key: key);

  @override
  State<SelfieRoastMissionScreen> createState() =>
      _SelfieRoastMissionScreenState();
}

class _SelfieRoastMissionScreenState extends State<SelfieRoastMissionScreen> {
  bool _photoTaken = false;
  bool _isProcessing = false;
  final ImagePicker _picker = ImagePicker();

  final List<String> _roastMessages = [
    'Wow... is that a human? Or a zombie? 😱',
    'Look in the mirror! Even I\'m shocked 😂',
    'Going to work with that face? Bold move! 💪',
    'Why is your hair a bird\'s nest? 🐦',
    'Where are your eyes? Found them! ...barely 😅',
    'Morning face grade: F- 😵',
    'That puffy face... what did you eat last night? 🍔',
    'This is reality... accept it 😎',
  ];

  String _selectedRoast = '';

  void _takeSelfie() async {
    setState(() {
      _isProcessing = true;
    });

    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        preferredCameraDevice: CameraDevice.front,
        imageQuality: 50,
      );

      if (photo != null) {
        // Photo was taken successfully
        await Future.delayed(const Duration(milliseconds: 500));

        if (mounted) {
          setState(() {
            _photoTaken = true;
            _isProcessing = false;
            _selectedRoast = (_roastMessages..shuffle()).first;
          });
        }
      } else {
        // User cancelled
        if (mounted) {
          setState(() {
            _isProcessing = false;
          });
        }
      }
    } catch (e) {
      // Camera error - still complete mission but show error message
      if (mounted) {
        setState(() {
          _photoTaken = true;
          _isProcessing = false;
          _selectedRoast = 'Camera error, but I\'ll let you pass this time! 😅';
        });
      }
    }
  }

  void _onComplete() {
    Navigator.of(context).pop(true);
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
                '📸 셀프 디스 📸',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                '셀카 찍고 현실 직시하세요!',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 40),

              // Camera preview / Photo display
              Expanded(
                child: Center(
                  child: _photoTaken
                      ? Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // Roast message
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceDark,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: AppColors.primary,
                                  width: 2,
                                ),
                              ),
                              child: Column(
                                children: [
                                  const Icon(
                                    Icons.face_retouching_natural,
                                    size: 64,
                                    color: AppColors.primary,
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    _selectedRoast,
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textPrimary,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 24),
                            const Text(
                              '이제 정신 좀 들었지? 😂',
                              style: TextStyle(
                                color: AppColors.secondary,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        )
                      : Container(
                          width: 300,
                          height: 400,
                          decoration: BoxDecoration(
                            color: AppColors.surfaceDark,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: AppColors.primary.withOpacity(0.3),
                              width: 2,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.camera_alt,
                                size: 80,
                                color: AppColors.primary.withOpacity(0.5),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '셀카를 찍어주세요',
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ),
                ),
              ),

              const SizedBox(height: 24),

              // Action button
              if (_isProcessing)
                const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                )
              else if (!_photoTaken)
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton.icon(
                    onPressed: _takeSelfie,
                    icon: const Icon(Icons.camera_alt),
                    label: const Text(
                      '셀카 찍기',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                )
              else
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _onComplete,
                    child: const Text(
                      '완료',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.moneyGreen,
                      foregroundColor: Colors.white,
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
                        '아침 얼굴을 보면 정신이 번쩍 들어요!',
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
