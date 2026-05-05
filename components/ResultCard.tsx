import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { ParsedBarcode, formatBarcodeType } from '@/utils/barcodeParser';

type Props = {
  barcode: ParsedBarcode;
  format: string;
  scannedAt?: string;
  onClose?: () => void;
};

export default function ResultCard({ barcode, format, scannedAt, onClose }: Props) {
  const handleAction = () => {
    if (barcode.type === 'url') {
      Linking.openURL(barcode.value).catch(() =>
        Alert.alert('오류', 'URL을 열 수 없습니다.')
      );
    } else if (barcode.type === 'email') {
      Linking.openURL(`mailto:${barcode.value}`);
    } else if (barcode.type === 'phone') {
      Linking.openURL(`tel:${barcode.value}`);
    }
  };

  const actionLabel: Record<string, string> = {
    url: '브라우저에서 열기',
    email: '메일 앱 열기',
    phone: '전화 걸기',
    text: '',
  };

  const typeColor: Record<string, string> = {
    url: '#3B82F6',
    email: '#10B981',
    phone: '#F59E0B',
    text: '#6B7280',
  };

  return (
    <View className="bg-white rounded-2xl p-5 shadow-md mx-4">
      <View className="flex-row justify-between items-start mb-3">
        <View
          style={{ backgroundColor: typeColor[barcode.type] + '20' }}
          className="px-3 py-1 rounded-full"
        >
          <Text style={{ color: typeColor[barcode.type] }} className="text-xs font-semibold">
            {barcode.label}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">{formatBarcodeType(format)}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} className="ml-2">
            <Text className="text-gray-400 text-lg">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-base text-gray-800 mb-4 leading-relaxed" selectable>
        {barcode.value}
      </Text>

      {scannedAt && (
        <Text className="text-xs text-gray-400 mb-3">
          {new Date(scannedAt).toLocaleString('ko-KR')}
        </Text>
      )}

      {barcode.type !== 'text' && (
        <TouchableOpacity
          onPress={handleAction}
          style={{ backgroundColor: typeColor[barcode.type] }}
          className="py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">{actionLabel[barcode.type]}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
