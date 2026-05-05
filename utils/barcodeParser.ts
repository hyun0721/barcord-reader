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
  const map: Record<string, string> = {
    qr: 'QR Code',
    ean13: 'EAN-13',
    ean8: 'EAN-8',
    upc_a: 'UPC-A',
    upc_e: 'UPC-E',
    code128: 'Code 128',
    code39: 'Code 39',
    pdf417: 'PDF417',
    datamatrix: 'DataMatrix',
    aztec: 'Aztec',
    itf14: 'ITF-14',
    codabar: 'Codabar',
  };
  return map[format.toLowerCase()] ?? format;
}
