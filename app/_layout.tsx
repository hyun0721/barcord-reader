import '../global.css';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useScanStore } from '@/store/scanStore';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  const loadHistory = useScanStore((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <>
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
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5, color }}>📷</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: '스캔 기록',
            tabBarLabel: '기록',
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5, color }}>📋</Text>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
