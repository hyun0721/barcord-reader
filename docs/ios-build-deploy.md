# iOS 빌드 및 배포 가이드

## 사전 요구사항

- macOS (필수)
- Xcode (최신 버전 권장, App Store에서 설치)
- CocoaPods: `sudo gem install cocoapods`
- EAS CLI: `npm install -g eas-cli`
- Apple Developer 계정 (실기기 실행 및 배포 시 필요)

---

## 1. 로컬 개발 (시뮬레이터)

```bash
# 의존성 설치
npm install

# iOS 시뮬레이터에서 실행
npm run ios
# 또는
expo run:ios
```

> **참고:** 최초 실행 시 CocoaPods 설치 및 네이티브 빌드가 수행되므로 수 분이 소요될 수 있습니다.

---

## 2. 실기기 실행 (USB 연결)

### 2-1. 연결된 기기 자동 선택

```bash
npm run ios:device
# 또는
expo run:ios --device
```

연결된 기기 목록이 표시되면 대상 기기를 선택합니다.

### 2-2. 특정 기기 지정 (UDID)

```bash
# iPhone (UDID 지정)
npm run ios:iphone
# 내부적으로 실행되는 명령:
# expo run:ios --device 00008140-001A504A00E3C01C
```

### 2-3. Release 모드로 실기기 실행

```bash
# 연결된 기기 선택
npm run ios:device:release

# iPhone (UDID 지정)
npm run ios:iphone:release
```

> **Release 모드**는 Metro 번들러 없이 단독 실행되는 빌드입니다. 성능 확인이나 최종 테스트에 적합합니다.

---

## 3. EAS Build — Preview (내부 배포용 IPA)

EAS를 통해 `.ipa` 파일을 빌드하여 TestFlight 없이 기기에 직접 설치할 수 있습니다.

```bash
# Expo 로그인 (최초 1회)
eas login

# Preview 빌드 (internal distribution)
eas build --platform ios --profile preview
```

빌드 완료 후 EAS 대시보드 URL을 기기 Safari에서 열어 설치합니다.

> **주의:** Apple Developer 계정이 필요하며, 설치 전 **설정 → 일반 → VPN 및 기기 관리**에서 개발사를 신뢰해야 합니다.

---

## 4. EAS Build — Production (App Store 배포용)

```bash
eas build --platform ios --profile production
```

빌드 완료 후 EAS Submit 또는 [App Store Connect](https://appstoreconnect.apple.com)에서 `.ipa`를 업로드합니다.

```bash
# EAS를 통한 자동 제출
eas submit --platform ios --profile production
```

---

## 5. 네이티브 코드 재생성 (prebuild)

`app.json` 플러그인이나 네이티브 설정 변경 시 실행합니다.

```bash
# ios/ 폴더를 삭제하고 새로 생성
npm run prebuild:clean
# 또는
expo prebuild --clean
```

---

## 앱 정보

| 항목 | 값 |
|------|-----|
| Bundle Identifier | `com.barcordreader.app` |
| 앱 이름 | 바코드 리더 |
| EAS Project ID | `54c90a99-b403-43d8-8535-39f251d8c2eb` |

---

## eas.json 프로필 요약

| 프로필 | 배포 방식 | 용도 |
|--------|-----------|------|
| `development` | internal | 개발 클라이언트 빌드 |
| `preview` | internal | 테스트용 IPA 직접 설치 |
| `production` | store | App Store 배포 |
