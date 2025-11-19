# Wake Up Bitch - 시스템 아키텍처

## 전체 시스템 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                     사용자 (User)                              │
│                                                               │
│   📱 Android App          📱 iOS App                         │
│   (Flutter)               (Flutter)                          │
└───────────────┬─────────────────┬───────────────────────────┘
                │                 │
                │   HTTPS/REST    │
                │                 │
┌───────────────▼─────────────────▼───────────────────────────┐
│                  API Gateway (Nginx/Load Balancer)           │
└───────────────┬─────────────────┬───────────────────────────┘
                │                 │
     ┌──────────▼──────────┬──────▼──────────┐
     │                     │                  │
┌────▼────┐          ┌────▼────┐       ┌────▼────┐
│ Backend │          │ Backend │       │ Backend │
│ Server  │          │ Server  │       │ Server  │
│   #1    │          │   #2    │       │   #3    │
│(NestJS) │          │(NestJS) │       │(NestJS) │
└────┬────┘          └────┬────┘       └────┬────┘
     │                    │                  │
     └──────────┬─────────┴──────────────────┘
                │
    ┌───────────▼──────────────────────────┐
    │                                      │
┌───▼────────┐              ┌─────────────▼────┐
│ PostgreSQL │              │      Redis        │
│ Database   │              │      Cache        │
│ (Primary)  │              │   Session Store   │
└────────────┘              └──────────────────┘
```

---

## 클라이언트-서버 통신 흐름

### 1. 사용자 로그인 플로우

```
[Flutter App]                [Backend API]              [Database]
      │                            │                          │
      │  POST /api/v1/auth/login   │                          │
      ├──────────────────────────>│                          │
      │  { email, password }       │                          │
      │                            │  Query User by Email     │
      │                            ├────────────────────────>│
      │                            │                          │
      │                            │<─────────────────────────┤
      │                            │  User Data               │
      │                            │                          │
      │                            │  Verify Password         │
      │                            │  Generate JWT Token      │
      │                            │                          │
      │<───────────────────────────┤                          │
      │  { accessToken, user }     │                          │
      │                            │                          │
      │  Store Token Locally       │                          │
      │  (Secure Storage)          │                          │
      │                            │                          │
```

### 2. 알람 생성 플로우

```
[Flutter App]                [Backend API]              [Database]
      │                            │                          │
      │  POST /api/v1/alarms       │                          │
      ├──────────────────────────>│                          │
      │  Authorization: Bearer JWT │                          │
      │  { name, time, missions }  │                          │
      │                            │                          │
      │                            │  Validate JWT            │
      │                            │  Extract User ID         │
      │                            │                          │
      │                            │  Create Alarm            │
      │                            ├────────────────────────>│
      │                            │                          │
      │                            │  Create Alarm Missions   │
      │                            ├────────────────────────>│
      │                            │                          │
      │                            │<─────────────────────────┤
      │                            │  Alarm Created           │
      │                            │                          │
      │<───────────────────────────┤                          │
      │  { id, name, time, ... }   │                          │
      │                            │                          │
      │  Schedule Local Alarm      │                          │
      │  (Android Alarm Manager/   │                          │
      │   iOS Notification)        │                          │
      │                            │                          │
```

### 3. 미션 수행 플로우

```
[Flutter App]                [Backend API]              [Database]
      │                            │                          │
      │  Alarm Triggers            │                          │
      │  (Local Notification)      │                          │
      │                            │                          │
      │  Show Mission Screen       │                          │
      │  (e.g., BOSS_FIGHT)        │                          │
      │                            │                          │
      │  User Completes Mission    │                          │
      │                            │                          │
      │  POST /api/v1/missions/    │                          │
      │       attempts             │                          │
      ├──────────────────────────>│                          │
      │  { alarmHistoryId,         │                          │
      │    missionId,              │                          │
      │    success: true,          │                          │
      │    score: 100,             │                          │
      │    data: { ... }           │                          │
      │  }                         │                          │
      │                            │  Create Mission Attempt  │
      │                            ├────────────────────────>│
      │                            │                          │
      │                            │  Update Statistics       │
      │                            ├────────────────────────>│
      │                            │                          │
      │                            │<─────────────────────────┤
      │                            │  Success                 │
      │                            │                          │
      │<───────────────────────────┤                          │
      │  { success: true }         │                          │
      │                            │                          │
      │  Show Success Animation    │                          │
      │  Update Local Stats        │                          │
      │                            │                          │
