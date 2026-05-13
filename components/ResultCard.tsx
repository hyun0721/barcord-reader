import React, { useState } from 'react';
import type { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { ParsedBarcode, formatBarcodeType, getBarcodeFormatInfo } from '@/utils/barcodeParser';
import { COLORS, RADIUS, SPACING, TYPE_COLORS } from '@/constants/theme';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  barcode: ParsedBarcode;
  format: string;
  photoUri?: string;
  scannedAt?: string;
  onClose?: () => void;
};

const OPEN_LABEL: Record<string, string> = {
  url: '브라우저에서 열기',
  email: '메일 앱 열기',
  phone: '전화 걸기',
  text: '',
};

export default function ResultCard({ barcode, format, photoUri, scannedAt, onClose }: Props) {
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatInfo = getBarcodeFormatInfo(format);
  const accentColor = TYPE_COLORS[barcode.type as keyof typeof TYPE_COLORS];

  const handleOpenAction = () => {
    if (barcode.type === 'url') {
      Linking.openURL(barcode.value).catch(() => Alert.alert('오류', 'URL을 열 수 없습니다.'));
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

  return (
    <View style={styles.card}>
      {/* 상단 색상 바 */}
      <View style={[styles.topBar, { backgroundColor: accentColor }]} />

      <View style={styles.body}>
        {/* 헤더 행 */}
        <View style={styles.headerRow}>
          <View style={[styles.typeBadge, { backgroundColor: accentColor + '20' }]}>
            <Text style={[styles.typeBadgeText, { color: accentColor }]}>{barcode.label}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleShowFormatInfo} style={styles.formatChip}>
              <Text style={styles.formatChipText}>
                {formatInfo ? formatInfo.displayName : formatBarcodeType(format)}
              </Text>
              {formatInfo && (
                <Ionicons name="information-circle-outline" size={13} color={COLORS.primary} style={{ marginLeft: 2 }} />
              )}
            </TouchableOpacity>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 바코드 값 */}
        <Text style={styles.value} selectable numberOfLines={3}>
          {barcode.value}
        </Text>

        {scannedAt && (
          <Text style={styles.timestamp}>{new Date(scannedAt).toLocaleString('ko-KR')}</Text>
        )}
      </View>

      {/* 액션 버튼 3종 */}
      <View style={styles.actionRow}>
        <ActionBtn icon="clipboard-outline" label="값 복사" onPress={handleCopyValue} />
        <View style={styles.dividerV} />
        <ActionBtn
          icon="image-outline"
          label={copying ? '복사 중…' : '이미지 복사'}
          onPress={handleCopyImage}
          disabled={!photoUri || copying}
        />
        <View style={styles.dividerV} />
        <ActionBtn
          icon="save-outline"
          label={saving ? '저장 중…' : '갤러리 저장'}
          onPress={handleSaveToGallery}
          disabled={!photoUri || saving}
        />
      </View>

      {/* 메인 CTA 영역 */}
      <View style={styles.ctaArea}>
        {barcode.type !== 'text' && (
          <TouchableOpacity
            onPress={handleOpenAction}
            style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
          >
            <Text style={styles.primaryBtnText}>{OPEN_LABEL[barcode.type]}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

type ActionBtnProps = {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

function ActionBtn({ icon, label, onPress, disabled = false }: ActionBtnProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.actionBtn, disabled && styles.actionBtnDisabled]}
    >
      <Ionicons name={icon} size={18} color={COLORS.textSecondary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  topBar: { height: 4 },
  body: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  typeBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  formatChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.pill,
  },
  formatChipText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
  },
  value: {
    fontSize: 15, color: COLORS.textPrimary, fontWeight: '500',
    marginTop: 12, lineHeight: 22,
  },
  timestamp: { fontSize: 11, color: COLORS.textSecondary, marginTop: 6 },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  dividerV: { width: 1, backgroundColor: COLORS.border },
  actionBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  actionBtnDisabled: { opacity: 0.3 },
  actionLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 3, fontWeight: '500' },
  ctaArea: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  primaryBtn: {
    paddingVertical: 15, borderRadius: RADIUS.pill, alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
