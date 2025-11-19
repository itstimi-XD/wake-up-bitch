# Database Schema Design

## ERD Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────────┐
│    Users    │────────<│   Alarms    │────────<│ AlarmHistories  │
└─────────────┘         └─────────────┘         └─────────────────┘
      │                        │
      │                        │
      │                        ↓
      │                 ┌─────────────┐
      │                 │AlarmMissions│
      │                 └─────────────┘
      │                        │
      │                        ↓
      │                 ┌──────────────┐         ┌─────────────────┐
      └────────────────>│   Missions   │────────<│MissionAttempts  │
                        └──────────────┘         └─────────────────┘
```

## Tables

### 1. users
사용자 정보

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | UUID | PK | 사용자 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NOT NULL | 비밀번호 해시 |
| username | VARCHAR(50) | NOT NULL | 사용자명 |
| profile_image | TEXT | NULL | 프로필 이미지 URL |
| timezone | VARCHAR(50) | NOT NULL | 타임존 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |
| deleted_at | TIMESTAMP | NULL | 삭제일시 (soft delete) |

### 2. alarms
알람 설정

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | UUID | PK | 알람 ID |
| user_id | UUID | FK(users), NOT NULL | 사용자 ID |
| name | VARCHAR(100) | NOT NULL | 알람 이름 |
| time | TIME | NOT NULL | 알람 시간 |
| days_of_week | JSONB | NOT NULL | 요일 설정 [0-6] |
| is_active | BOOLEAN | DEFAULT true | 활성화 여부 |
| sound_id | VARCHAR(50) | NOT NULL | 사운드 ID |
| volume | INTEGER | DEFAULT 80 | 볼륨 (0-100) |
| vibration_pattern | JSONB | NULL | 진동 패턴 |
| snooze_enabled | BOOLEAN | DEFAULT true | 스누즈 허용 |
| snooze_duration | INTEGER | DEFAULT 5 | 스누즈 시간(분) |
| prevent_sleep_again | BOOLEAN | DEFAULT false | 재수면 방지 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| updated_at | TIMESTAMP | NOT NULL | 수정일시 |

### 3. missions
미션 마스터 데이터

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | UUID | PK | 미션 ID |
| type | ENUM | NOT NULL | 미션 타입 |
| name | VARCHAR(100) | NOT NULL | 미션 이름 |
| description | TEXT | NULL | 설명 |
| difficulty_levels | JSONB | NOT NULL | 난이도별 설정 |
| icon | VARCHAR(255) | NULL | 아이콘 URL |
| is_active | BOOLEAN | DEFAULT true | 활성화 여부 |

**Mission Types:**
- `MATH` - 수학 문제
- `MEMORY` - 기억력 게임
- `SHAKE` - 흔들기
- `TYPING` - 따라쓰기
- `SQUAT` - 스쿼트
- `BARCODE` - QR/바코드
- `WALK` - 걷기
- `PHOTO` - 사진 찍기

### 4. alarm_missions
알람-미션 연결 (다대다)

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | UUID | PK | ID |
| alarm_id | UUID | FK(alarms), NOT NULL | 알람 ID |
| mission_id | UUID | FK(missions), NOT NULL | 미션 ID |
| difficulty | ENUM | NOT NULL | 난이도 (EASY, MEDIUM, HARD) |
| sequence_order | INTEGER | NOT NULL | 순서 |
| config | JSONB | NULL | 미션별 추가 설정 |

**Config 예시:**
```json
{
  "MATH": {
    "problem_count": 3,
    "max_time": 60
  },
  "SHAKE": {
    "shake_count": 50
  },
  "WALK": {
    "step_count": 30
  },
  "PHOTO": {
    "reference_image_url": "https://...",
    "location": {"lat": 37.5, "lng": 127.0}
  }
}
```

### 5. alarm_histories
알람 기록

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | UUID | PK | 기록 ID |
| alarm_id | UUID | FK(alarms), NOT NULL | 알람 ID |
| user_id | UUID | FK(users), NOT NULL | 사용자 ID |
| triggered_at | TIMESTAMP | NOT NULL | 알람 울린 시간 |
| dismissed_at | TIMESTAMP | NULL | 알람 끈 시간 |
| status | ENUM | NOT NULL | 상태 |
| total_attempts | INTEGER | DEFAULT 0 | 총 시도 횟수 |
| success | BOOLEAN | DEFAULT false | 성공 여부 |

**Status:**
- `TRIGGERED` - 울림
- `SNOOZED` - 스누즈
- `DISMISSED` - 종료
- `MISSED` - 실패

### 6. mission_attempts
미션 시도 기록

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| id | UUID | PK | 시도 ID |
| alarm_history_id | UUID | FK(alarm_histories), NOT NULL | 알람 기록 ID |
| mission_id | UUID | FK(missions), NOT NULL | 미션 ID |
| started_at | TIMESTAMP | NOT NULL | 시작 시간 |
| completed_at | TIMESTAMP | NULL | 완료 시간 |
| success | BOOLEAN | DEFAULT false | 성공 여부 |
| attempts | INTEGER | DEFAULT 1 | 시도 횟수 |
| score | INTEGER | NULL | 점수 |
| data | JSONB | NULL | 미션별 상세 데이터 |

**Data 예시:**
```json
{
  "MATH": {
    "problems": [
      {"question": "15 + 23", "answer": 38, "correct": true, "time": 5.2}
    ]
  },
  "SHAKE": {
    "shake_count": 52,
    "duration": 8.5
  }
}
```

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Alarms
CREATE INDEX idx_alarms_user_id ON alarms(user_id);
CREATE INDEX idx_alarms_is_active ON alarms(is_active);
CREATE INDEX idx_alarms_time ON alarms(time);

-- Alarm Histories
CREATE INDEX idx_alarm_histories_alarm_id ON alarm_histories(alarm_id);
CREATE INDEX idx_alarm_histories_user_id ON alarm_histories(user_id);
CREATE INDEX idx_alarm_histories_triggered_at ON alarm_histories(triggered_at);
CREATE INDEX idx_alarm_histories_status ON alarm_histories(status);

-- Mission Attempts
CREATE INDEX idx_mission_attempts_alarm_history_id ON mission_attempts(alarm_history_id);
CREATE INDEX idx_mission_attempts_mission_id ON mission_attempts(mission_id);
CREATE INDEX idx_mission_attempts_started_at ON mission_attempts(started_at);
```

## Redis Cache Structure

### 1. Active Alarms Cache
```
Key: alarm:active:{user_id}
Type: List
TTL: 24h
Value: [alarm_id, alarm_id, ...]
```

### 2. User Session
```
Key: session:{user_id}
Type: Hash
TTL: 7d
Value: {
  token: "jwt_token",
  device_id: "device_id",
  fcm_token: "fcm_token"
}
```

### 3. Mission Progress
```
Key: mission:progress:{alarm_history_id}
Type: Hash
TTL: 1h
Value: {
  current_mission: "mission_id",
  attempts: 3,
  start_time: "timestamp"
}
```

## Migrations Strategy

1. 초기 스키마 생성
2. Seed 데이터 (기본 미션 8가지)
3. 버전별 마이그레이션 관리

## Data Retention

- `alarm_histories`: 6개월 보관
- `mission_attempts`: 6개월 보관
- `users (soft deleted)`: 30일 후 완전 삭제
