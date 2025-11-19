# Wake Up Bitch 🔥

> "You better work, bitch!" - 현실을 마주하고 일어나는 진짜 알람 앱

## 개요

Wake Up Bitch는 단순히 알람을 끄는 게 아니라,
**진짜로 깨어있는 상태**로 만들고 **일어날 이유**를 제공하는 혁신적인 알람 앱입니다.

## 차별화 포인트

다른 알람 앱들은 그냥 깨우기만 합니다.
우리는 **왜 일어나야 하는지** 알려줍니다.

- 게이미피케이션으로 재미있게
- 현실적인 동기부여 (돈, 목표, 할 일)
- 도발적이지만 유쾌한 톤앤매너
- 트렌디한 UI/UX

## 주요 기능

### 🎯 독창적인 기상 미션 (8가지)

#### 1. BOSS_FIGHT (보스 레이드)
아침은 전쟁! 보스 몬스터를 연타로 공격해서 물리쳐야 알람 종료

#### 2. BILLS_DUE (청구서가 기다려)
월세, 카드값, 고정지출을 입력하면 "10분 더 자면 480원 날림!" 같은 현실적인 압박 제공

#### 3. REALITY_CHECK (현실 직시)
오늘 할 일 3가지 입력하고, 저녁에 완료 여부 체크

#### 4. MONEY_TIME (돈 벌 시간)
"시간은 돈이다!" 시급 계산하고 간단한 계산 문제 풀기

#### 5. SLAP_AWAKE (정신차려!)
화면을 미친듯이 때려서 깨기. 콤보 시스템으로 재미 추가

#### 6. SELFIE_ROAST (셀프 디스)
전면 카메라로 셀카 찍고 "일어나, 보기 싫어!" 같은 각성 메시지

#### 7. VOICE_POWER (외쳐라!)
"I'm gonna work, bitch!" 동기부여 문구를 큰 소리로 읽기 (음성 인식)

#### 8. COFFEE_RUN (카페인 충전)
미리 등록한 장소(커피머신, 부엌)까지 걸어가서 사진 인증

### 🔊 알람 기능
- 45+ 다양한 알람 사운드
- 점진적 볼륨 증가
- 진동 패턴 커스터마이징
- 다시 잠들기 방지 (재알람)

### 📊 통계 & 분석
- 기상 성공률 추적
- 미션 수행 시간 분석
- 주간/월간 리포트

## 기술 스택

### Mobile App (Flutter)
```
- Flutter 3.x
- Bloc/Cubit (상태 관리)
- GetIt (의존성 주입)
- Hive (로컬 DB)
- Firebase Cloud Messaging (푸시)
```

### Backend (NestJS)
```
- NestJS + TypeScript
- Clean Architecture
- PostgreSQL (메인 DB)
- Redis (캐싱)
- JWT Authentication
- Swagger API 문서화
```

## 프로젝트 구조

```
wake-up-bitch/
├── backend/              # NestJS 백엔드
│   ├── src/
│   │   ├── domain/      # 도메인 엔티티
│   │   ├── application/ # 유스케이스
│   │   ├── infrastructure/ # 외부 인터페이스
│   │   └── presentation/ # API 컨트롤러
│   └── test/
├── mobile/              # Flutter 앱
│   ├── lib/
│   │   ├── core/       # 핵심 유틸리티
│   │   ├── features/   # 기능별 모듈
│   │   └── shared/     # 공유 컴포넌트
│   └── test/
├── docs/               # 문서
│   ├── api/           # API 문서
│   ├── architecture/  # 아키텍처 설계
│   └── design/        # UI/UX 디자인
└── README.md
```

## 개발 로드맵

- [x] 프로젝트 구조 설계
- [ ] 백엔드 Clean Architecture 구현
- [ ] 데이터베이스 스키마 설계
- [ ] Flutter 앱 기본 구조
- [ ] 8가지 기상 미션 구현
- [ ] 알람 시스템 구현
- [ ] UI/UX 디자인 및 구현
- [ ] 테스트 코드 작성
- [ ] 배포 준비 (PlayStore, AppStore)

## 라이선스

MIT

## 기여

이 프로젝트는 개인 프로젝트입니다.
