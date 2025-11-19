# Wake Up Bitch - 빠른 시작 가이드

## 🚀 5분 만에 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/yourusername/wake-up-bitch.git
cd wake-up-bitch
```

---

## 백엔드 실행

### 필수 요구사항
- Node.js 18 이상
- PostgreSQL 12 이상
- Redis

### 1. 환경 설정

```bash
cd backend
cp .env.example .env
```

`.env` 파일 수정:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=wake_up_bitch
```

### 2. 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE wake_up_bitch;
\q
```

### 3. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 마이그레이션 실행
npm run migration:run

# 개발 서버 실행
npm run start:dev
```

서버가 http://localhost:3000 에서 실행됩니다!

API 문서: http://localhost:3000/api/docs

---

## Flutter 앱 실행

### 필수 요구사항
- Flutter SDK 3.0 이상
- Android Studio 또는 Xcode

### 1. Flutter 설치 확인

```bash
flutter doctor
```

모든 항목이 체크되어야 합니다.

### 2. 의존성 설치

```bash
cd mobile
flutter pub get
```

### 3. 앱 실행

#### Android
```bash
flutter run
```

#### iOS (Mac만 가능)
```bash
flutter run
```

#### 특정 기기 선택
```bash
# 사용 가능한 기기 확인
flutter devices

# 특정 기기에서 실행
flutter run -d <device-id>
```

---

## Docker로 실행 (가장 쉬움!)

### 1. Docker 설치

https://www.docker.com/get-started

### 2. Docker Compose 실행

```bash
# 프로젝트 루트에서
docker-compose up -d
```

모든 서비스가 자동으로 실행됩니다:
- Backend API (포트 3000)
- PostgreSQL (포트 5432)
- Redis (포트 6379)

### 3. 로그 확인

```bash
docker-compose logs -f backend
```

### 4. 중지

```bash
docker-compose down
```

---

## 개발 환경 설정

### VSCode Extensions 추천

**백엔드 (NestJS):**
- ESLint
- Prettier
- TypeScript Vue Plugin
- REST Client

**Flutter:**
- Flutter
- Dart
- Bloc
- Error Lens

### VSCode 설정

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[dart]": {
    "editor.formatOnSave": true,
    "editor.selectionHighlight": false,
    "editor.suggest.snippetsPreventQuickSuggestions": false,
    "editor.suggestSelection": "first",
    "editor.tabCompletion": "onlySnippets",
    "editor.wordBasedSuggestions": false
  }
}
```

---

## 기본 사용법

### 1. 회원가입

앱 실행 → 회원가입 → 이메일/비밀번호 입력

### 2. 첫 알람 만들기

1. 홈 화면 → "+" 버튼
2. 알람 시간 설정
3. 미션 추가 (예: BILLS_DUE)
4. 저장

### 3. 재무 프로필 입력 (BILLS_DUE 사용 시)

프로필 → 재무 프로필 → 월세/카드값 입력

### 4. 친구 추가

친구 → 친구 검색 → 친구 요청

### 5. 챌린지 생성

챌린지 → "챌린지 생성" → 친구 선택 → 포인트 설정

---

## 문제 해결

### 백엔드가 실행되지 않을 때

```bash
# 캐시 삭제
rm -rf node_modules
npm install

# 포트 확인
lsof -i :3000

# 데이터베이스 연결 확인
psql -U postgres -d wake_up_bitch
```

### Flutter 빌드 실패

```bash
# 캐시 삭제
flutter clean
flutter pub get

# 의존성 재설치
rm -rf pubspec.lock
flutter pub get
```

### 데이터베이스 초기화

```bash
# 데이터베이스 삭제 후 재생성
psql -U postgres
DROP DATABASE wake_up_bitch;
CREATE DATABASE wake_up_bitch;
\q

# 마이그레이션 재실행
cd backend
npm run migration:run
```

---

## 다음 단계

1. [배포 가이드](./deployment/) 읽기
2. [시스템 아키텍처](./architecture/system-architecture.md) 이해하기
3. [미션 컨셉](./design/mission-concepts.md) 확인하기

---

## 도움이 필요하신가요?

- GitHub Issues: https://github.com/yourusername/wake-up-bitch/issues
- 문서: `/docs` 폴더

**행운을 빕니다! 🔥**
