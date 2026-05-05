export { getBarcodeFormatInfo, BARCODE_FORMATS } from './barcodeFormats';
export type { BarcodeFormatInfo, BarcodeCategory } from './barcodeFormats';
import { BARCODE_FORMATS, normalizeBarcodeType } from './barcodeFormats';

export type ParsedBarcode = {
  type: 'url' | 'email' | 'phone' | 'text';
  label: string;
  value: string;
};

export function parseBarcode(value: string): ParsedBarcode {
  if (/^https?:\/\//i.test(value)) {
    return { type: 'url', label: 'URL', value };
  }
  if (/^mailto:/i.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { type: 'email', label: '이메일', value: value.replace(/^mailto:/i, '') };
  }
  if (/^tel:/i.test(value) || /^\+?[\d\s\-()]{7,}$/.test(value)) {
    return { type: 'phone', label: '전화번호', value: value.replace(/^tel:/i, '') };
  }
  return { type: 'text', label: '텍스트', value };
}

export function formatBarcodeType(format: string): string {
  const key = normalizeBarcodeType(format);
  return BARCODE_FORMATS[key]?.displayName ?? format;
}
