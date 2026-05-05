import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView, StyleSheet } from 'react-native';
import BarcodeScanner from '@/components/BarcodeScanner';
import ResultCard from '@/components/ResultCard';
import { parseBarcode } from '@/utils/barcodeParser';
import { useScanStore } from '@/store/scanStore';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

type LastScan = { value: string; format: string; photoUri?: string } | null;

export default function ScanScreen() {
  const [lastScan, setLastScan] = useState<LastScan>(null);
  const addScan = useScanStore((s) => s.addScan);

  const handleScanned = useCallback(
    (value: string, format: string, photoUri?: string) => {
      setLastScan({ value, format, photoUri });
      addScan(value, format, photoUri);
    },
    [addScan]
  );

  return (
    <SafeAreaView style={styles.container}>
      <BarcodeScanner onScanned={handleScanned} />

      <Modal
        visible={!!lastScan}
        transparent
        animationType="slide"
        onRequestClose={() => setLastScan(null)}
      >
        <View style={styles.modalBackdrop}>
          {lastScan && (
            <ResultCard
              barcode={parseBarcode(lastScan.value)}
              format={lastScan.format}
              photoUri={lastScan.photoUri}
              onClose={() => setLastScan(null)}
            />
          )}
          <TouchableOpacity
            onPress={() => setLastScan(null)}
            style={styles.continueBtn}
          >
            <Text style={styles.continueBtnText}>계속 스캔하기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  modalBackdrop: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingBottom: SPACING.xl,
  },
  continueBtn: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    paddingVertical: 15,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  continueBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
});
