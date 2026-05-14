# 바코드 리더

iOS · Android 하이브리드 바코드 스캐너 앱. 카메라로 바코드를 인식하고 스캔 기록을 관리합니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 크로스플랫폼 | React Native 0.83.6 + Expo ~55.0 |
| 언어 | TypeScript 5.9 |
| 라우팅 | Expo Router (파일 기반) |
| 상태 관리 | Zustand 5 + AsyncStorage |
| 스타일링 | NativeWind 4 (Tailwind CSS) + RN StyleSheet |
| 카메라 | expo-camera |
| 클립보드 | expo-clipboard |
| 미디어 | expo-media-library |
| 아이콘 | @expo/vector-icons (Ionicons) |
| JS 엔진 | Hermes |
| 빌드 | EAS Build |

---

## 아키텍처

### 레이어 구조

```
┌─────────────────────────────────────────────────────┐
│                    Expo Router                       │
│            파일 기반 네비게이션 (Tab)                  │
│         app/_layout.tsx  ─  app/index.tsx            │
│                          ─  app/history.tsx          │
├─────────────────────────────────────────────────────┤
│                    UI Layer                          │
│   components/BarcodeScanner.tsx                      │
│   components/ResultCard.tsx                          │
├─────────────────────────────────────────────────────┤
│                  State Layer                         │
│   store/scanStore.ts  (Zustand)                      │
│         ↕ 영속화                                     │
│   AsyncStorage (@scan_history, 최대 100건)           │
├─────────────────────────────────────────────────────┤
│                  Utility Layer                       │
│   utils/barcodeParser.ts   ─ 콘텐츠 타입 파싱        │
│   utils/barcodeFormats.ts  ─ 12개 규격 메타데이터    │
│   constants/theme.ts       ─ 디자인 토큰             │
├─────────────────────────────────────────────────────┤
│               Native Bridge (Expo)                   │
│   expo-camera  expo-clipboard  expo-media-library    │
├──────────────────────┬──────────────────────────────┤
│        iOS           │          Android              │
│  React Native Core   │   React Native Core           │
│  (New Architecture)  │   (New Architecture)          │
└──────────────────────┴──────────────────────────────┘
```

### 주요 설계 결정

**New Architecture 활성화** (`newArchEnabled: true`)  
Fabric 렌더러와 JSI 기반 TurboModules를 사용해 JS ↔ Native 브릿지 오버헤드를 최소화합니다.

**Expo Router (파일 기반 라우팅)**  
`app/` 디렉토리 구조가 곧 라우트 구조이며, 탭 레이아웃(`_layout.tsx`)에서 전역 상태 초기화(스캔 기록 로드)를 처리합니다.

**Zustand + AsyncStorage 이중 레이어**  
인메모리 상태(Zustand)와 디스크 영속성(AsyncStorage)을 동기화합니다. 최신 100건만 유지해 스토리지 증가를 방지합니다.

**쿨다운 ref 패턴 (`BarcodeScanner`)**  
`useRef`로 쿨다운 플래그를 관리해 동일 바코드가 2초 내 중복 인식되는 것을 방지합니다. `useState`를 쓰지 않아 불필요한 리렌더를 피합니다.

---

## 지원 바코드 규격 (12종)

| 규격 | 타입 | 주요 용도 |
|------|------|----------|
| QR Code | 2D | URL, 결제, 인증(OTP) |
| EAN-13 | 1D | 국제 소매 상품, ISBN |
| EAN-8 | 1D | 소형 상품 포장 |
| UPC-A | 1D | 북미 소매 상품 |
| UPC-E | 1D | 소형 북미 소매 상품 |
| Code 128 | 1D | 물류·배송 라벨(GS1-128) |
| Code 39 | 1D | 자동차 부품, 의료기기 |
| PDF417 | 2D | 운전면허증, 항공권 탑승권 |
| DataMatrix | 2D | 전자부품 PCB, 의약품 |
| Aztec | 2D | 교통 승차권, 항공권 |
| ITF-14 | 1D | 물류 박스 외포장 |
| Codabar | 1D | 혈액 은행, 구형 FedEx |

---

## 주요 기능

- **실시간 스캔** — 후면 카메라로 바코드 자동 인식, 스캔 시 사진 자동 촬영
- **콘텐츠 타입 파싱** — URL / 이메일 / 전화번호 / 텍스트 자동 분류 및 앱 연동
- **규격 정보 조회** — 스캔된 바코드의 규격, 용도, 용량 상세 정보 제공
- **값 복사** — 스캔 결과를 클립보드에 복사
- **이미지 복사 / 갤러리 저장** — 스캔 시 촬영된 사진을 클립보드 복사 또는 갤러리 저장
- **플래시 토글** — 어두운 환경에서 플래시 켜기/끄기
- **스캔 기록** — 최대 100건 히스토리 조회 및 전체 삭제

---

## 프로젝트 구조

```
barcord-reader/
├── app/
│   ├── _layout.tsx        # 루트 레이아웃, 탭 네비게이션, 기록 초기화
│   ├── index.tsx          # 스캔 화면
│   └── history.tsx        # 스캔 기록 화면
├── components/
│   ├── BarcodeScanner.tsx # 카메라 뷰, 스캔 오버레이, 플래시 토글
│   └── ResultCard.tsx     # 스캔 결과 카드, 액션 버튼
├── store/
│   └── scanStore.ts       # Zustand 스토어 + AsyncStorage 영속화
├── utils/
│   ├── barcodeParser.ts   # 바코드 값 타입 파싱
│   └── barcodeFormats.ts  # 규격별 메타데이터 정의
├── constants/
│   └── theme.ts           # 컬러, 간격, 반경 토큰
├── assets/                # 아이콘, 스플래시 이미지
├── ios/                   # iOS 네이티브 프로젝트
├── app.json               # Expo 설정
└── eas.json               # EAS Build 설정
```

---

## 개발 환경 설정

### 요구사항

- Node.js 18+
- Xcode 15+ (iOS 빌드)
- Android Studio (Android 빌드)
- Expo CLI

### 설치 및 실행

```bash
# 의존성 설치
npm install

# Expo 개발 서버 시작
npm start

# iOS 시뮬레이터 실행
npm run ios

# Android 에뮬레이터 실행
npm run android
```

### iOS CocoaPods 설치

```bash
cd ios && pod install
```

---

## 권한

| 권한 | iOS | Android | 용도 |
|------|-----|---------|------|
| Camera | `NSCameraUsageDescription` | `CAMERA` | 바코드 스캔 |
| Photo Library (Read) | `NSPhotoLibraryUsageDescription` | `READ_MEDIA_IMAGES` | — |
| Photo Library (Write) | `NSPhotoLibraryAddUsageDescription` | `WRITE_EXTERNAL_STORAGE` | 갤러리 저장 |

---

## 빌드 (EAS)

```bash
# iOS 빌드
eas build --platform ios

# Android 빌드
eas build --platform android

# 전체 빌드
eas build --platform all
```

---

## 라이선스

MIT
