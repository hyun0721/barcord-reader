import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import BarcodeScanner from '@/components/BarcodeScanner';
import ResultCard from '@/components/ResultCard';
import { parseBarcode } from '@/utils/barcodeParser';
import { useScanStore } from '@/store/scanStore';

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
    <SafeAreaView className="flex-1 bg-gray-900">
      <BarcodeScanner onScanned={handleScanned} />

      <Modal
        visible={!!lastScan}
        transparent
        animationType="slide"
        onRequestClose={() => setLastScan(null)}
      >
        <View className="flex-1 justify-end bg-black/50 pb-8">
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
            className="mt-4 mx-4 py-3 rounded-xl border border-white/30 items-center"
          >
            <Text className="text-white font-semibold">계속 스캔하기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
