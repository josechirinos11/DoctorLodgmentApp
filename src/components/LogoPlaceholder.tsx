import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type LogoPlaceholderProps = {
  size?: number;
  color?: string;
};

const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({ 
  size = 100,
  color = '#2e78b7'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons name="medical" size={size * 0.6} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogoPlaceholder; 