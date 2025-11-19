# Backend Architecture - Clean Architecture

## 개요

Wake Up Bitch 백엔드는 Clean Architecture 원칙을 따라 설계되었습니다.
각 레이어는 명확한 책임을 가지며, 의존성은 항상 내부를 향합니다.

## 레이어 구조

```
┌─────────────────────────────────────────┐
│       Presentation Layer                │
│    (Controllers, DTOs, Middleware)      │
└─────────────────────────────────────────┘
              ↓ depends on
┌─────────────────────────────────────────┐
│       Application Layer                 │
│    (Use Cases, Application Services)    │
└─────────────────────────────────────────┘
              ↓ depends on
┌─────────────────────────────────────────┐
│          Domain Layer                   │
│    (Entities, Value Objects, Rules)     │
└─────────────────────────────────────────┘
              ↑ implemented by
┌─────────────────────────────────────────┐
│      Infrastructure Layer               │
│  (Repositories, External Services)      │
└─────────────────────────────────────────┘
```

## 1. Domain Layer (도메인 레이어)

**책임**: 핵심 비즈니스 로직과 규칙

### Entities
- `User` - 사용자
- `Alarm` - 알람 설정
- `Mission` - 기상 미션
- `MissionAttempt` - 미션 시도 기록
- `AlarmHistory` - 알람 기록
- `UserStats` - 사용자 통계

### Value Objects
- `AlarmTime` - 알람 시간
- `MissionType` - 미션 타입 (MATH, MEMORY, SHAKE 등)
- `DifficultyLevel` - 난이도
- `WeekDays` - 요일 설정

### Domain Services
- `MissionValidator` - 미션 검증 로직
- `AlarmScheduler` - 알람 스케줄링 로직

## 2. Application Layer (애플리케이션 레이어)

**책임**: 유스케이스 구현, 트랜잭션 관리

### Use Cases

#### User Management
- `RegisterUserUseCase` - 회원가입
- `LoginUserUseCase` - 로그인
- `UpdateProfileUseCase` - 프로필 수정
- `GetUserStatsUseCase` - 통계 조회

#### Alarm Management
- `CreateAlarmUseCase` - 알람 생성
- `UpdateAlarmUseCase` - 알람 수정
- `DeleteAlarmUseCase` - 알람 삭제
- `GetUserAlarmsUseCase` - 사용자 알람 목록
- `ToggleAlarmUseCase` - 알람 활성화/비활성화

#### Mission Management
- `ValidateMissionUseCase` - 미션 검증
- `RecordMissionAttemptUseCase` - 미션 시도 기록
- `GetMissionHistoryUseCase` - 미션 기록 조회

#### Notification
- `SendAlarmNotificationUseCase` - 알람 푸시 전송
- `ScheduleAlarmNotificationUseCase` - 알람 예약

### Application Services
- `AuthService` - 인증 서비스
- `NotificationService` - 알림 서비스

## 3. Infrastructure Layer (인프라 레이어)

**책임**: 외부 시스템과의 통합

### Repositories
- `UserRepository` - 사용자 데이터 접근
- `AlarmRepository` - 알람 데이터 접근
- `MissionRepository` - 미션 데이터 접근
- `AlarmHistoryRepository` - 알람 기록 데이터 접근

### External Services
- `PostgresDatabase` - PostgreSQL 연결
- `RedisCache` - Redis 캐시
- `S3Storage` - 파일 스토리지
- `FCMPushService` - Firebase Cloud Messaging

## 4. Presentation Layer (프레젠테이션 레이어)

**책임**: HTTP 요청/응답 처리

### Controllers
- `AuthController` - 인증 API
- `UserController` - 사용자 API
- `AlarmController` - 알람 API
- `MissionController` - 미션 API
- `StatsController` - 통계 API

### DTOs
- Request DTOs (입력 검증)
- Response DTOs (응답 형식)

### Middleware
- `AuthMiddleware` - JWT 검증
- `LoggingMiddleware` - 로깅
- `ErrorHandlingMiddleware` - 에러 처리

## 의존성 주입

NestJS의 DI 컨테이너를 사용하여 모든 의존성을 주입합니다.

```typescript
// 예시
@Injectable()
class CreateAlarmUseCase {
  constructor(
    private readonly alarmRepository: IAlarmRepository,
    private readonly notificationService: INotificationService,
  ) {}
}
```

## 데이터 흐름

```
HTTP Request
    ↓
Controller (Presentation)
    ↓
Use Case (Application)
    ↓
Domain Entity (Domain)
    ↓
Repository (Infrastructure)
    ↓
Database
```

## 핵심 원칙

1. **의존성 역전**: 추상화에 의존, 구체화에 의존하지 않음
2. **단일 책임**: 각 클래스는 하나의 책임만
3. **인터페이스 분리**: 필요한 메서드만 포함
4. **테스트 가능성**: 모든 레이어 독립적으로 테스트 가능

## 기술 스택

- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Validation**: class-validator
- **Documentation**: Swagger
- **Testing**: Jest
