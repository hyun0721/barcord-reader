import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { COLORS, RADIUS } from '@/constants/theme';
import IconWrap from '@/components/IconWrap';

type Props = {
  onScanned: (value: string, format: string, photoUri?: string) => void;
};

const FRAME_SIZE = 240;
const CORNER_SIZE = 28;
const CORNER_WIDTH = 4;

export default function BarcodeScanner({ onScanned }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const cooldown = useRef(false);

  const handleBarcode = async (result: BarcodeScanningResult) => {
    if (cooldown.current) return;
    cooldown.current = true;

    let photoUri: string | undefined;
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.85,
        skipProcessing: true,
      });
      photoUri = photo?.uri;
    } catch {
      // 촬영 실패해도 스캔 결과 전달
    }

    onScanned(result.data, result.type, photoUri);
    setTimeout(() => { cooldown.current = false; }, 2000);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.grayText}>카메라 권한 확인 중...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <IconWrap size={80} style={{ marginBottom: 20 }}>
          <Ionicons name="camera-outline" size={36} color={COLORS.primary} />
        </IconWrap>
        <Text style={styles.permissionTitle}>카메라 접근 권한 필요</Text>
        <Text style={styles.permissionDesc}>바코드 스캔을 위해 카메라 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnText}>권한 허용</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
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

      {/* 스캔 오버레이 */}
      <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="none">
        <View style={styles.frame}>
          {/* 모서리 마커 4개 */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.guideText}>바코드를 사각형 안에 맞춰주세요</Text>
      </View>

      {/* 플래시 토글 */}
      <TouchableOpacity
        onPress={() => setTorch((v) => !v)}
        style={[styles.torchBtn, torch && styles.torchBtnActive]}
      >
        <View style={styles.torchInner}>
          <Ionicons
            name={torch ? 'flashlight' : 'flashlight-outline'}
            size={15}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.torchText, torch && styles.torchTextActive]}>
            {torch ? '끄기' : '켜기'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
    backgroundColor: COLORS.background,
  },
  grayText: { color: COLORS.textSecondary },
  permissionTitle: {
    fontSize: 18, fontWeight: '700', color: COLORS.textPrimary,
    marginBottom: 8, textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 14, color: COLORS.textSecondary,
    textAlign: 'center', marginBottom: 28, lineHeight: 20,
  },
  permissionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40, paddingVertical: 14,
    borderRadius: RADIUS.pill,
  },
  permissionBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  overlay: {
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.overlay,
  },
  frame: {
    width: FRAME_SIZE, height: FRAME_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE, height: CORNER_SIZE,
    borderColor: COLORS.primary,
  },
  cornerTL: {
    top: 0, left: 0,
    borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: RADIUS.sm,
  },
  cornerTR: {
    top: 0, right: 0,
    borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: RADIUS.sm,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: RADIUS.sm,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: RADIUS.sm,
  },
  guideText: {
    color: COLORS.white, fontSize: 13, marginTop: 20, opacity: 0.9, letterSpacing: 0.2,
  },
  torchBtn: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  torchBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  torchInner: { flexDirection: 'row', alignItems: 'center' },
  torchText: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
  torchTextActive: { color: COLORS.white },
});
