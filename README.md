# Wake Up Bitch 🔥

[![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)](https://flutter.dev)
[![NestJS](https://img.shields.io/badge/NestJS-10.0+-E0234E?logo=nestjs)](https://nestjs.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> **"No excuses. No mercy. Just wake up."**
> The alarm app that forces you to face reality and actually get out of bed.

[English](#english) | [한국어](#korean)

---

## <a name="english"></a>🇺🇸 English

### Overview

**Wake Up Bitch** is not just another alarm app. It's a reality check that forces you to **truly wake up** and gives you **real reasons to get out of bed**.

Unlike other alarm apps that just wake you up, we tell you **why you should wake up**.

### 🎯 What Makes Us Different?

- **8 Brutal Wake-Up Missions** - No snooze until you complete them
- **BILLS_DUE Mission** - Watch your money drain in real-time (UNIQUE!)
- **Weather Integration** - Contextual motivation based on weather
- **Party Mode** - Challenge friends to wake-up battles
- **Global Leaderboards** - Compete worldwide
- **Real Sensor Integration** - Shake, walk, speak, selfie to wake up
- **Multi-language** - English, Korean (Japanese, Chinese coming soon)

### 🎮 8 Unique Wake-Up Missions

#### 1. 💪 BOSS_FIGHT
Defeat the morning boss by tapping rapidly. It's war!

#### 2. 💸 BILLS_DUE (★ Unique Feature)
Input your monthly bills (rent, credit card, utilities). Watch your money drain per minute of sleeping.
*"10 more minutes = $8 wasted!"*

#### 3. 🧠 REALITY_CHECK
Solve math problems to prove you're awake. No brain = no dismiss.

#### 4. 💰 MONEY_TIME
See how much you could be earning. Time is money!

#### 5. 👋 SLAP_AWAKE
Shake your phone like crazy. Real accelerometer detection.

#### 6. 📸 SELFIE_ROAST
Take a selfie and face the brutal truth. Morning face = reality check.

#### 7. 🎤 VOICE_POWER
Shout wake-up phrases. Speech recognition won't let you cheat.

#### 8. ☕ COFFEE_RUN
Walk 50 steps to prove you're out of bed. Pedometer verified.

### 🏆 Game Modes

#### Solo Mode (FREE)
- All 8 missions
- Personal statistics
- Streak tracking
- Badges & achievements
- Ad-supported

#### Party Mode (Premium)
- Challenge friends
- Point betting
- Global & friends leaderboards
- Unlimited challenges
- Ad-free experience

**Premium:** $2.99/month or $24.99/year

### 🛠 Tech Stack

#### Mobile App (Flutter)
```yaml
- Flutter 3.0+
- Bloc Pattern (State Management)
- GetIt + Injectable (DI)
- Hive (Local Storage)
- Sensors: shake, pedometer, camera, speech-to-text
- i18n (English, Korean)
```

#### Backend (NestJS)
```yaml
- NestJS 10 + TypeScript
- Clean Architecture (Domain-Driven Design)
- PostgreSQL (Main Database)
- Redis (Caching)
- Firebase Cloud Messaging (Push Notifications)
- OpenWeatherMap API (Weather Integration)
- JWT Authentication
- Swagger API Documentation
```

### 📁 Project Structure

```
wake-up-bitch/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── domain/            # Domain Entities & Business Logic
│   │   ├── application/       # Use Cases
│   │   ├── infrastructure/    # External Services & Repositories
│   │   └── presentation/      # API Controllers & DTOs
│   ├── test/                  # Tests
│   └── package.json
│
├── mobile/                    # Flutter Mobile App
│   ├── lib/
│   │   ├── core/             # Core utilities, constants, themes
│   │   ├── features/         # Feature modules (alarm, mission, auth)
│   │   └── shared/           # Shared widgets & models
│   ├── l10n/                 # Internationalization (i18n)
│   ├── test/                 # Tests
│   └── pubspec.yaml
│
└── docs/                      # Documentation
    ├── api-documentation.md           # Complete API Reference
    ├── strategy/                      # Go-to-Market Strategy
    │   ├── go-to-market-strategy-en.md
    │   └── go-to-market-strategy-ko.md
    ├── features/                      # Feature Documentation
    │   ├── weather-integration.md
    │   └── solo-vs-party-mode.md
    └── deployment/                    # Deployment Guides
        ├── google-play-store-guide.md
        ├── apple-app-store-guide.md
        └── backend-server-deployment.md
```

### 🚀 Getting Started

#### Prerequisites

- **Flutter:** 3.0 or higher
- **Dart:** 3.0 or higher
- **Node.js:** 18 or higher
- **PostgreSQL:** 14 or higher
- **Redis:** 6 or higher

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configurations

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev

# Access API documentation
# http://localhost:3000/api/docs
```

#### Mobile App Setup

```bash
cd mobile

# Install dependencies
flutter pub get

# Generate code (i18n, JSON serialization, etc.)
flutter pub run build_runner build --delete-conflicting-outputs

# Run on device/emulator
flutter run

# Build for release
flutter build apk  # Android
flutter build ios  # iOS
```

#### Required API Keys

1. **OpenWeatherMap API** (Weather Integration)
   - Sign up: https://openweathermap.org/
   - Add to backend `.env`: `OPENWEATHER_API_KEY=your-key`

2. **Firebase** (Push Notifications)
   - Create project: https://console.firebase.google.com/
   - Download `google-services.json` (Android) & `GoogleService-Info.plist` (iOS)
   - Add FCM credentials to backend `.env`

### 📊 Development Status

#### ✅ Completed Features
- [x] Clean Architecture (Backend)
- [x] 8 Mission Screens with Real Sensors
- [x] Weather Integration
- [x] Global & Friends Leaderboard
- [x] FCM Push Notifications
- [x] i18n (English, Korean)
- [x] Authentication System
- [x] Complete API Documentation
- [x] Go-to-Market Strategy

#### 🚧 In Progress
- [ ] Unit & Integration Tests
- [ ] E2E Tests
- [ ] App Store Submission
- [ ] Beta Testing Program

#### 📋 Planned Features
- [ ] AI-Powered Custom Missions
- [ ] Smart Home Integration (Google Home, Alexa)
- [ ] Sleep Tracking
- [ ] Dream Journal
- [ ] Social Sharing

### 📈 Metrics & KPIs

**Target Metrics (First Year):**
- **Downloads:** 500,000
- **MAU:** 150,000
- **D30 Retention:** 20%+
- **App Store Rating:** 4.5+
- **Monthly Revenue:** $50,000

### 🌍 Go-to-Market Strategy

**Phase 1: Soft Launch (Months 1-3)**
- Target: USA, UK, Australia, Canada
- Goal: 5,000-10,000 DAU
- Focus: Product Hunt, Reddit, viral marketing

**Phase 2: Global Expansion (Months 3-6)**
- Add: Korea, Japan, Taiwan
- Goal: 50,000 DAU
- Focus: Paid ads, influencer marketing

**Phase 3: Scale (Months 6-12)**
- Goal: 500,000 MAU
- Revenue: $50,000/month
- Focus: Optimization, retention

See [Go-to-Market Strategy](docs/strategy/go-to-market-strategy-en.md) for details.

### 🤝 Contributing

We're not accepting contributions at this time, but feel free to fork and create your own version!

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📞 Contact

- **Issues:** [GitHub Issues](https://github.com/yourusername/wake-up-bitch/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/wake-up-bitch/discussions)
- **Email:** support@wakeupbitch.app (planned)

### ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

## <a name="korean"></a>🇰🇷 한국어

### 개요

**Wake Up Bitch**는 단순히 알람을 끄는 게 아니라, **진짜로 깨어있는 상태**로 만들고 **일어날 이유**를 제공하는 혁신적인 알람 앱입니다.

다른 알람 앱들은 그냥 깨우기만 합니다. 우리는 **왜 일어나야 하는지** 알려줍니다.

### 🎯 차별화 포인트

- **8가지 잔인한 기상 미션** - 완료하기 전까진 스누즈 불가
- **BILLS_DUE 미션** - 실시간으로 낭비되는 돈 확인 (독점 기능!)
- **날씨 연동** - 날씨에 맞는 맞춤 동기부여
- **파티 모드** - 친구와 기상 대결
- **글로벌 리더보드** - 전 세계와 경쟁
- **실제 센서 통합** - 흔들기, 걷기, 말하기, 셀카로 깨우기
- **다국어 지원** - 영어, 한국어 (일본어, 중국어 준비중)

### 🎮 8가지 독창적인 기상 미션

#### 1. 💪 보스 레이드
빠르게 탭해서 아침의 보스를 물리치세요. 전쟁입니다!

#### 2. 💸 청구서가 기다려 (★ 독점 기능)
월세, 카드값, 고정비를 입력하면 분당 낭비되는 돈을 실시간으로 보여줍니다.
*"10분 더 자면 8,000원 날림!"*

#### 3. 🧠 현실 직시
수학 문제를 풀어야 알람이 꺼집니다. 뇌가 없으면 못 끕니다.

#### 4. 💰 돈 벌 시간
지금 벌 수 있는 돈을 보여줍니다. 시간은 돈입니다!

#### 5. 👋 정신차려!
폰을 미친듯이 흔드세요. 실제 가속도계 감지.

#### 6. 📸 셀프 디스
셀카를 찍고 잔인한 진실을 마주하세요. 아침 얼굴 = 현실 직시.

#### 7. 🎤 외쳐라!
기상 문구를 외치세요. 음성 인식이 감시합니다.

#### 8. ☕ 카페인 충전
50걸음 걸어야 알람이 꺼집니다. 만보기로 검증됨.

### 🏆 게임 모드

#### 솔로 모드 (무료)
- 8가지 미션 전부
- 개인 통계
- 연속 기록 추적
- 배지 & 업적
- 광고 지원

#### 파티 모드 (프리미엄)
- 친구와 대결
- 포인트 베팅
- 글로벌 & 친구 리더보드
- 무제한 챌린지
- 광고 제거

**프리미엄:** 월 2,990원 또는 연 24,900원

### 🚀 시작하기

자세한 설정 방법은 영어 섹션을 참조하세요.

### 📄 라이선스

MIT 라이선스 - [LICENSE](LICENSE) 파일 참조

---

**Built with ❤️ for people who struggle to wake up**
