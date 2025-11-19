# Apple App Store 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [Apple Developer 등록](#apple-developer-등록)
3. [앱 빌드](#앱-빌드)
4. [App Store Connect 설정](#app-store-connect-설정)
5. [앱 업로드](#앱-업로드)
6. [심사 제출](#심사-제출)

---

## 사전 준비

### 필수 요구사항

1. **Mac 컴퓨터** (필수!)
   - macOS 기반에서만 iOS 빌드 가능
   - Xcode 필요

2. **Apple Developer Program 가입**
   - 비용: **$99/년**
   - 개인 또는 조직 계정

3. **Apple ID**
   - 개발자 계정용 Apple ID

---

## Apple Developer 등록

### 1. Apple Developer Program 가입

1. https://developer.apple.com 접속
2. Apple ID로 로그인
3. **"Join the Apple Developer Program"** 클릭
4. **계정 유형 선택**:
   - 개인 (Individual)
   - 조직 (Organization) - 사업자등록증 필요

5. **결제**:
   - 연간 $99 (약 13만원)
   - 신용카드 또는 체크카드

6. **승인 대기**:
   - 개인: 즉시 ~ 24시간
   - 조직: 1~3일 (서류 검토)

### 2. 인증서 및 프로비저닝 프로필

**Certificates, Identifiers & Profiles** 섹션에서 설정

---

## 앱 빌드

### 1. Mac 환경 설정

#### Xcode 설치

```bash
# Mac App Store에서 Xcode 설치
# 또는 터미널에서:
xcode-select --install
```

#### Flutter 설정 확인

```bash
flutter doctor
# iOS 관련 항목이 모두 체크되어야 함
```

### 2. iOS 프로젝트 설정

#### Bundle Identifier 설정

`mobile/ios/Runner.xcodeproj`를 Xcode로 열기:

```bash
cd mobile
open ios/Runner.xcworkspace
```

Xcode에서:
1. **Runner** 선택
2. **General** 탭
3. **Bundle Identifier** 입력:
   - 예: `com.yourcompany.wakeupbitch`
   - 고유해야 함 (다른 앱과 중복 불가)

#### 버전 설정

`mobile/pubspec.yaml`:
```yaml
version: 1.0.0+1
```

Xcode에서도 확인:
- **Version**: 1.0.0
- **Build**: 1

### 3. 앱 아이콘 설정

#### 아이콘 준비

다양한 크기의 아이콘 필요:
- 20x20 (2x, 3x)
- 29x29 (2x, 3x)
- 40x40 (2x, 3x)
- 60x60 (2x, 3x)
- 76x76 (1x, 2x)
- 83.5x83.5 (2x)
- 1024x1024 (1x)

#### 아이콘 생성 도구

**온라인 도구 사용** (추천):
- https://appicon.co
- https://makeappicon.com

1024x1024 PNG 업로드하면 모든 사이즈 자동 생성

#### Xcode에 아이콘 추가

1. Xcode > **Assets.xcassets** > **AppIcon**
2. 각 슬롯에 해당 크기 아이콘 드래그 앤 드롭

### 4. Info.plist 설정

`mobile/ios/Runner/Info.plist`:

```xml
<key>CFBundleDisplayName</key>
<string>Wake Up Bitch</string>

<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<key>CFBundleVersion</key>
<string>1</string>

<!-- 권한 설명 (사용하는 기능에 따라 추가) -->
<key>NSCameraUsageDescription</key>
<string>셀카 및 사진 인증 미션에 사용됩니다</string>

<key>NSMicrophoneUsageDescription</key>
<string>음성 인식 미션에 사용됩니다</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>사진을 저장하고 불러오기 위해 사용됩니다</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>특정 장소 인증 미션에 사용됩니다</string>

<key>NSMotionUsageDescription</key>
<string>걷기 및 스쿼트 미션에 사용됩니다</string>
```

### 5. iOS 빌드

#### 디버그 빌드 (테스트용)

```bash
cd mobile
flutter build ios --debug
```

#### Release 빌드 (배포용)

```bash
flutter build ios --release
```

---

## App Store Connect 설정

### 1. App Store Connect 접속

https://appstoreconnect.apple.com

Apple Developer 계정으로 로그인

### 2. 새 앱 등록

1. **"나의 앱"** > **"+" 버튼** > **"새로운 앱"**

2. **기본 정보 입력**:
   ```
   플랫폼: iOS
   이름: Wake Up Bitch
   기본 언어: 한국어
   번들 ID: com.yourcompany.wakeupbitch (위에서 설정한 것)
   SKU: wakeupbitch (고유 식별자, 임의 문자열)
   사용자 액세스: 전체 액세스
   ```

3. **"생성"** 클릭

### 3. 앱 정보 설정

#### 개인정보 보호 정책 URL

**필수!** 웹사이트에 호스팅 필요

```
https://yourdomain.com/privacy-policy.html
```

#### 카테고리

- **기본 카테고리**: 생산성
- **보조 카테고리**: 유틸리티 (선택사항)

#### 연령 등급

**앱 등급 설문조사** 작성:
- 비속어 또는 저속한 유머: 드물게/경미하게
- 기타 항목: 없음

예상 등급: **12+** 또는 **17+**

### 4. 가격 및 배포

**가격 및 사용 가능 여부**:
- **가격**: 무료
- **사용 가능 국가**: 모든 국가 선택

---

## 앱 업로드

### 1. Archive 생성

Xcode에서:

1. **Product** > **Scheme** > **Runner** 선택
2. **Product** > **Destination** > **Any iOS Device** 선택
3. **Product** > **Archive** 클릭
4. Archive 생성 완료 대기 (수분 소요)

### 2. App Store에 업로드

Archive 완료 후:

1. **Window** > **Organizer** 열기
2. **Archives** 탭에서 방금 생성한 Archive 선택
3. **Validate App** 클릭 (유효성 검사)
   - 문제 없으면 계속
4. **Distribute App** 클릭
5. **App Store Connect** 선택
6. **Upload** 선택
7. 자동으로 서명 옵션 선택
8. **Upload** 클릭

업로드 완료까지 10~30분 소요

### 3. 업로드 확인

App Store Connect에서:
1. **앱** > **TestFlight** 탭
2. **"iOS 빌드"** 섹션에 새 빌드 표시
3. 처리 중... → 준비됨 (10~30분)

---

## 스토어 등록 정보 작성

### 1. 앱 정보

**앱** > **앱 정보**

#### 이름
```
Wake Up Bitch
```

#### 부제 (30자)
```
현실을 마주하고 일어나라!
```

#### 설명 (4000자)
```
🔥 WAKE UP BITCH - 현실을 마주하고 일어나라!

다른 알람 앱들은 그냥 깨우기만 합니다.
우리는 WHY(왜 일어나야 하는지)를 알려줍니다.

■ 8가지 독창적인 기상 미션

💰 BILLS_DUE (청구서가 기다려!)
월세, 카드값 입력하면 "10분 더 자면 480원 날림!"
현실적인 압박으로 확실하게 깨웁니다.

⚔️ BOSS_FIGHT (보스 레이드)
아침은 전쟁! 보스 몬스터를 연타로 공격해서 물리치세요.

✅ REALITY_CHECK (현실 직시)
오늘 할 일 3가지 입력하고, 저녁에 완료 여부 체크.

💵 MONEY_TIME (돈 벌 시간)
"시간은 돈이다!" 시급 계산 문제 풀기.

👋 SLAP_AWAKE (정신차려!)
화면을 미친듯이 때려서 깨기. 콤보 시스템!

🤳 SELFIE_ROAST (셀프 디스)
전면 카메라로 셀카 찍고 각성 메시지.

📢 VOICE_POWER (외쳐라!)
"I'm gonna work, bitch!" 동기부여 문구 외치기.

☕ COFFEE_RUN (카페인 충전)
커피머신까지 걸어가서 사진 인증!

■ 차별화 포인트

✅ 현실적인 동기부여 (돈, 월세, 목표)
✅ 게이미피케이션
✅ 재무 관리 습관 형성
✅ 트렌디한 UI/UX
✅ 완전 무료!

침대에서 5분 더 vs 월세 내기?
선택은 명확합니다!

지금 바로 Wake Up Bitch와 함께
당신의 아침을 바꿔보세요! 🔥
```

#### 키워드 (100자, 쉼표로 구분)
```
알람,기상,습관,생산성,목표,돈,재무,게임,미션,깨우기
```

#### 지원 URL
```
https://github.com/yourusername/wake-up-bitch
```

#### 마케팅 URL (선택)
```
https://yourwebsite.com
```

### 2. 스크린샷

#### 필수 화면 크기

**iPhone 6.7" Display** (iPhone 14 Pro Max):
- 1290 x 2796 픽셀
- 최소 3개, 최대 10개

**iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max):
- 1242 x 2688 픽셀
- 최소 3개, 최대 10개

**iPhone 5.5" Display** (iPhone 8 Plus):
- 1242 x 2208 픽셀
- 최소 3개, 최대 10개

#### 스크린샷 생성 방법

1. **iOS 시뮬레이터** 사용:
   ```bash
   open -a Simulator
   # Device > 해당 기기 선택
   # 앱 실행 후 Cmd+S로 스크린샷
   ```

2. **온라인 도구**:
   - https://www.appscreenshot.com
   - https://screenshots.pro

#### 권장 스크린샷 순서
1. 로그인 화면
2. 알람 목록
3. BILLS_DUE 미션
4. BOSS_FIGHT 미션
5. 재무 프로필
6. 통계 화면

### 3. 앱 미리보기 (선택사항)

15~30초 영상:
- 앱 사용 시연
- 주요 기능 시연

### 4. 버전 정보

**버전 1.0.0**

#### 새로운 기능
```
🔥 Wake Up Bitch 첫 출시!

✨ 새로운 기능
• 8가지 독창적인 기상 미션
• BILLS_DUE: 월세/카드값으로 현실 직시
• BOSS_FIGHT: 보스 레이드 미션
• 재무 프로필 관리
• 통계 및 성공률 추적

현실을 마주하고 일어나세요!
```

---

## 심사 제출

### 1. 빌드 선택

**앱** > **앱 버전** > **빌드**

TestFlight에서 처리 완료된 빌드 선택

### 2. 앱 심사 정보

#### 연락처 정보
```
이름: [귀하의 이름]
전화번호: [연락 가능한 번호]
이메일: [이메일 주소]
```

#### 데모 계정 (로그인 필요 시)
```
사용자 이름: demo@example.com
비밀번호: Demo1234!
```

#### 참고 사항
```
알람 기능 테스트 방법:
1. 알람 생성
2. 시간을 1분 후로 설정
3. 미션 추가
4. 알람이 울리면 미션 완료

특이사항:
- 카메라, 마이크, 위치 권한 필요
- 백그라운드에서 알람 작동
```

### 3. 버전 출시

#### 출시 방법 선택
- **수동 출시**: 승인 후 직접 출시 버튼 클릭
- **자동 출시**: 승인 즉시 자동 배포

#### 단계별 출시 (선택)
- 1일차: 1% 사용자
- 3일차: 10% 사용자
- 7일차: 50% 사용자
- 14일차: 100% 사용자

### 4. 제출

**"검토를 위해 제출"** 클릭

---

## 심사 과정

### 심사 단계

1. **제출 완료** → 대기 중
2. **심사 중** (1~3일)
3. **승인** 또는 **거절**

### 심사 기간

- **일반적**: 1~3일
- **첫 번째 앱**: 3~7일
- **휴일/주말**: 더 오래 걸림

### 거절 사유 및 대응

#### 일반적인 거절 사유

1. **2.3.10 - 정확한 메타데이터**
   - 스크린샷이 실제 앱과 다름
   - **대응**: 정확한 스크린샷으로 교체

2. **4.0 - 디자인**
   - UI가 Apple 가이드라인 위반
   - **대응**: 디자인 수정

3. **5.1.1 - 개인정보 보호**
   - 개인정보처리방침 누락
   - **대응**: 개인정보처리방침 추가

4. **2.1 - 앱 완성도**
   - 크래시, 버그
   - **대응**: 버그 수정 후 재제출

#### 거절 시 대응

1. App Store Connect에서 거절 사유 확인
2. 문제 수정
3. **"버전 편집"** 또는 **"새 버전 제출"**
4. 수정 내용 설명과 함께 재제출

---

## 업데이트 출시

### 1. 새 버전 생성

App Store Connect:
1. **"+" 버튼** > **새 버전**
2. 버전 번호 입력: `1.0.1`

### 2. 코드 업데이트

`pubspec.yaml`:
```yaml
version: 1.0.1+2  # 버전+빌드번호
```

### 3. 새 빌드

```bash
flutter build ios --release
```

Xcode에서 다시 Archive & Upload

### 4. 업데이트 제출

- 새 빌드 선택
- 새로운 기능 작성
- 심사 제출

---

## TestFlight 베타 테스트

### 1. TestFlight란?

- 앱 정식 출시 전 베타 테스트 플랫폼
- 최대 10,000명 테스터
- 앱 스토어 제출 전 테스트 가능

### 2. 내부 테스터 추가

1. TestFlight > **내부 테스터**
2. **"+" 버튼** > 이메일 추가
3. 테스터에게 초대 이메일 발송
4. TestFlight 앱 다운로드 후 설치

### 3. 외부 테스터 추가

1. TestFlight > **외부 테스터**
2. 공개 링크 생성
3. 링크 공유로 누구나 베타 테스트 가능

---

## 문제 해결

### Xcode 빌드 실패

```bash
# Podfile 업데이트
cd ios
pod install
cd ..

# 클린 빌드
flutter clean
flutter pub get
flutter build ios --release
```

### Archive 업로드 실패

1. Xcode > **Preferences** > **Accounts**
2. Apple ID 재로그인
3. **Download Manual Profiles** 클릭

### 인증서 문제

1. https://developer.apple.com
2. **Certificates, Identifiers & Profiles**
3. 인증서 재생성

---

## 체크리스트

출시 전 최종 체크:

- [ ] Apple Developer Program 가입 ($99/년)
- [ ] Bundle ID 설정
- [ ] 앱 아이콘 모든 크기 준비
- [ ] 스크린샷 준비 (최소 3개)
- [ ] 개인정보처리방침 작성 및 호스팅
- [ ] Info.plist 권한 설명 추가
- [ ] iOS Release 빌드 성공
- [ ] Archive 생성 및 업로드
- [ ] App Store Connect 앱 생성
- [ ] 모든 스토어 정보 입력
- [ ] 빌드 선택
- [ ] 심사 제출

---

## 추가 리소스

- [App Store Connect 가이드](https://developer.apple.com/app-store-connect/)
- [App Store 심사 가이드라인](https://developer.apple.com/app-store/review/guidelines/)
- [Flutter iOS 배포 가이드](https://docs.flutter.dev/deployment/ios)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**성공적인 출시를 기원합니다! 🍎**