```

### 4. 친구 챌린지 플로우

```
[User A App]        [Backend API]      [Database]      [User B App]
      │                    │                 │                 │
      │  Create Challenge  │                 │                 │
      ├──────────────────>│                 │                 │
      │                    │  Insert         │                 │
      │                    │  Challenge      │                 │
      │                    ├───────────────>│                 │
      │                    │                 │                 │
      │                    │  Send Push      │                 │
      │                    │  Notification   │                 │
      │                    ├─────────────────────────────────>│
      │                    │                 │                 │
      │                    │                 │  Accept Challenge│
      │                    │<────────────────────────────────┤
      │                    │                 │                 │
      │  Next Morning...   │                 │                 │
      │  Wake Up & Complete│                 │                 │
      │  Mission           │                 │                 │
      ├──────────────────>│                 │                 │
      │                    │  Record Time    │                 │
      │                    ├───────────────>│                 │
      │                    │                 │                 │
      │                    │  User B Wakes   │                 │
      │                    │  Up Later       │                 │
      │                    │<────────────────────────────────┤
      │                    │                 │                 │
      │                    │  Calculate      │                 │
      │                    │  Winner         │                 │
      │                    ├───────────────>│                 │
      │                    │                 │                 │
      │  Points +100       │  User A Wins!   │  Points -100    │
      │<───────────────────┤                 ├────────────────>│
      │                    │                 │                 │
```

---

## 데이터베이스 스키마

### 핵심 테이블 관계도

```
┌──────────┐       ┌──────────┐       ┌────────────────┐
│  users   │───────│  alarms  │───────│ alarm_missions │
└──────────┘  1:N  └──────────┘  1:N  └────────────────┘
     │                   │                      │
     │                   │                      │ N:1
     │ 1:N               │ 1:N                  │
     │                   │              ┌───────▼────────┐
     │                   │              │    missions    │
     │                   │              └────────────────┘
     │                   │
     │ 1:N               │ 1:N
     │                   │
┌────▼─────────────┐    │       ┌────────────────────┐
│ alarm_histories  │◄───┘       │  mission_attempts  │
└──────────────────┘            └────────────────────┘
     │ 1:N
     │
     └────────────────────────────────>│

┌──────────┐       ┌──────────────┐       ┌──────────┐
│  users   │───────│ friendships  │───────│  users   │
│  (from)  │  1:N  └──────────────┘  N:1  │  (to)    │
└──────────┘                               └──────────┘
     │
     │ 1:N
     │
┌────▼───────────┐       ┌────────────────────┐
│  challenges    │───────│ challenge_results  │
└────────────────┘  1:N  └────────────────────┘
```

---

## 백엔드 아키텍처 (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Auth Controller │  │ Alarm Controller │  ...            │
│  │   /auth/*        │  │  /alarms/*       │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                     │                            │
└───────────┼─────────────────────┼────────────────────────────┘
            │                     │
┌───────────▼─────────────────────▼────────────────────────────┐
│                   Application Layer                          │
│                                                               │
│  ┌───────────────────┐  ┌───────────────────┐               │
│  │ LoginUserUseCase  │  │CreateAlarmUseCase │  ...          │
│  └────────┬──────────┘  └────────┬──────────┘               │
│           │                      │                           │
└───────────┼──────────────────────┼───────────────────────────┘
            │                      │
┌───────────▼──────────────────────▼───────────────────────────┐
│                     Domain Layer                             │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐      │
│  │  User   │  │  Alarm  │  │ Mission  │  │Challenge │      │
│  │ Entity  │  │ Entity  │  │  Entity  │  │  Entity  │      │
│  └─────────┘  └─────────┘  └──────────┘  └──────────┘      │
│                                                               │
│  Business Logic & Domain Rules                               │
│                                                               │
└──────────────────────────┬───────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                  Infrastructure Layer                        │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ User Repository  │  │ Alarm Repository │  ...            │
│  │   (TypeORM)      │  │    (TypeORM)     │                 │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                     │                            │
│  ┌────────▼─────────────────────▼─────────┐                 │
│  │        PostgreSQL Database              │                 │
│  └──────────────────────────────────────────┘                │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │   Redis Cache    │  │   FCM Service    │                 │
│  └──────────────────┘  └──────────────────┘                 │
└───────────────────────────────────────────────────────────────┘
```

---

## Flutter 앱 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      UI Layer (Screens)                      │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │LoginScreen │  │AlarmScreen │  │MissionScreen│  ...       │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
└────────┼────────────────┼────────────────┼───────────────────┘
         │                │                │
┌────────▼────────────────▼────────────────▼───────────────────┐
│                 Presentation Layer (Bloc)                    │
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ AuthBloc   │  │ AlarmBloc  │  │MissionBloc │  ...       │
│  │            │  │            │  │            │            │
│  │ • Events   │  │ • Events   │  │ • Events   │            │
│  │ • States   │  │ • States   │  │ • States   │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
└────────┼────────────────┼────────────────┼───────────────────┘
         │                │                │
┌────────▼────────────────▼────────────────▼───────────────────┐
│                   Domain Layer (Use Cases)                   │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │ LoginUseCase     │  │CreateAlarmUseCase│  ...            │
│  └────────┬─────────┘  └────────┬─────────┘                 │
│           │                     │                            │
└───────────┼─────────────────────┼────────────────────────────┘
            │                     │
