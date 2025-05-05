// src/components/AuthSwitcher.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AuthSwitcherProps {
  activeForm: 'login' | 'signup';
  onSwitch: (form: 'login' | 'signup') => void;
}

const AuthSwitcher: React.FC<AuthSwitcherProps> = ({ activeForm, onSwitch }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onSwitch('login')}>
        <Text style={[styles.button, activeForm === 'login' && styles.active]}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSwitch('signup')}>
        <Text style={[styles.button, activeForm === 'signup' && styles.active]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    zIndex: 1,
  },
  button: {
    marginLeft: 10,
    padding: 8,
    color: '#000',
  },
  active: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default AuthSwitcher;
