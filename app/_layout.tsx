import '../global.css';
import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useScanStore } from '@/store/scanStore';

export default function RootLayout() {
  const loadHistory = useScanStore((s) => s.loadHistory);

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#1E3A5F' },
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#1E3A5F',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '바코드 스캔',
            tabBarLabel: '스캔',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="📷" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: '스캔 기록',
            tabBarLabel: '기록',
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="📋" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: color === '#1E3A5F' ? 1 : 0.5 }}>{emoji}</Text>;
}
