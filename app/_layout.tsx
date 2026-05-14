import '../global.css';
import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useScanStore } from '@/store/scanStore';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  const loadHistory = useScanStore((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '바코드 스캔',
            tabBarLabel: '스캔',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="camera-outline" size={22} color={color} style={{ opacity: focused ? 1 : 0.5 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: '스캔 기록',
            tabBarLabel: '기록',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="clipboard-outline" size={22} color={color} style={{ opacity: focused ? 1 : 0.5 }} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
