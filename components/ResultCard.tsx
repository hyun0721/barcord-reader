import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { ParsedBarcode, formatBarcodeType, getBarcodeFormatInfo } from '@/utils/barcodeParser';

type Props = {
  barcode: ParsedBarcode;
  format: string;
  photoUri?: string;
  scannedAt?: string;
  onClose?: () => void;
};

export default function ResultCard({ barcode, format, photoUri, scannedAt, onClose }: Props) {
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatInfo = getBarcodeFormatInfo(format);

  // ── 액션 핸들러 ──────────────────────────────────────────
  const handleOpenAction = () => {
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

  const handleCopyValue = async () => {
    await Clipboard.setStringAsync(barcode.value);
    Alert.alert('복사 완료', '값이 클립보드에 복사되었습니다.');
  };

  const handleCopyImage = async () => {
    if (!photoUri) return;
    setCopying(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const base64 = await FileSystem.readAsStringAsync(photoUri, { encoding: 'base64' as any });
      await Clipboard.setImageAsync(base64);
      Alert.alert('복사 완료', '이미지가 클립보드에 복사되었습니다.');
    } catch {
      Alert.alert('오류', '이미지를 복사하는 데 실패했습니다.');
    } finally {
      setCopying(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!photoUri) return;
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 저장을 위해 사진 라이브러리 권한이 필요합니다.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(photoUri);
      Alert.alert('저장 완료', '이미지가 갤러리에 저장되었습니다.');
    } catch {
      Alert.alert('오류', '갤러리 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleShowFormatInfo = () => {
    if (!formatInfo) return;
    Alert.alert(
      formatInfo.displayName,
      [
        `구분: ${formatInfo.category} 바코드`,
        '',
        formatInfo.description,
        '',
        `용량: ${formatInfo.capacity}`,
        `문자셋: ${formatInfo.charset}`,
        '',
        `주요 용도:\n${formatInfo.useCases.map((u) => `• ${u}`).join('\n')}`,
      ].join('\n'),
      [{ text: '확인' }]
    );
  };

  // ── 색상 테마 ────────────────────────────────────────────
  const typeColor: Record<string, string> = {
    url: '#3B82F6',
    email: '#10B981',
    phone: '#F59E0B',
    text: '#6B7280',
  };

  const actionLabel: Record<string, string> = {
    url: '브라우저에서 열기',
    email: '메일 앱 열기',
    phone: '전화 걸기',
    text: '',
  };

  const color = typeColor[barcode.type];

  return (
    <View className="bg-white rounded-2xl shadow-md mx-4 overflow-hidden">
      {/* 헤더 */}
      <View className="px-5 pt-5 pb-3">
        <View className="flex-row justify-between items-start">
          <View style={{ backgroundColor: color + '20' }} className="px-3 py-1 rounded-full">
            <Text style={{ color }} className="text-xs font-semibold">
              {barcode.label}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            {formatInfo && (
              <TouchableOpacity onPress={handleShowFormatInfo} className="flex-row items-center">
                <View className="bg-gray-100 px-2 py-1 rounded-full flex-row items-center">
                  <Text className="text-xs text-gray-500">{formatInfo.displayName}</Text>
                  <Text className="text-xs text-gray-400 ml-1">ⓘ</Text>
                </View>
              </TouchableOpacity>
            )}
            {!formatInfo && (
              <Text className="text-xs text-gray-400">{formatBarcodeType(format)}</Text>
            )}
            {onClose && (
              <TouchableOpacity onPress={onClose} className="ml-1">
                <Text className="text-gray-400 text-lg">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 바코드 값 */}
        <Text className="text-base text-gray-800 mt-3 leading-relaxed" selectable>
          {barcode.value}
        </Text>

        {scannedAt && (
          <Text className="text-xs text-gray-400 mt-2">
            {new Date(scannedAt).toLocaleString('ko-KR')}
          </Text>
        )}
      </View>

      {/* 액션 버튼 행 */}
      <View className="flex-row border-t border-gray-100">
        <ActionButton label="값 복사" emoji="📋" onPress={handleCopyValue} />
        <ActionButton
          label={copying ? '복사 중…' : '이미지 복사'}
          emoji="🖼️"
          onPress={handleCopyImage}
          disabled={!photoUri || copying}
        />
        <ActionButton
          label={saving ? '저장 중…' : '갤러리 저장'}
          emoji="💾"
          onPress={handleSaveToGallery}
          disabled={!photoUri || saving}
          last
        />
      </View>

      {/* 메인 액션 버튼 (URL/이메일/전화) */}
      {barcode.type !== 'text' && (
        <View className="px-5 pb-5 pt-3">
          <TouchableOpacity
            onPress={handleOpenAction}
            style={{ backgroundColor: color }}
            className="py-3 rounded-xl items-center"
          >
            <Text className="text-white font-semibold">{actionLabel[barcode.type]}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  emoji: string;
  onPress: () => void;
  disabled?: boolean;
  last?: boolean;
};

function ActionButton({ label, emoji, onPress, disabled = false, last = false }: ActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`flex-1 py-3 items-center${last ? '' : ' border-r border-gray-100'}`}
      style={{ opacity: disabled ? 0.35 : 1 }}
    >
      <Text className="text-lg">{emoji}</Text>
      <Text className="text-xs text-gray-500 mt-1">{label}</Text>
    </TouchableOpacity>
  );
}
