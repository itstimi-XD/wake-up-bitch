# Google Play Store 배포 가이드

## 목차
1. [사전 준비](#사전-준비)
2. [앱 빌드](#앱-빌드)
3. [Google Play Console 설정](#google-play-console-설정)
4. [앱 업로드](#앱-업로드)
5. [스토어 등록 정보 작성](#스토어-등록-정보-작성)
6. [심사 제출](#심사-제출)

---

## 사전 준비

### 1. Google Play Developer 계정 등록

1. **Google Play Console 가입**
   - https://play.google.com/console 접속
   - Google 계정으로 로그인
   - **등록비 $25 결제** (1회 결제, 평생 사용)
   - 개발자 계정 정보 입력

2. **결제 프로필 설정**
   - 결제 센터 > 결제 프로필 설정
   - 은행 계좌 정보 입력 (수익 정산용)
   - 세금 정보 입력

### 2. 필요한 파일 준비

```bash
wake-up-bitch/
├── mobile/
│   ├── android/
│   │   └── app/
│   │       └── key.properties  # (생성 필요)
│   └── assets/
│       └── icons/
│           ├── app_icon.png    # 512x512
│           └── feature_graphic.png  # 1024x500
```

#### 앱 아이콘 (512x512 PNG)
- 투명 배경 없음
- 둥근 모서리 없음 (자동 처리됨)
- 그림자 효과 없음

#### 피쳐 그래픽 (1024x500 PNG)
- 앱의 주요 기능 시각화
- 텍스트 최소화

#### 스크린샷 (필수)
- **Phone**: 최소 2개 (권장 8개)
  - 크기: 320px ~ 3840px
  - 세로 스크린샷 권장
- **Tablet** (선택사항): 7인치, 10인치

---

## 앱 빌드

### 1. 서명 키 생성

앱을 Play Store에 업로드하려면 **서명 키**가 필요합니다.

```bash
cd mobile/android/app

# 키 생성 (keytool 사용)
keytool -genkey -v -keystore ~/upload-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias upload

# 입력 정보:
# - 키 저장소 비밀번호: [안전한 비밀번호 입력]
# - 이름, 조직, 도시, 국가 등 입력
# - 별칭(alias) 비밀번호: [안전한 비밀번호 입력]
```

**⚠️ 중요: 이 키는 절대 잃어버리면 안 됩니다!**
- 안전한 곳에 백업 (USB, 클라우드)
- 비밀번호 기록 (비밀번호 관리자 사용)

### 2. key.properties 파일 생성

`mobile/android/key.properties` 파일 생성:

```properties
storePassword=<키스토어 비밀번호>
keyPassword=<별칭 비밀번호>
keyAlias=upload
storeFile=<키스토어 파일 경로>
# 예: storeFile=/Users/yourname/upload-keystore.jks
```

**⚠️ `.gitignore`에 추가** (절대 Git에 커밋하지 말 것!)

```bash
echo "android/key.properties" >> .gitignore
```

### 3. build.gradle 설정

`mobile/android/app/build.gradle` 수정:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

### 4. 앱 버전 설정

`mobile/pubspec.yaml`:

```yaml
version: 1.0.0+1
# 형식: <버전명>+<빌드번호>
# 예: 1.0.0+1, 1.0.1+2, 1.1.0+3
```

업데이트 시:
- **버전명**: 사용자에게 표시 (1.0.0, 1.0.1, 1.1.0 등)
- **빌드번호**: 매번 증가 (1, 2, 3...)

### 5. Release 빌드

```bash
cd mobile

# 의존성 설치
flutter pub get

# AAB(Android App Bundle) 빌드 - Play Store 권장
flutter build appbundle --release

# 또는 APK 빌드 (테스트용)
flutter build apk --release
```

빌드 완료 후 파일 위치:
- **AAB**: `mobile/build/app/outputs/bundle/release/app-release.aab`
- **APK**: `mobile/build/app/outputs/apk/release/app-release.apk`

---

## Google Play Console 설정

### 1. 새 앱 만들기

1. Play Console > **모든 앱** > **앱 만들기**
2. 앱 정보 입력:
   - **앱 이름**: Wake Up Bitch
   - **기본 언어**: 한국어
   - **앱 또는 게임**: 앱
   - **무료 또는 유료**: 무료
3. 선언문 체크 후 **앱 만들기**

### 2. 앱 액세스 설정

**설정 > 앱 액세스**

- 모든 기능에 대한 무제한 액세스 가능
- 특수 액세스가 필요한 기능 없음 (우리 앱의 경우)

### 3. 광고 설정

**설정 > 광고**

- "아니요, 내 앱에 광고가 없습니다" 선택

### 4. 콘텐츠 등급

**설정 > 콘텐츠 등급**

1. **이메일 주소** 입력
2. **카테고리** 선택: 유틸리티
3. **설문조사** 작성:
   - 폭력성: 없음
   - 성적 콘텐츠: 없음
   - 비속어: 없음 (앱 이름은 괜찮음)
   - 기타 모두: 없음
4. **등급 받기**

예상 등급: **전체 이용가** 또는 **12세 이상**

### 5. 타겟 고객 및 콘텐츠

**설정 > 타겟 고객 및 콘텐츠**

1. **타겟 연령**
   - 18세 이상 선택

2. **스토어 노출**
   - Google Play의 가족 프로그램: 아니요

3. **뉴스 앱**
   - 아니요

### 6. 개인정보처리방침

**필수 항목!**

1. **개인정보처리방침 URL** 입력
   - GitHub Pages, Notion, 블로그 등에 호스팅
   - 예시: `https://yourusername.github.io/wake-up-bitch/privacy-policy.html`

2. **개인정보처리방침 작성** (샘플):

```markdown
# Wake Up Bitch 개인정보처리방침

최종 수정일: 2024년 11월 19일

## 수집하는 정보
- 이메일 주소
- 닉네임
- 알람 설정 정보
- 재무 프로필 (선택 사항)

## 정보 사용 목적
- 서비스 제공 및 개선
- 알람 및 미션 기능 제공
- 사용자 통계 제공

## 정보 공유
사용자의 개인정보를 제3자와 공유하지 않습니다.

## 데이터 보안
SSL 암호화를 통해 데이터를 안전하게 보호합니다.

## 연락처
문의사항: your-email@example.com
```

### 7. 데이터 보안

**설정 > 데이터 보안**

1. **데이터 수집 및 보안**
   - 데이터 수집: 예
   - 데이터 공유: 아니요

2. **수집하는 데이터 유형**
   - 개인 정보: 이메일, 이름
   - 앱 활동: 알람 기록

3. **데이터 삭제 요청**
   - 사용자가 앱 내에서 계정 삭제 가능

---

## 앱 업로드

### 1. 프로덕션 트랙 설정

**프로덕션 > 새 버전 만들기**

1. **App Bundle 업로드**
   - `app-release.aab` 파일 드래그 앤 드롭
   - 업로드 완료 대기 (수분 소요)

2. **버전 이름 및 출시 노트**
   ```
   버전 이름: 1.0.0

   출시 노트 (한국어):
   🔥 Wake Up Bitch v1.0.0

   ✨ 새로운 기능
   - 8가지 독창적인 기상 미션
   - BILLS_DUE: 월세/카드값으로 현실 직시
   - BOSS_FIGHT: 보스 레이드 미션
   - 재무 프로필 관리

   현실을 마주하고 일어나세요!
   ```

3. **저장** > **검토**

---

## 스토어 등록 정보 작성

### 1. 기본 스토어 등록 정보

**프로덕션 > 스토어 등록 정보 > 기본 스토어 등록 정보**

#### 앱 이름
```
Wake Up Bitch
```

#### 간단한 설명 (80자 이하)
```
현실을 마주하고 일어나는 진짜 알람 앱 - 월세 계산부터 보스 레이드까지!
```

#### 자세한 설명 (4000자 이하)
```
🔥 WAKE UP BITCH - 현실을 마주하고 일어나라!

다른 알람 앱들은 그냥 깨우기만 합니다.
우리는 **왜 일어나야 하는지** 알려줍니다.

## 🎯 8가지 독창적인 기상 미션

### 💰 BILLS_DUE (청구서가 기다려!)
월세, 카드값 입력하면 "10분 더 자면 480원 날림!"
현실적인 압박으로 확실하게 깨웁니다.

### ⚔️ BOSS_FIGHT (보스 레이드)
아침은 전쟁! 보스 몬스터를 연타로 공격해서 물리쳐야 알람 종료.

### ✅ REALITY_CHECK (현실 직시)
오늘 할 일 3가지 입력하고, 저녁에 완료 여부 체크.
할 일을 잊지 않게 도와줍니다.

### 💵 MONEY_TIME (돈 벌 시간)
"시간은 돈이다!" 시급 계산 문제 풀기.

### 👋 SLAP_AWAKE (정신차려!)
화면을 미친듯이 때려서 깨기. 콤보 시스템으로 재미 추가!

### 🤳 SELFIE_ROAST (셀프 디스)
전면 카메라로 셀카 찍고 "일어나, 보기 싫어!" 각성 메시지.

### 📢 VOICE_POWER (외쳐라!)
"I'm gonna work, bitch!" 동기부여 문구를 큰 소리로 읽기.

### ☕ COFFEE_RUN (카페인 충전)
미리 등록한 장소(커피머신, 부엌)까지 걸어가서 사진 인증!

## 🌟 차별화 포인트

✅ 현실적인 동기부여 (돈, 월세, 목표)
✅ 게이미피케이션 (보스 레이드, 점수 시스템)
✅ 재무 관리 습관 형성
✅ 트렌디한 UI/UX
✅ 완전 무료!

## 💪 핵심 기능

- 알람 설정 (시간, 요일, 사운드)
- 미션 조합 (여러 미션 순차 실행)
- 재무 프로필 관리
- 통계 및 성공률 추적
- 다시 잠들기 방지

침대에서 5분 더 vs 월세 내기?
선택은 명확합니다! 💸

지금 바로 Wake Up Bitch와 함께
당신의 아침을 바꿔보세요! 🔥
```

### 2. 그래픽 자산

#### 앱 아이콘 (512x512)
- PNG 파일
- 투명 배경 없음

#### 피쳐 그래픽 (1024x500)
- PNG 또는 JPG
- 앱의 핵심 비주얼 표현

#### 스크린샷 (Phone)
최소 2개, 권장 8개:
1. 로그인 화면
2. 알람 목록
3. 알람 생성
4. BILLS_DUE 미션
5. BOSS_FIGHT 미션
6. 재무 프로필
7. 통계 화면
8. 미션 선택

### 3. 앱 카테고리

- **카테고리**: 생산성 (Productivity)
- **태그**: 알람, 기상, 생산성, 습관

---

## 심사 제출

### 1. 최종 검토

**프로덕션 > 새 버전 만들기 > 검토**

다음 항목 모두 체크:
- ✅ App Bundle 업로드 완료
- ✅ 출시 노트 작성
- ✅ 스토어 등록 정보 완료
- ✅ 그래픽 자산 업로드
- ✅ 콘텐츠 등급 완료
- ✅ 개인정보처리방침 설정
- ✅ 데이터 보안 설정

### 2. 출시 제출

**"프로덕션으로 출시"** 버튼 클릭

### 3. 심사 기간

- **일반적인 심사 기간**: 1~3일
- **첫 번째 앱**: 최대 7일
- **거절 시**: 수정 후 재제출

### 4. 심사 중 상태 확인

Play Console > 대시보드에서 상태 확인:
- 심사 중
- 게시됨
- 거절됨 (사유 확인 후 수정)

---

## 업데이트 출시

### 1. 버전 업그레이드

`pubspec.yaml`:
```yaml
version: 1.0.1+2  # 버전명+빌드번호
```

### 2. 새 버전 빌드

```bash
flutter build appbundle --release
```

### 3. 업데이트 업로드

Play Console > 프로덕션 > 새 버전 만들기

- 새 AAB 업로드
- 출시 노트 작성
- 검토 및 출시

---

## 문제 해결

### 서명 키를 잃어버렸을 때

**⚠️ 심각한 문제!**

해결 불가능합니다. 새 앱으로 등록해야 합니다.
- 서명 키는 절대 잃어버리면 안 됩니다!
- 안전한 곳에 여러 곳에 백업

### 빌드 실패 시

```bash
# 캐시 삭제
flutter clean

# 의존성 재설치
flutter pub get

# 재빌드
flutter build appbundle --release
```

### 업로드 거절 사유

1. **권한 문제**
   - `AndroidManifest.xml`에서 불필요한 권한 제거

2. **타겟 SDK 버전**
   - `compileSdkVersion 34` 이상 필요

3. **64비트 지원**
   - Flutter는 기본적으로 지원 (걱정 안 해도 됨)

---

## 체크리스트

출시 전 최종 체크:

- [ ] Google Play Developer 계정 등록 ($25)
- [ ] 서명 키 생성 및 안전하게 백업
- [ ] key.properties 파일 작성
- [ ] 앱 아이콘 및 그래픽 자산 준비
- [ ] 스크린샷 촬영 (최소 2개)
- [ ] 개인정보처리방침 작성 및 호스팅
- [ ] AAB 파일 빌드
- [ ] Play Console에 앱 생성
- [ ] 모든 설정 항목 완료
- [ ] 스토어 등록 정보 작성
- [ ] 심사 제출

---

## 추가 리소스

- [Google Play Console 공식 문서](https://support.google.com/googleplay/android-developer)
- [Flutter 배포 가이드](https://docs.flutter.dev/deployment/android)
- [앱 서명 키 관리](https://developer.android.com/studio/publish/app-signing)

---

**성공적인 출시를 기원합니다! 🚀**
