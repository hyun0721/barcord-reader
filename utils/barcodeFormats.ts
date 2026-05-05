export type BarcodeCategory = '1D' | '2D';

export type BarcodeFormatInfo = {
  displayName: string;
  category: BarcodeCategory;
  description: string;
  useCases: string[];
  capacity: string;
  charset: string;
  /** 고정 자릿수가 있는 경우 (EAN-13 = 13 등) */
  fixedDigits?: number;
};

export const BARCODE_FORMATS: Record<string, BarcodeFormatInfo> = {
  qr: {
    displayName: 'QR Code',
    category: '2D',
    description: '일본 덴소웨이브가 1994년 개발한 2D 매트릭스 바코드. 오류 수정 기능이 강해 일부가 훼손돼도 인식 가능.',
    useCases: ['URL/웹사이트 링크', '연락처(vCard)', '결제/송금 정보', '인증(OTP/MFA)'],
    capacity: '최대 7,089자(숫자) / 4,296자(영숫자) / 2,953바이트(이진)',
    charset: '숫자, 영문, 이진 데이터, 한자',
  },
  ean13: {
    displayName: 'EAN-13',
    category: '1D',
    description:
      '13자리 국제 상품 바코드(ISO/IEC 15420). 구조: 국가코드(3) + 제조사코드(4~5) + 상품코드(4~5) + 체크디지트(1). 마지막 자리는 앞 12자리로 계산한 Luhn 체크섬.',
    useCases: ['소매 상품(마트, 편의점)', '도서(ISBN-13)', '의약품 외포장'],
    capacity: '13자리 숫자 고정',
    charset: '숫자(0–9)',
    fixedDigits: 13,
  },
  ean8: {
    displayName: 'EAN-8',
    category: '1D',
    description:
      'EAN-13의 축약형. 8자리 고정. 소형 상품처럼 공간이 부족할 때 사용. 구조: 국가코드(2~3) + 상품코드(4~5) + 체크디지트(1).',
    useCases: ['소형 상품(껌, 담배)', '공간 제약 포장'],
    capacity: '8자리 숫자 고정',
    charset: '숫자(0–9)',
    fixedDigits: 8,
  },
  upc_a: {
    displayName: 'UPC-A',
    category: '1D',
    description:
      '12자리 북미 표준 상품 바코드(GS1-US). EAN-13의 하위 집합(앞에 0 추가 시 EAN-13 호환). 구조: 시스템코드(1) + 제조사코드(5) + 상품코드(5) + 체크디지트(1).',
    useCases: ['북미 소매 상품', '식료품, 음료'],
    capacity: '12자리 숫자 고정',
    charset: '숫자(0–9)',
    fixedDigits: 12,
  },
  upc_e: {
    displayName: 'UPC-E',
    category: '1D',
    description:
      'UPC-A를 8자리로 압축. 내부 0을 제거하는 규칙으로 UPC-A에서 변환. 디코더가 UPC-A로 복원해 처리.',
    useCases: ['소형 소매 상품', '공간 제약 포장'],
    capacity: '8자리(실제 데이터 6자리)',
    charset: '숫자(0–9)',
    fixedDigits: 8,
  },
  code128: {
    displayName: 'Code 128',
    category: '1D',
    description:
      '가변 길이 고밀도 1D 바코드. ASCII 128자 전체 표현 가능. 코드셋 A(제어문자 포함), B(대소문자), C(숫자쌍 압축) 세 가지를 동적으로 전환.',
    useCases: ['물류/배송 라벨(GS1-128)', '재고 관리', '제조업 내부 코드'],
    capacity: '가변 길이(실용 권장: 1–48자)',
    charset: 'ASCII 전체(0–127)',
  },
  code39: {
    displayName: 'Code 39',
    category: '1D',
    description:
      '1974년 개발된 최초의 알파뉴메릭 1D 바코드. 문자 사이 갭으로 구분하는 단순한 구조. 체크디지트 선택 사항.',
    useCases: ['자동차 산업 부품 식별', '의료기기', '미군/미항공청(DoD/FAA) 표준'],
    capacity: '가변 길이(권장: 1–20자)',
    charset: '대문자 영문(A–Z), 숫자(0–9), 특수문자 7개(- . $ / + % 스페이스)',
  },
  pdf417: {
    displayName: 'PDF417',
    category: '2D',
    description:
      'Portable Data File 417. 1D 바코드 행을 여러 층으로 쌓은 스태킹형 2D 바코드(ISO 15438). 최대 30%까지 손상돼도 복원 가능.',
    useCases: ['운전면허증 / 신분증 뒷면', '항공권 탑승권(BCBP)', '화물·물류 추적'],
    capacity: '최대 1,850자(텍스트) / 2,710자(숫자) / 1,108바이트(이진)',
    charset: '전체 ASCII, 이진 데이터',
  },
  datamatrix: {
    displayName: 'DataMatrix',
    category: '2D',
    description:
      'ISO 16022 표준 2D 매트릭스 코드. 초소형 인쇄 가능(최소 0.3mm²). 직접 부품 마킹(DPM)에 강함.',
    useCases: ['전자부품 / PCB 식별', '의약품 낱알 직인(GS1 DataMatrix)', '항공우주 부품 추적'],
    capacity: '최대 3,116자(숫자) / 2,335자(영문) / 1,556바이트(이진)',
    charset: '전체 ASCII, 이진 데이터',
  },
  aztec: {
    displayName: 'Aztec Code',
    category: '2D',
    description:
      '1995년 Welch Allyn이 개발. 중앙 불스아이 패턴으로 파인더 패턴 없이도 빠른 인식. 오류 수정률 최대 95%.',
    useCases: ['교통 승차권(유럽 철도·버스)', '항공권', '의료 처방전'],
    capacity: '최대 3,832자(숫자) / 3,067자(영문) / 1,914바이트(이진)',
    charset: '전체 ASCII, 이진 데이터',
  },
  itf14: {
    displayName: 'ITF-14',
    category: '1D',
    description:
      'Interleaved 2 of 5 기반 14자리 물류 바코드(GS1 표준). 거친 표면(골판지)에서도 인식 가능하도록 넓은 바 사용. 앞 자리는 GS1 패키징 표시자.',
    useCases: ['물류 박스 / 외포장 라벨', '식품 산업 물류', '창고·팔레트 관리'],
    capacity: '14자리 숫자 고정',
    charset: '숫자(0–9)',
    fixedDigits: 14,
  },
  codabar: {
    displayName: 'Codabar',
    category: '1D',
    description:
      '1972년 Monarch Marking Systems 개발. 시작/끝 문자로 A·B·C·D 중 하나 사용. 구형 바코드로 신규 시스템에서는 거의 대체됨.',
    useCases: ['혈액 은행 / 혈액팩 라벨', '미국 도서관(구형)', 'FedEx 구형 패키지'],
    capacity: '가변 길이',
    charset: '숫자(0–9), 특수문자(- $ : / . +), 시작·종료문자(A–D)',
  },
};

/** expo-camera가 반환하는 type 문자열을 키로 정규화 */
export function normalizeBarcodeType(type: string): string {
  return type.toLowerCase().replace(/-/g, '_');
}

export function getBarcodeFormatInfo(type: string): BarcodeFormatInfo | null {
  return BARCODE_FORMATS[normalizeBarcodeType(type)] ?? null;
}
