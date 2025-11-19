import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors - Energetic & Bold
  static const Color primary = Color(0xFFFF0066); // Hot Pink
  static const Color primaryDark = Color(0xFFCC0052);
  static const Color primaryLight = Color(0xFFFF3385);

  // Secondary Colors
  static const Color secondary = Color(0xFF00FFFF); // Cyan/Neon Blue
  static const Color secondaryDark = Color(0xFF00CCCC);
  static const Color secondaryLight = Color(0xFF33FFFF);

  // Accent Colors
  static const Color accent = Color(0xFFFFFF00); // Yellow
  static const Color accentOrange = Color(0xFFFF6600);
  static const Color accentPurple = Color(0xFF9D00FF);

  // Background
  static const Color background = Color(0xFF0A0A0A); // Almost Black
  static const Color surface = Color(0xFF1A1A1A);
  static const Color surfaceLight = Color(0xFF2A2A2A);

  // Text
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFB3B3B3);
  static const Color textHint = Color(0xFF666666);

  // Status
  static const Color success = Color(0xFF00FF88);
  static const Color error = Color(0xFFFF0033);
  static const Color warning = Color(0xFFFFAA00);
  static const Color info = Color(0xFF0088FF);

  // Mission Specific
  static const Color bossFightRed = Color(0xFFFF0000);
  static const Color billsDueGold = Color(0xFFFFD700);
  static const Color realityCheckBlue = Color(0xFF0099FF);
  static const Color moneyGreen = Color(0xFF00FF00);
  static const Color slapOrange = Color(0xFFFF6600);
  static const Color selfieRoastPink = Color(0xFFFF66CC);
  static const Color voicePowerPurple = Color(0xFF9D00FF);
  static const Color coffeeRunBrown = Color(0xFF8B4513);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient neonGradient = LinearGradient(
    colors: [primary, secondary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkGradient = LinearGradient(
    colors: [background, surface],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
