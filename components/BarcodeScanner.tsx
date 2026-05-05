import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

type Props = {
  onScanned: (value: string, format: string) => void;
};

export default function BarcodeScanner({ onScanned }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const cooldown = useRef(false);

  const handleBarcode = (result: BarcodeScanningResult) => {
    if (cooldown.current) return;
    cooldown.current = true;
    onScanned(result.data, result.type);
    setTimeout(() => {
      cooldown.current = false;
    }, 2000);
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">카메라 권한 확인 중...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-4xl mb-4">📷</Text>
        <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">
          카메라 접근 권한 필요
        </Text>
        <Text className="text-sm text-gray-500 mb-6 text-center">
          바코드 스캔을 위해 카메라 권한이 필요합니다.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-blue-500 px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">권한 허용</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: [
            'qr', 'ean13', 'ean8', 'upc_a', 'upc_e',
            'code128', 'code39', 'pdf417', 'datamatrix',
            'aztec', 'itf14', 'codabar',
          ],
        }}
        onBarcodeScanned={handleBarcode}
      />

      {/* 스캔 가이드 오버레이 */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View style={styles.scanFrame} />
          <Text className="text-white text-sm mt-4 opacity-80">
            바코드를 사각형 안에 맞춰주세요
          </Text>
        </View>
      </View>

      {/* 플래시 토글 */}
      <TouchableOpacity
        onPress={() => setTorch((v) => !v)}
        className="absolute bottom-8 self-center bg-white/20 px-6 py-3 rounded-full"
      >
        <Text className="text-white text-lg">{torch ? '🔦 끄기' : '🔦 켜기'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  scanFrame: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
});
