import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useScanStore, ScanRecord } from '@/store/scanStore';
import ResultCard from '@/components/ResultCard';
import { parseBarcode, formatBarcodeType } from '@/utils/barcodeParser';

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
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-5xl mb-4">📋</Text>
        <Text className="text-lg font-semibold text-gray-600">스캔 기록이 없습니다</Text>
        <Text className="text-sm text-gray-400 mt-1">바코드를 스캔하면 여기에 기록됩니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListHeaderComponent={
          <TouchableOpacity onPress={handleClear} className="mx-4 mb-2 items-end">
            <Text className="text-red-400 text-sm">전체 삭제</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item)}
            className="mx-4 mb-2 bg-white rounded-xl px-4 py-3 flex-row items-center shadow-sm"
          >
            <View className="flex-1 mr-3">
              <Text className="text-xs text-gray-400 mb-1">{formatBarcodeType(item.format)}</Text>
              <Text className="text-sm text-gray-800 font-medium" numberOfLines={1}>
                {item.value}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                {new Date(item.scannedAt).toLocaleString('ko-KR')}
              </Text>
            </View>
            <Text className="text-gray-300">›</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <View className="flex-1 justify-end bg-black/50 pb-8">
          {selected && (
            <ResultCard
              barcode={parseBarcode(selected.value)}
              format={selected.format}
              scannedAt={selected.scannedAt}
              onClose={() => setSelected(null)}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
