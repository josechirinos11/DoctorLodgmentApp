// src/components/LoginForm.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const LoginForm: React.FC = () => {
  return (
    <View>
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      <Button title="Login" onPress={() => { /* Lógica de autenticación */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 8,
  },
});

export default LoginForm;
