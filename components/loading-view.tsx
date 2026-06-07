import React from 'react';
import { View, Text } from 'react-native';
import { sharedStyles } from '@/styles/shared';

interface StatusViewProps {
  message: string;
  type?: 'loading' | 'error' | 'empty';
}

export function StatusView({ message, type = 'loading' }: StatusViewProps) {
  const textStyle =
    type === 'error'
      ? sharedStyles.errorText
      : sharedStyles.loadingText;

  return (
    <View style={sharedStyles.centerContent}>
      <Text style={textStyle}>{message}</Text>
    </View>
  );
}
