# Wake Up Bitch - Mobile App

Flutter로 구현된 "Wake Up Bitch" 모바일 애플리케이션

## 특징

- **Clean Architecture** 기반 구조
- **Bloc** 패턴으로 상태 관리
- **GetIt** + **Injectable**로 의존성 주입
- **Retrofit** + **Dio**로 네트워크 통신
- **Hive**로 로컬 데이터 저장

## 프로젝트 구조

```
lib/
├── core/                    # 핵심 유틸리티
│   ├── constants/          # 상수
│   ├── theme/              # 테마 설정
│   ├── utils/              # 유틸리티 함수
│   └── network/            # API 클라이언트
├── features/               # 기능별 모듈
│   ├── auth/              # 인증
│   ├── alarm/             # 알람
│   ├── mission/           # 미션
│   └── profile/           # 프로필
├── shared/                 # 공유 컴포넌트
│   ├── widgets/           # 공용 위젯
│   └── models/            # 공용 모델
└── main.dart
```

## 설치 및 실행

```bash
# 의존성 설치
flutter pub get

# 코드 생성
flutter pub run build_runner build --delete-conflicting-outputs

# 실행
flutter run
```

## 주요 패키지

### UI/UX
- `flutter_bloc` - 상태 관리
- `google_fonts` - 폰트
- `lottie` - 애니메이션

### 알람 & 센서
- `flutter_local_notifications` - 로컬 알림
- `alarm` - 알람 기능
- `sensors_plus` - 센서 (가속도계 등)
- `pedometer` - 만보기
- `shake` - 흔들기 감지

### 미션 관련
- `camera` - 카메라 (셀카, 사진 인증)
- `mobile_scanner` - QR/바코드 스캔
- `speech_to_text` - 음성 인식
- `geolocator` - 위치 기반

### 네트워크 & 저장소
- `dio` + `retrofit` - HTTP 클라이언트
- `hive` - 로컬 DB
- `flutter_secure_storage` - 보안 저장소

## 빌드

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## 라이선스

MIT
