import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';

type Props = {
  size: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function IconWrap({ size, color = COLORS.primaryLight, style, children }: Props) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
