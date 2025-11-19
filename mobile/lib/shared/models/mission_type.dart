enum MissionType {
  bossFight('BOSS_FIGHT', '보스 레이드', '아침은 전쟁!'),
  billsDue('BILLS_DUE', '청구서가 기다려', '월세 내야지?'),
  realityCheck('REALITY_CHECK', '현실 직시', '오늘 할 일은?'),
  moneyTime('MONEY_TIME', '돈 벌 시간', '시간은 돈이다!'),
  slapAwake('SLAP_AWAKE', '정신차려!', '화면을 때려!'),
  selfieRoast('SELFIE_ROAST', '셀프 디스', '거울 좀 봐봐'),
  voicePower('VOICE_POWER', '외쳐라!', '크게 외쳐!'),
  coffeeRun('COFFEE_RUN', '카페인 충전', '커피 타러 가!');

  final String value;
  final String displayName;
  final String subtitle;

  const MissionType(this.value, this.displayName, this.subtitle);

  static MissionType fromValue(String value) {
    return MissionType.values.firstWhere(
      (type) => type.value == value,
      orElse: () => MissionType.bossFight,
    );
  }
}

enum DifficultyLevel {
  easy('EASY', '쉬움', '🌱'),
  medium('MEDIUM', '보통', '⚡'),
  hard('HARD', '어려움', '🔥');

  final String value;
  final String displayName;
  final String icon;

  const DifficultyLevel(this.value, this.displayName, this.icon);

  static DifficultyLevel fromValue(String value) {
    return DifficultyLevel.values.firstWhere(
      (level) => level.value == value,
      orElse: () => DifficultyLevel.medium,
    );
  }
}