┌───────────▼─────────────────────▼────────────────────────────┐
│                    Data Layer (Repositories)                 │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐             │
│  │ AuthRepository     │  │ AlarmRepository    │  ...        │
│  │  (Interface)       │  │  (Interface)       │             │
│  └────────┬───────────┘  └────────┬───────────┘             │
│           │                       │                          │
│  ┌────────▼───────────────────────▼────────┐                │
│  │     API Client (Dio + Retrofit)         │                │
│  │         REST API Communication           │                │
│  └───────────────────────────────────────────┘               │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Local Storage   │  │ Alarm Scheduler  │                 │
│  │     (Hive)       │  │  (Notifications) │                 │
│  └──────────────────┘  └──────────────────┘                 │
└───────────────────────────────────────────────────────────────┘
```

---

## API 엔드포인트 목록

### 인증 (Authentication)
```
POST   /api/v1/auth/register          회원가입
POST   /api/v1/auth/login             로그인
POST   /api/v1/auth/refresh           토큰 갱신
POST   /api/v1/auth/logout            로그아웃
```

### 사용자 (Users)
```
GET    /api/v1/users/me               내 정보 조회
PUT    /api/v1/users/me               내 정보 수정
PUT    /api/v1/users/me/financial-profile  재무 프로필 수정
DELETE /api/v1/users/me               회원 탈퇴
```

### 알람 (Alarms)
```
GET    /api/v1/alarms                 내 알람 목록
POST   /api/v1/alarms                 알람 생성
GET    /api/v1/alarms/:id             알람 상세 조회
PUT    /api/v1/alarms/:id             알람 수정
DELETE /api/v1/alarms/:id             알람 삭제
PUT    /api/v1/alarms/:id/toggle      알람 ON/OFF
```

### 미션 (Missions)
```
GET    /api/v1/missions               미션 목록 조회
POST   /api/v1/missions/attempts      미션 수행 기록
GET    /api/v1/missions/attempts/me   내 미션 기록
```

### 통계 (Stats)
```
GET    /api/v1/stats/me               내 통계 조회
GET    /api/v1/stats/me/weekly        주간 통계
GET    /api/v1/stats/me/monthly       월간 통계
```

### 친구 (Friends)
```
GET    /api/v1/friends                친구 목록
POST   /api/v1/friends/request        친구 요청
PUT    /api/v1/friends/:id/accept     친구 수락
DELETE /api/v1/friends/:id            친구 삭제
GET    /api/v1/friends/search?q=      친구 검색
```

### 챌린지 (Challenges)
```
GET    /api/v1/challenges             내 챌린지 목록
POST   /api/v1/challenges             챌린지 생성
GET    /api/v1/challenges/:id         챌린지 상세
PUT    /api/v1/challenges/:id/accept  챌린지 수락
POST   /api/v1/challenges/:id/result  챌린지 결과 기록
GET    /api/v1/challenges/history     챌린지 히스토리
```

---

## 보안 및 인증

### JWT Token 구조

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user-id-uuid",
  "email": "user@example.com",
  "iat": 1700000000,
  "exp": 1700604800
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### 인증 플로우

```
1. 로그인 요청
   → 서버가 JWT 발급

2. 이후 모든 요청에 Header 추가:
   Authorization: Bearer <JWT Token>

3. 서버가 토큰 검증:
   ✓ 서명 유효성
   ✓ 만료 시간
   ✓ 사용자 존재 여부

4. 토큰 만료 시:
   → Refresh Token으로 새 Access Token 발급
```

---

## 푸시 알림 시스템

```
[Server]                  [FCM]                  [Client]
    │                        │                        │
    │  Send Notification     │                        │
    │  Request               │                        │
    ├──────────────────────>│                        │
    │  { token, title, ... } │                        │
    │                        │                        │
    │                        │  Push to Device        │
    │                        ├──────────────────────>│
    │                        │                        │
    │                        │                        │  Display
    │                        │                        │  Notification
    │                        │                        │
```

### 알림 종류

1. **알람 트리거**
   - 로컬 알림 (Android Alarm Manager / iOS Local Notification)
   - 백그라운드에서도 작동

2. **친구 요청**
   - FCM Push Notification
   - 앱이 꺼져있어도 수신

3. **챌린지 결과**
   - FCM Push Notification
   - 승패 결과 알림

---

## 캐싱 전략

### Redis 사용

```
1. 사용자 세션
   Key: session:${userId}
   TTL: 7일

2. 활성 알람 목록
   Key: alarms:active:${userId}
   TTL: 1일

3. 통계 데이터
   Key: stats:${userId}:${date}
   TTL: 1주일

4. 친구 목록
   Key: friends:${userId}
   TTL: 1시간
```

---

## 확장성

### 수평적 확장 (Horizontal Scaling)

```
┌────────────┐
│ Load       │
│ Balancer   │
└──────┬─────┘
       │
   ┌───┴───┬───────┬───────┐
   │       │       │       │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Node │ │Node │ │Node │ │Node │
│  1  │ │  2  │ │  3  │ │  4  │
└─────┘ └─────┘ └─────┘ └─────┘
```

### 데이터베이스 확장

```
┌────────────┐
│  Primary   │  (Read/Write)
│ PostgreSQL │
└──────┬─────┘
       │ Replication
   ┌───┴───┬───────┐
   │       │       │
┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Read │ │Read │ │Read │
│ #1  │ │ #2  │ │ #3  │
└─────┘ └─────┘ └─────┘
```

---

이 문서가 시스템 전체 구조를 이해하는데 도움이 되길 바랍니다! 🚀
