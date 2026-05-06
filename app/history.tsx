import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Alert, SafeAreaView, Modal, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useScanStore, ScanRecord } from '@/store/scanStore';
import ResultCard from '@/components/ResultCard';
import { parseBarcode, formatBarcodeType } from '@/utils/barcodeParser';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

const TYPE_DOT: Record<string, string> = {
  url: '#3B82F6',
  email: '#10B981',
  phone: '#F59E0B',
  text: COLORS.textSecondary,
};

function getContentType(value: string) {
  if (/^https?:\/\//i.test(value)) return 'url';
  if (/^mailto:|@/.test(value)) return 'email';
  if (/^tel:|^\+?[\d\s\-()]{7,}$/.test(value)) return 'phone';
  return 'text';
}

export default function HistoryScreen() {
  const { history, clearHistory } = useScanStore();
  const [selected, setSelected] = useState<ScanRecord | null>(null);

  const handleClear = () => {
    Alert.alert('기록 삭제', '모든 스캔 기록을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: clearHistory },
    ]);
  };

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="clipboard-outline" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.emptyTitle}>스캔 기록이 없습니다</Text>
        <Text style={styles.emptyDesc}>바코드를 스캔하면 여기에 기록됩니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: SPACING.sm }}
        ListHeaderComponent={
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>전체 삭제</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => {
          const contentType = getContentType(item.value);
          const dotColor = TYPE_DOT[contentType];
          return (
            <TouchableOpacity onPress={() => setSelected(item)} style={styles.card}>
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
              <View style={styles.cardBody}>
                <Text style={styles.cardFormat}>{formatBarcodeType(item.format)}</Text>
                <Text style={styles.cardValue} numberOfLines={1}>{item.value}</Text>
                <Text style={styles.cardTime}>
                  {new Date(item.scannedAt).toLocaleString('ko-KR')}
                </Text>
              </View>
              <View style={styles.cardRight}>
                {item.photoUri && <Ionicons name="image-outline" size={14} color={COLORS.textSecondary} />}
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalBackdrop}>
          {selected && (
            <ResultCard
              barcode={parseBarcode(selected.value)}
              format={selected.format}
              photoUri={selected.photoUri}
              scannedAt={selected.scannedAt}
              onClose={() => setSelected(null)}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  emptyContainer: {
    flex: 1, backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6,
  },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary },
  clearBtn: { alignItems: 'flex-end', paddingHorizontal: SPACING.md, paddingVertical: 6 },
  clearBtnText: { fontSize: 13, color: '#EF4444', fontWeight: '500' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.md, marginBottom: 8,
    borderRadius: RADIUS.lg, paddingVertical: 14, paddingHorizontal: SPACING.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  cardBody: { flex: 1 },
  cardFormat: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 3, fontWeight: '500' },
  cardValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },
  cardTime: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chevron: { fontSize: 20, color: COLORS.border, fontWeight: '300' },
  modalBackdrop: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingBottom: SPACING.xl,
  },
});
