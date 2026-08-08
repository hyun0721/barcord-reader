import React, { useState } from 'react';
import type { ComponentProps } from 'react';
import {
  View, Text, Image, Modal, ScrollView,
  TouchableOpacity, Pressable, Linking, Alert, StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { ScanRecord } from '@/store/scanStore';
import { parseBarcode, formatBarcodeType, getBarcodeFormatInfo } from '@/utils/barcodeParser';
import { COLORS, RADIUS, SPACING, TYPE_COLORS } from '@/constants/theme';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  record: ScanRecord | null;
  onClose: () => void;
};

const IMAGE_HEIGHT = Dimensions.get('window').width * 0.75;

const OPEN_LABEL: Record<string, string> = {
  url: '브라우저에서 열기',
  email: '메일 앱 열기',
  phone: '전화 걸기',
};

export default function HistoryDetailModal({ record, onClose }: Props) {
  const [copying, setCopying] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!record) return null;

  const barcode = parseBarcode(record.value);
  const formatInfo = getBarcodeFormatInfo(record.format);
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
    if (!record.photoUri) return;
    setCopying(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const base64 = await FileSystem.readAsStringAsync(record.photoUri, { encoding: 'base64' as any });
      await Clipboard.setImageAsync(base64);
      Alert.alert('복사 완료', '이미지가 클립보드에 복사되었습니다.');
    } catch (e) {
      console.error('[handleCopyImage]', e);
      Alert.alert('오류', '이미지를 복사하는 데 실패했습니다.');
    } finally {
      setCopying(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!record.photoUri) return;
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 저장을 위해 사진 라이브러리 권한이 필요합니다.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(record.photoUri);
      Alert.alert('저장 완료', '이미지가 갤러리에 저장되었습니다.');
    } catch {
      Alert.alert('오류', '갤러리 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={!!record}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          {/* 닫기 버튼 */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 이미지 영역 */}
            {record.photoUri ? (
              <Image
                source={{ uri: record.photoUri }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="barcode-outline" size={64} color={COLORS.border} />
                <Text style={styles.placeholderText}>이미지 없음</Text>
              </View>
            )}

            {/* 상단 색상 바 */}
            <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

            {/* 정보 영역 */}
            <View style={styles.infoSection}>
              {/* 타입 뱃지 + 포맷 칩 */}
              <View style={styles.badgeRow}>
                <View style={[styles.typeBadge, { backgroundColor: accentColor + '20' }]}>
                  <Text style={[styles.typeBadgeText, { color: accentColor }]}>{barcode.label}</Text>
                </View>
                <View style={styles.formatChip}>
                  <Text style={styles.formatChipText}>
                    {formatInfo ? formatInfo.displayName : formatBarcodeType(record.format)}
                  </Text>
                </View>
              </View>

              {/* 바코드 값 */}
              <Text style={styles.value} selectable>
                {barcode.value}
              </Text>

              {/* 스캔 일시 */}
              <Text style={styles.timestamp}>
                {new Date(record.scannedAt).toLocaleString('ko-KR')}
              </Text>
            </View>

            {/* 액션 버튼 3종 */}
            <View style={styles.actionRow}>
              <ActionBtn icon="clipboard-outline" label="값 복사" onPress={handleCopyValue} />
              <View style={styles.dividerV} />
              <ActionBtn
                icon="image-outline"
                label={copying ? '복사 중…' : '이미지 복사'}
                onPress={handleCopyImage}
                disabled={!record.photoUri || copying}
              />
              <View style={styles.dividerV} />
              <ActionBtn
                icon="save-outline"
                label={saving ? '저장 중…' : '갤러리 저장'}
                onPress={handleSaveToGallery}
                disabled={!record.photoUri || saving}
              />
            </View>

            {/* CTA 버튼 */}
            {barcode.type !== 'text' && (
              <View style={styles.ctaArea}>
                <TouchableOpacity
                  onPress={handleOpenAction}
                  style={[styles.primaryBtn, { backgroundColor: COLORS.primary }]}
                >
                  <Text style={styles.primaryBtnText}>{OPEN_LABEL[barcode.type]}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.md,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: COLORS.background,
  },
  imagePlaceholder: {
    width: '100%',
    height: IMAGE_HEIGHT * 0.6,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  accentBar: {
    height: 4,
  },
  infoSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  formatChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  formatChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dividerV: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionBtnDisabled: {
    opacity: 0.3,
  },
  actionLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  ctaArea: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  primaryBtn: {
    paddingVertical: 15,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
