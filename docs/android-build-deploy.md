# Android 빌드 및 배포 가이드

## 사전 요구사항

- Node.js (LTS 권장)
- Android Studio (Android SDK, AVD 에뮬레이터 포함)
- EAS CLI: `npm install -g eas-cli`
- Expo 계정 (EAS 빌드 사용 시)

---

## 1. 로컬 개발 (에뮬레이터)

Android Studio에서 에뮬레이터를 먼저 실행한 뒤 아래 명령어를 실행합니다.

```bash
# 의존성 설치
npm install

# Android 에뮬레이터에서 실행
npm run android
# 또는
expo run:android
```

> **참고:** 최초 실행 시 네이티브 빌드가 수행되므로 수 분이 소요될 수 있습니다.

---

## 2. 실기기 실행 (USB 연결)

1. 기기에서 **개발자 옵션 → USB 디버깅** 활성화
2. USB로 PC에 연결
3. 아래 명령어 실행:

```bash
expo run:android --device
```

연결된 기기 목록이 표시되면 대상 기기를 선택합니다.

---

## 3. EAS Build — Preview (내부 배포용 APK)

EAS를 통해 `.apk` 파일을 빌드하여 기기에 직접 설치할 수 있습니다.

```bash
# Expo 로그인 (최초 1회)
eas login

# Preview 빌드 (APK, internal distribution)
eas build --platform android --profile preview
```

빌드 완료 후 EAS 대시보드 또는 CLI 출력의 URL에서 APK를 다운로드하여 기기에 설치합니다.

---

## 4. EAS Build — Production (Google Play 배포용 AAB)

```bash
eas build --platform android --profile production
```

빌드 완료 후 `.aab` 파일을 [Google Play Console](https://play.google.com/console)에 업로드합니다.

---

## 5. 네이티브 코드 재생성 (prebuild)

`app.json` 플러그인이나 네이티브 설정 변경 시 실행합니다.

```bash
# android/ 폴더를 삭제하고 새로 생성
npm run prebuild:clean
# 또는
expo prebuild --clean
```

---

## 앱 정보

| 항목 | 값 |
|------|-----|
| 패키지명 | `com.barcordreader.app` |
| 앱 이름 | 바코드 리더 |
| EAS Project ID | `54c90a99-b403-43d8-8535-39f251d8c2eb` |

---

## eas.json 프로필 요약

| 프로필 | 배포 방식 | 용도 |
|--------|-----------|------|
| `development` | internal | 개발 클라이언트 빌드 |
| `preview` | internal | 테스트용 APK 배포 |
| `production` | store | Google Play 스토어 배포 |
