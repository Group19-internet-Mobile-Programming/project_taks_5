import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function DiagnoseLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    />
  );
}